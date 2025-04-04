
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowUp, Code } from "lucide-react";
import { toast } from "sonner";

interface StrategyExporterProps {
  strategyCode: string;
  strategyName: string;
  children?: React.ReactNode;
}

const StrategyExporter: React.FC<StrategyExporterProps> = ({
  strategyCode,
  strategyName,
  children
}) => {
  const [exportFormat, setExportFormat] = useState("pine");
  const [includeComments, setIncludeComments] = useState(true);
  const [fileName, setFileName] = useState(strategyName.replace(/\s+/g, '_'));
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Prepare code for export based on options
    let codeToExport = strategyCode;
    
    if (!includeComments) {
      // Simple comment removal (in a real app would be more sophisticated)
      codeToExport = codeToExport
        .split('\n')
        .filter(line => !line.trim().startsWith('//'))
        .join('\n');
    }
    
    // In a real app, we might convert to different formats here
    let mimeType = 'text/plain';
    let extension = 'pine';
    
    switch (exportFormat) {
      case 'pine':
        mimeType = 'text/plain';
        extension = 'pine';
        break;
      case 'js':
        mimeType = 'application/javascript';
        extension = 'js';
        // Would convert Pine to JS here in a real app
        break;
      case 'python':
        mimeType = 'text/x-python';
        extension = 'py';
        // Would convert Pine to Python here in a real app
        break;
    }
    
    // Simulate a delay for effect
    setTimeout(() => {
      // Create a Blob containing the strategy code
      const blob = new Blob([codeToExport], { type: mimeType });
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setIsExporting(false);
      
      toast.success("Strategy exported successfully", {
        description: `Exported ${fileName}.${extension}`
      });
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <ArrowUp className="h-4 w-4 mr-2" />
            Export Strategy
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Strategy</DialogTitle>
          <DialogDescription>
            Export this trading strategy to use in your preferred platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              File Name
            </Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <Select
              value={exportFormat}
              onValueChange={setExportFormat}
            >
              <SelectTrigger className="col-span-3" id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pine">Pine Script</SelectItem>
                <SelectItem value="js">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3 flex items-center space-x-2">
              <Checkbox 
                id="comments" 
                checked={includeComments}
                onCheckedChange={(checked) => {
                  setIncludeComments(checked === true);
                }}
              />
              <Label htmlFor="comments">Include comments</Label>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md border border-border/30 max-h-[200px] overflow-auto">
            <pre className="text-xs font-mono">
              <code>{strategyCode.slice(0, 200)}...</code>
            </pre>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <ArrowUp className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyExporter;
