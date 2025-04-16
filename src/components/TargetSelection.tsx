
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Database, FileText } from "lucide-react";

interface TargetSelectionProps {
  source: string;
  target: string;
  setTarget: (target: string) => void;
}

const TargetSelection: React.FC<TargetSelectionProps> = ({ source, target, setTarget }) => {
  // If source is clickhouse, target should be flatfile and vice versa
  const targetType = source === 'clickhouse' ? 'flatfile' : 'clickhouse';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Target Configuration</CardTitle>
        <CardDescription>Where the data will be ingested</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 flex items-center space-x-4 bg-primary/5 border-primary">
          {targetType === 'clickhouse' ? (
            <>
              <Database className="h-6 w-6 text-primary" />
              <span className="font-medium">ClickHouse</span>
            </>
          ) : (
            <>
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-medium">Flat File</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TargetSelection;
