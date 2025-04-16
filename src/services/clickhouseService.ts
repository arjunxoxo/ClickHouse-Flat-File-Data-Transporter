
// This is a mock service for ClickHouse interaction
// In a real implementation, you would use a ClickHouse client library to connect to a real ClickHouse instance

interface ClickHouseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  jwtToken: string;
}

// Mock database schema and data
const mockTables = {
  'uk_price_paid': [
    { name: 'transaction_id', type: 'String', selected: false },
    { name: 'price', type: 'UInt32', selected: false },
    { name: 'date_of_transfer', type: 'Date', selected: false },
    { name: 'postcode', type: 'String', selected: false },
    { name: 'property_type', type: 'String', selected: false },
    { name: 'old_new', type: 'String', selected: false },
    { name: 'duration', type: 'String', selected: false },
    { name: 'town_city', type: 'String', selected: false },
    { name: 'district', type: 'String', selected: false },
    { name: 'county', type: 'String', selected: false }
  ],
  'ontime': [
    { name: 'Year', type: 'UInt16', selected: false },
    { name: 'Quarter', type: 'UInt8', selected: false },
    { name: 'Month', type: 'UInt8', selected: false },
    { name: 'DayofMonth', type: 'UInt8', selected: false },
    { name: 'DayOfWeek', type: 'UInt8', selected: false },
    { name: 'FlightDate', type: 'Date', selected: false },
    { name: 'UniqueCarrier', type: 'String', selected: false },
    { name: 'AirlineID', type: 'UInt32', selected: false },
    { name: 'Carrier', type: 'String', selected: false },
    { name: 'TailNum', type: 'String', selected: false },
    { name: 'FlightNum', type: 'String', selected: false },
    { name: 'OriginAirportID', type: 'UInt32', selected: false },
    { name: 'OriginAirportSeqID', type: 'UInt32', selected: false },
    { name: 'OriginCityMarketID', type: 'UInt32', selected: false },
    { name: 'Origin', type: 'String', selected: false },
    { name: 'OriginCityName', type: 'String', selected: false },
    { name: 'OriginState', type: 'String', selected: false },
    { name: 'OriginStateFips', type: 'String', selected: false },
    { name: 'OriginStateName', type: 'String', selected: false },
    { name: 'OriginWac', type: 'UInt32', selected: false },
    { name: 'DestAirportID', type: 'UInt32', selected: false },
    { name: 'DestAirportSeqID', type: 'UInt32', selected: false },
    { name: 'DestCityMarketID', type: 'UInt32', selected: false },
    { name: 'Dest', type: 'String', selected: false },
    { name: 'DestCityName', type: 'String', selected: false },
    { name: 'DestState', type: 'String', selected: false },
    { name: 'DestStateFips', type: 'String', selected: false },
    { name: 'DestStateName', type: 'String', selected: false },
    { name: 'DestWac', type: 'UInt32', selected: false }
  ]
};

