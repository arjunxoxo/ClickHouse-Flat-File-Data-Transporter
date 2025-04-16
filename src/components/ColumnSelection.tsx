
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, RefreshCw, Eye } from "lucide-react";

interface Column {
  name: string;
  type: string;
  selected: boolean;
}

interface ColumnSelectionProps {
  columns: Column[];
  onColumnChange: (updatedColumns: Column[]) => void;
  onFetchColumns: () => void;
  onPreviewData: () => void;
  isFetchingColumns: boolean;
  isPreviewingData: boolean;
  source: string;
}

const ColumnSelection: React.FC<ColumnSelectionProps> = ({
  columns,
  onColumnChange,
  onFetchColumns,
  onPreviewData,
  isFetchingColumns,
  isPreviewingData,
  source
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelectAll = (select: boolean) => {
    const updatedColumns = columns.map(col => ({
      ...col,
      selected: select
    }));
    onColumnChange(updatedColumns);
  };

  const toggleColumn = (index: number) => {
    const updatedColumns = [...columns];
    updatedColumns[index].selected = !updatedColumns[index].selected;
    onColumnChange(updatedColumns);
  };

  const filteredColumns = columns.filter(col => 
    col.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedCount = columns.filter(col => col.selected).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Column Selection</CardTitle>
            <CardDescription>Select columns to include in the transfer</CardDescription>
          </div>
          <Button 
            onClick={onFetchColumns}
            variant="outline"
            size="sm"
            disabled={isFetchingColumns}
          >
            {isFetchingColumns ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {columns.length > 0 ? (
          <>
            <div className="flex items-center mb-4 gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search columns..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviewData}
                disabled={isPreviewingData || selectedCount === 0}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
            
            <div className="flex justify-between items-center mb-2 text-sm">
              <div>
                <span className="text-muted-foreground">
                  {selectedCount} of {columns.length} columns selected
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => toggleSelectAll(true)}
                >
                  Select All
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => toggleSelectAll(false)}
                >
                  Deselect All
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-4 space-y-3">
                {filteredColumns.map((column, index) => (
                  <div key={column.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${index}`}
                      checked={column.selected}
                      onCheckedChange={() => toggleColumn(columns.indexOf(column))}
                    />
                    <Label
                      htmlFor={`column-${index}`}
                      className="flex justify-between w-full cursor-pointer text-sm"
                    >
                      <span>{column.name}</span>
                      <span className="text-muted-foreground">{column.type}</span>
                    </Label>
                  </div>
                ))}
                
                {filteredColumns.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No columns found matching your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isFetchingColumns ? (
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                <p>Loading columns...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p>No columns available</p>
                <Button 
                  onClick={onFetchColumns} 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  Load Columns
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColumnSelection;
