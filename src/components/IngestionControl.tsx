import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayIcon, XIcon, LoaderIcon } from "lucide-react";

interface IngestionControlProps {
  onStartIngestion: () => void;
  onStopIngestion: () => void;
  isIngesting: boolean;
  progress: number;
  recordsProcessed: number | null;
  error: string | null;
  canStart: boolean;
}

const IngestionControl: React.FC<IngestionControlProps> = ({
  onStartIngestion,
  onStopIngestion,
  isIngesting,
  progress,
  recordsProcessed,
  error,
  canStart
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Data Ingestion Control</CardTitle>
        <CardDescription>Start or stop the data transfer process</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isIngesting && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Transfer Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <p className="text-sm text-muted-foreground">
              {recordsProcessed !== null ? `${recordsProcessed} records processed so far` : 'Processing...'}
            </p>
          </div>
        )}
        
        {!isIngesting && recordsProcessed !== null && !error && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
            <p className="font-medium">Transfer completed successfully!</p>
            <p className="text-sm mt-1">{recordsProcessed} records processed in total</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            <p className="font-medium">Error during ingestion</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isIngesting ? (
          <Button 
            variant="destructive" 
            onClick={onStopIngestion}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Stop Ingestion
          </Button>
        ) : (
          <Button 
            onClick={onStartIngestion} 
            disabled={!canStart || isIngesting}
          >
            {isIngesting ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Ingesting...
              </>
            ) : (
              <>
                <PlayIcon className="mr-2 h-4 w-4" />
                Start Ingestion
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default IngestionControl;
