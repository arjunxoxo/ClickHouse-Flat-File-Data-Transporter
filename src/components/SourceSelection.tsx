
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Database, FileText } from "lucide-react";

interface SourceSelectionProps {
  source: string;
  setSource: (source: string) => void;
}

const SourceSelection: React.FC<SourceSelectionProps> = ({ source, setSource }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Select Data Source</CardTitle>
        <CardDescription>Choose the source for your data ingestion</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={source}
          onValueChange={setSource}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className={`border rounded-lg p-4 flex items-center space-x-4 cursor-pointer ${source === 'clickhouse' ? 'border-primary bg-primary/5' : 'border-border'}`}
            onClick={() => setSource('clickhouse')}>
            <RadioGroupItem value="clickhouse" id="clickhouse" className="sr-only" />
            <Database className="h-6 w-6 text-primary" />
            <Label htmlFor="clickhouse" className="cursor-pointer font-medium">ClickHouse</Label>
          </div>
          
          <div className={`border rounded-lg p-4 flex items-center space-x-4 cursor-pointer ${source === 'flatfile' ? 'border-primary bg-primary/5' : 'border-border'}`}
            onClick={() => setSource('flatfile')}>
            <RadioGroupItem value="flatfile" id="flatfile" className="sr-only" />
            <FileText className="h-6 w-6 text-primary" />
            <Label htmlFor="flatfile" className="cursor-pointer font-medium">Flat File</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default SourceSelection;