// Mock data
const mockData = {
  'uk_price_paid': Array.from({ length: 1000 }, (_, i) => ({
    transaction_id: `TX${100000 + i}`,
    price: 200000 + Math.floor(Math.random() * 800000),
    date_of_transfer: `2023-0${1 + Math.floor(Math.random() * 9)}-${1 + Math.floor(Math.random() * 28)}`,
    postcode: `SW${1 + Math.floor(Math.random() * 20)} ${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    property_type: ['Detached', 'Semi-detached', 'Terraced', 'Flat'][Math.floor(Math.random() * 4)],
    old_new: ['Old', 'New'][Math.floor(Math.random() * 2)],
    duration: ['Freehold', 'Leasehold'][Math.floor(Math.random() * 2)],
    town_city: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol'][Math.floor(Math.random() * 5)],
    district: ['Westminster', 'Camden', 'Islington', 'Hackney', 'Tower Hamlets'][Math.floor(Math.random() * 5)],
    county: ['Greater London', 'Greater Manchester', 'West Midlands', 'Merseyside', 'Bristol'][Math.floor(Math.random() * 5)]
  })),
  'ontime': Array.from({ length: 1000 }, (_, i) => ({
    Year: 2022 + Math.floor(Math.random() * 2),
    Quarter: 1 + Math.floor(Math.random() * 4),
    Month: 1 + Math.floor(Math.random() * 12),
    DayofMonth: 1 + Math.floor(Math.random() * 28),
    DayOfWeek: 1 + Math.floor(Math.random() * 7),
    FlightDate: `2023-0${1 + Math.floor(Math.random() * 9)}-${1 + Math.floor(Math.random() * 28)}`,
    UniqueCarrier: ['AA', 'DL', 'UA', 'WN', 'B6'][Math.floor(Math.random() * 5)],
    AirlineID: 10000 + Math.floor(Math.random() * 1000),
    Carrier: ['American', 'Delta', 'United', 'Southwest', 'JetBlue'][Math.floor(Math.random() * 5)],
    TailNum: `N${100 + Math.floor(Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    FlightNum: `${1000 + Math.floor(Math.random() * 9000)}`,
    OriginAirportID: 10000 + Math.floor(Math.random() * 1000),
    OriginAirportSeqID: 10000 + Math.floor(Math.random() * 1000),
    OriginCityMarketID: 10000 + Math.floor(Math.random() * 1000),
    Origin: ['JFK', 'LAX', 'ORD', 'DFW', 'ATL'][Math.floor(Math.random() * 5)],
    OriginCityName: ['New York', 'Los Angeles', 'Chicago', 'Dallas', 'Atlanta'][Math.floor(Math.random() * 5)],
    OriginState: ['NY', 'CA', 'IL', 'TX', 'GA'][Math.floor(Math.random() * 5)],
    OriginStateFips: ['36', '06', '17', '48', '13'][Math.floor(Math.random() * 5)],
    OriginStateName: ['New York', 'California', 'Illinois', 'Texas', 'Georgia'][Math.floor(Math.random() * 5)],
    OriginWac: 1 + Math.floor(Math.random() * 99),
    DestAirportID: 10000 + Math.floor(Math.random() * 1000),
    DestAirportSeqID: 10000 + Math.floor(Math.random() * 1000),
    DestCityMarketID: 10000 + Math.floor(Math.random() * 1000),
    Dest: ['JFK', 'LAX', 'ORD', 'DFW', 'ATL'][Math.floor(Math.random() * 5)],
    DestCityName: ['New York', 'Los Angeles', 'Chicago', 'Dallas', 'Atlanta'][Math.floor(Math.random() * 5)],
    DestState: ['NY', 'CA', 'IL', 'TX', 'GA'][Math.floor(Math.random() * 5)],
    DestStateFips: ['36', '06', '17', '48', '13'][Math.floor(Math.random() * 5)],
    DestStateName: ['New York', 'California', 'Illinois', 'Texas', 'Georgia'][Math.floor(Math.random() * 5)],
    DestWac: 1 + Math.floor(Math.random() * 99)
  }))
};

// Mock tables in the database
const availableTables = ['uk_price_paid', 'ontime'];

export const clickhouseService = {
  // Connect to ClickHouse
  connect: async (config: ClickHouseConfig): Promise<boolean> => {
    console.log('Connecting to ClickHouse with config:', config);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Validate required fields
    if (!config.host || !config.port || !config.database || !config.user || !config.jwtToken) {
      throw new Error('All connection fields are required');
    }
    
    // Simulate connection success (in a real app, we would check the connection)
    return true;
  },
  
  // Get list of tables
  getTables: async (config: ClickHouseConfig): Promise<string[]> => {
    console.log('Getting tables from ClickHouse');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return availableTables;
  },
  
  // Get columns for a table
  getColumns: async (config: ClickHouseConfig, table: string) => {
    console.log(`Getting columns for table: ${table}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!mockTables[table as keyof typeof mockTables]) {
      throw new Error(`Table ${table} not found`);
    }
    
    return mockTables[table as keyof typeof mockTables];
  },
  
  // Get preview data
  getPreviewData: async (config: ClickHouseConfig, table: string, columns: string[]) => {
    console.log(`Getting preview data for table: ${table}, columns: ${columns.join(', ')}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!mockData[table as keyof typeof mockData]) {
      throw new Error(`Table ${table} not found`);
    }
    
    const tableData = mockData[table as keyof typeof mockData];
    
    // Filter only the columns we want
    const previewData = tableData.slice(0, 100).map(row => {
      const filteredRow: {[key: string]: any} = {};
      columns.forEach(col => {
        filteredRow[col] = row[col as keyof typeof row];
      });
      return filteredRow;
    });
    
    return previewData;
  },
  
  // Start data ingestion
  startIngestion: async (
    config: ClickHouseConfig, 
    table: string, 
    columns: string[], 
    progressCallback: (progress: number, records: number) => void
  ) => {
    console.log(`Starting ingestion from table: ${table}, columns: ${columns.join(', ')}`);
    
    if (!mockData[table as keyof typeof mockData]) {
      throw new Error(`Table ${table} not found`);
    }
    
    const totalRecords = mockData[table as keyof typeof mockData].length;
    let processedRecords = 0;
    
    // Simulate ingestion with progress updates
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const progress = i * 10;
      processedRecords = Math.floor((progress / 100) * totalRecords);
      
      progressCallback(progress, processedRecords);
    }
    
    return totalRecords;
  }
};
