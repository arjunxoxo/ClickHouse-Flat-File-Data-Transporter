
import React, { useState, useEffect } from 'react';
import SourceSelection from "@/components/SourceSelection";
import ClickHouseConfig from "@/components/ClickHouseConfig";
import FlatFileConfig from "@/components/FlatFileConfig";
import TargetSelection from "@/components/TargetSelection";
import ColumnSelection from "@/components/ColumnSelection";
import IngestionControl from "@/components/IngestionControl";
import DataPreview from "@/components/DataPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clickhouseService } from "@/services/clickhouseService";
import { flatFileService } from "@/services/flatFileService";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDown, Database, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface Column {
  name: string;
  type: string;
  selected: boolean;
}

const Index = () => {
  const { toast } = useToast();
  
  // Source selection state
  const [source, setSource] = useState('clickhouse');
  const [target, setTarget] = useState('flatfile');
  
  // Connection state
  const [chConfig, setChConfig] = useState({
    host: '',
    port: '',
    database: '',
    user: '',
    jwtToken: ''
  });
  const [ffConfig, setFfConfig] = useState({
    fileName: '',
    delimiter: ',',
    fileContent: null
  });
  
  // Connection status
  const [isChConnected, setIsChConnected] = useState(false);
  const [isChConnecting, setIsChConnecting] = useState(false);
  const [chConnectionError, setChConnectionError] = useState<string | null>(null);
  
  const [isFfLoaded, setIsFfLoaded] = useState(false);
  const [isFfLoading, setIsFfLoading] = useState(false);
  const [ffLoadError, setFfLoadError] = useState<string | null>(null);
  
  // Data state
  const [selectedTable, setSelectedTable] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);
  const [parsedData, setParsedData] = useState<any | null>(null);
  
  // Column selection state
  const [isFetchingColumns, setIsFetchingColumns] = useState(false);
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isPreviewingData, setIsPreviewingData] = useState(false);
  
  // Ingestion state
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestionProgress, setIngestionProgress] = useState(0);
  const [recordsProcessed, setRecordsProcessed] = useState<number | null>(null);
  const [ingestionError, setIngestionError] = useState<string | null>(null);
  
  // Step tabs
  const [currentTab, setCurrentTab] = useState('source');
  
  // Update target when source changes
  useEffect(() => {
    if (source === 'clickhouse') {
      setTarget('flatfile');
    } else {
      setTarget('clickhouse');
    }
  }, [source]);
  
  // Connect to ClickHouse
  const handleConnectToClickHouse = async () => {
    setIsChConnecting(true);
    setChConnectionError(null);
    
    try {
      await clickhouseService.connect(chConfig);
      setIsChConnected(true);
      toast({
        title: "Connected to ClickHouse",
        description: "Successfully connected to the ClickHouse database",
      });
      
      // Get tables and select the first one
      const tables = await clickhouseService.getTables(chConfig);
      if (tables.length > 0) {
        setSelectedTable(tables[0]);
        
        // Fetch columns for the first table
        fetchColumns();
      }
      
      // Move to next tab after successful connection
      setCurrentTab('columns');
      
    } catch (error) {
      console.error('Failed to connect to ClickHouse:', error);
      setChConnectionError(error instanceof Error ? error.message : 'Failed to connect to ClickHouse');
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to ClickHouse',
        variant: "destructive"
      });
    } finally {
      setIsChConnecting(false);
    }
  };
  
  // Load flat file
  const handleLoadFlatFile = async (file: File) => {
    setIsFfLoading(true);
    setFfLoadError(null);
    
    try {
      const parsedResult = await flatFileService.parseFile(file, ffConfig.delimiter);
      setParsedData(parsedResult);
      
      const extractedColumns = flatFileService.getColumns(parsedResult);
      setColumns(extractedColumns);
      
      setIsFfLoaded(true);
      toast({
        title: "File Loaded",
        description: `Successfully loaded ${file.name}`,
      });
      
      // Move to next tab after successful load
      setCurrentTab('columns');
      
    } catch (error) {
      console.error('Failed to load flat file:', error);
      setFfLoadError(error instanceof Error ? error.message : 'Failed to parse file');
      toast({
        title: "File Load Failed",
        description: error instanceof Error ? error.message : 'Failed to parse file',
        variant: "destructive"
      });
    } finally {
      setIsFfLoading(false);
    }
  };
  
  // Fetch columns
  const fetchColumns = async () => {
    setIsFetchingColumns(true);
    
    try {
      if (source === 'clickhouse' && selectedTable) {
        const fetchedColumns = await clickhouseService.getColumns(chConfig, selectedTable);
        setColumns(fetchedColumns);
        toast({
          title: "Columns Loaded",
          description: `Loaded ${fetchedColumns.length} columns from ${selectedTable}`,
        });
      }
      else if (source === 'flatfile' && parsedData) {
        const extractedColumns = flatFileService.getColumns(parsedData);
        setColumns(extractedColumns);
        toast({
          title: "Columns Loaded",
          description: `Loaded ${extractedColumns.length} columns from file`,
        });
      }
    } catch (error) {
      console.error('Failed to fetch columns:', error);
      toast({
        title: "Failed to Load Columns",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsFetchingColumns(false);
    }
  };
  
  // Handle column changes
  const handleColumnChange = (updatedColumns: Column[]) => {
    setColumns(updatedColumns);
  };
  
  // Preview data
  const handlePreviewData = async () => {
    setIsPreviewingData(true);
    
    try {
      const selectedColumnNames = columns.filter(col => col.selected).map(col => col.name);
      
      if (selectedColumnNames.length === 0) {
        throw new Error('No columns selected for preview');
      }
      
      let previewResult;
      
      if (source === 'clickhouse') {
        previewResult = await clickhouseService.getPreviewData(chConfig, selectedTable, selectedColumnNames);
      } else {
        previewResult = flatFileService.getPreviewData(parsedData, selectedColumnNames);
      }
      
      setPreviewData(previewResult);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Failed to preview data:', error);
      toast({
        title: "Preview Failed",
        description: error instanceof Error ? error.message : 'Failed to load preview data',
        variant: "destructive"
      });
    } finally {
      setIsPreviewingData(false);
    }
  };
  
  // Start ingestion
  const handleStartIngestion = async () => {
    setIsIngesting(true);
    setIngestionProgress(0);
    setRecordsProcessed(0);
    setIngestionError(null);
    
    try {
      const selectedColumnNames = columns.filter(col => col.selected).map(col => col.name);
      
      if (selectedColumnNames.length === 0) {
        throw new Error('No columns selected for ingestion');
      }
      
      // Move to ingestion tab
      setCurrentTab('ingestion');
      
      // Handle different ingestion directions
      if (source === 'clickhouse' && target === 'flatfile') {
        // ClickHouse to Flat File
        const progressCallback = (progress: number, records: number) => {
          setIngestionProgress(progress);
          setRecordsProcessed(records);
        };
        
        // First get the data
        const data = await clickhouseService.getPreviewData(chConfig, selectedTable, selectedColumnNames);
        
        // Then export to flat file
        const csvContent = await flatFileService.exportToFlatFile(
          data, 
          selectedColumnNames, 
          ffConfig.delimiter, 
          progressCallback
        );
        
        // Trigger download of the file
        if (ingestionProgress === 100) {
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${selectedTable}_export.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        
      } else if (source === 'flatfile' && target === 'clickhouse') {
        // Flat File to ClickHouse
        const progressCallback = (progress: number, records: number) => {
          setIngestionProgress(progress);
          setRecordsProcessed(records);
        };
        
        // Simulate ingestion
        await flatFileService.startIngestion(parsedData, selectedColumnNames, progressCallback);
      }
      
      toast({
        title: "Ingestion Complete",
        description: `Successfully processed ${recordsProcessed} records`,
      });
      
    } catch (error) {
      console.error('Ingestion failed:', error);
      setIngestionError(error instanceof Error ? error.message : 'Ingestion failed');
      toast({
        title: "Ingestion Failed",
        description: error instanceof Error ? error.message : 'An error occurred during ingestion',
        variant: "destructive"
      });
    } finally {
      setIsIngesting(false);
    }
  };
  
  // Stop ingestion
  const handleStopIngestion = () => {
    setIsIngesting(false);
    toast({
      title: "Ingestion Stopped",
      description: "The ingestion process was stopped by user",
    });
  };
  
  // Determine if we can start ingestion
  const canStartIngestion = () => {
    // Need at least one column selected
    const hasSelectedColumns = columns.some(col => col.selected);
    
    // Source needs to be ready
    const isSourceReady = source === 'clickhouse' ? isChConnected : isFfLoaded;
    
    return hasSelectedColumns && isSourceReady && !isIngesting;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">ClickHouse-Flat File Data Transporter</h1>
          <p className="text-muted-foreground mt-2">Bidirectional data ingestion between ClickHouse and Flat Files</p>
        </header>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="source">1. Source & Target</TabsTrigger>
            <TabsTrigger value="columns">2. Columns</TabsTrigger>
            <TabsTrigger value="ingestion">3. Ingestion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="source" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SourceSelection 
                  source={source} 
                  setSource={setSource}
                />
                
                {source === 'clickhouse' ? (
                  <ClickHouseConfig 
                    config={chConfig}
                    setConfig={setChConfig}
                    onConnect={handleConnectToClickHouse}
                    isConnecting={isChConnecting}
                    isConnected={isChConnected}
                    connectionError={chConnectionError}
                  />
                ) : (
                  <FlatFileConfig 
                    config={ffConfig}
                    setConfig={setFfConfig}
                    onLoadFile={handleLoadFlatFile}
                    isLoading={isFfLoading}
                    isLoaded={isFfLoaded}
                    loadError={ffLoadError}
                  />
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center my-6">
                  <div className="flex flex-col items-center">
                    <ArrowDown className="h-8 w-8 text-muted-foreground" />
                    <span className="mt-1 text-sm text-muted-foreground">Data Flow</span>
                  </div>
                </div>
                
                <TargetSelection 
                  source={source}
                  target={target}
                  setTarget={() => {}} // Target is determined by source
                />
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    {source === 'clickhouse' ? 
                      'Data will be exported from ClickHouse to a CSV file for download.' :
                      'Data will be imported from your flat file to ClickHouse.'
                    }
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => setCurrentTab('columns')}
                disabled={source === 'clickhouse' ? !isChConnected : !isFfLoaded}
              >
                Next: Select Columns
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="columns" className="space-y-6">
            <ColumnSelection 
              columns={columns}
              onColumnChange={handleColumnChange}
              onFetchColumns={fetchColumns}
              onPreviewData={handlePreviewData}
              isFetchingColumns={isFetchingColumns}
              isPreviewingData={isPreviewingData}
              source={source}
            />
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentTab('source')}
              >
                Back to Source
              </Button>
              <Button 
                onClick={() => setCurrentTab('ingestion')}
                disabled={!columns.some(col => col.selected)}
              >
                Next: Start Ingestion
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="ingestion" className="space-y-6">
            <IngestionControl 
              onStartIngestion={handleStartIngestion}
              onStopIngestion={handleStopIngestion}
              isIngesting={isIngesting}
              progress={ingestionProgress}
              recordsProcessed={recordsProcessed}
              error={ingestionError}
              canStart={canStartIngestion()}
            />
            
            <div className="flex justify-start mt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentTab('columns')}
                disabled={isIngesting}
              >
                Back to Columns
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DataPreview 
          visible={showPreview}
          onClose={() => setShowPreview(false)}
          previewData={previewData}
          columns={columns}
          isLoading={isPreviewingData}
        />
      </div>
    </div>
  );
};

export default Index;
