
// This service handles flat file operations

interface ParsedData {
  headers: string[];
  records: any[];
}

export const flatFileService = {
  // Parse a CSV/TSV file
  parseFile: async (file: File, delimiter: string): Promise<ParsedData> => {
    console.log(`Parsing file: ${file.name} with delimiter: ${delimiter}`);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const lines = content.split('\n');
          
          if (lines.length === 0) {
            reject(new Error('File is empty'));
            return;
          }
          
          // Parse headers
          const headers = lines[0].split(delimiter).map(header => header.trim());
          
          // Parse records
          const records = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const values = line.split(delimiter);
              const record: {[key: string]: any} = {};
              
              headers.forEach((header, index) => {
                record[header] = values[index] ? values[index].trim() : '';
              });
              
              records.push(record);
            }
          }
          
          resolve({
            headers,
            records
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  },
  
  // Get columns from parsed data
  getColumns: (parsedData: ParsedData) => {
    return parsedData.headers.map(header => ({
      name: header,
      type: 'String', // Default to string, could be improved with type inference
      selected: false
    }));
  },
  
  // Get preview data
  getPreviewData: (parsedData: ParsedData, selectedColumns: string[]) => {
    // Take first 100 records
    const previewData = parsedData.records.slice(0, 100).map(record => {
      const filteredRecord: {[key: string]: any} = {};
      selectedColumns.forEach(col => {
        filteredRecord[col] = record[col];
      });
      return filteredRecord;
    });
    
    return previewData;
  },
  
  // Start ingestion from flat file
  startIngestion: async (
    parsedData: ParsedData,
    selectedColumns: string[],
    progressCallback: (progress: number, records: number) => void
  ) => {
    console.log(`Starting ingestion from flat file with columns: ${selectedColumns.join(', ')}`);
    
    const totalRecords = parsedData.records.length;
    let processedRecords = 0;
    
    // Simulate ingestion with progress updates
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const progress = i * 10;
      processedRecords = Math.floor((progress / 100) * totalRecords);
      
      progressCallback(progress, processedRecords);
    }
    
    return totalRecords;
  },
  
  // Start ingestion to flat file
  exportToFlatFile: async (
    data: any[],
    selectedColumns: string[],
    delimiter: string, 
    progressCallback: (progress: number, records: number) => void
  ): Promise<string> => {
    console.log(`Exporting data to flat file with columns: ${selectedColumns.join(', ')}`);
    
    const totalRecords = data.length;
    let processedRecords = 0;
    
    // Create the CSV content
    let csvContent = selectedColumns.join(delimiter) + '\n';
    
    // Simulate processing with progress updates
    for (let i = 0; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const progress = i * 10;
      processedRecords = Math.floor((progress / 100) * totalRecords);
      
      if (i === 10) {
        // Add all records to CSV on final step
        data.forEach(record => {
          const row = selectedColumns.map(col => record[col] || '').join(delimiter);
          csvContent += row + '\n';
        });
      }
      
      progressCallback(progress, processedRecords);
    }
    
    return csvContent;
  }
};
