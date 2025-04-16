
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DataPreviewProps {
  visible: boolean;
  onClose: () => void;
  previewData: any[] | null;
  columns: {name: string; type: string; selected: boolean}[];
  isLoading: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({ 
  visible, 
  onClose, 
  previewData, 
  columns,
  isLoading
}) => {
  if (!visible) return null;

  const selectedColumns = columns.filter(col => col.selected);

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-6xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>Showing first 100 rows of selected columns</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading preview data...</p>
              </div>
            </div>
          ) : previewData && previewData.length > 0 ? (
            <ScrollArea className="h-[calc(80vh-8rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedColumns.map(column => (
                      <TableHead key={column.name}>{column.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {selectedColumns.map(column => (
                        <TableCell key={column.name}>{row[column.name]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No data available for preview</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPreview;
