
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon, LoaderIcon } from "lucide-react";

interface FlatFileConfigProps {
  config: {
    fileName: string;
    delimiter: string;
    fileContent: string | null;
  };
  setConfig: (config: any) => void;
  onLoadFile: (file: File) => void;
  isLoading: boolean;
  isLoaded: boolean;
  loadError: string | null;
}

const FlatFileConfig: React.FC<FlatFileConfigProps> = ({ 
  config, 
  setConfig, 
  onLoadFile,
  isLoading,
  isLoaded,
  loadError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConfig({ ...config, fileName: file.name });
      onLoadFile(file);
    }
  };

  const handleDelimiterChange = (value: string) => {
    setConfig({ ...config, delimiter: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Flat File Configuration</CardTitle>
        <CardDescription>Configure your flat file data source</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <div className="flex gap-2">
            <Input
              id="fileName"
              name="fileName"
              placeholder="Choose a file"
              value={config.fileName}
              readOnly
              className="flex-grow"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="whitespace-nowrap"
            >
              Browse
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.tsv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="delimiter">Delimiter</Label>
          <Select value={config.delimiter} onValueChange={handleDelimiterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select delimiter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=",">Comma (,)</SelectItem>
              <SelectItem value="\t">Tab</SelectItem>
              <SelectItem value="|">Pipe (|)</SelectItem>
              <SelectItem value=";">Semicolon (;)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {loadError && (
          <div className="text-sm text-destructive mt-2">{loadError}</div>
        )}
        
        {isLoaded && (
          <div className="flex items-center text-sm text-green-600">
            <CheckIcon className="mr-2 h-4 w-4" />
            File loaded successfully
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center text-sm">
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Loading file...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlatFileConfig;
