
import React from 'react';
import { Brain, Code } from 'lucide-react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CodeHeaderProps {
  strategyName: string;
  selectedExample: string | null;
  isExplaining: boolean;
  onSelectExample: (example: string | null) => void;
  onExplain: () => void;
}

const CodeHeader: React.FC<CodeHeaderProps> = ({
  strategyName,
  selectedExample,
  isExplaining,
  onSelectExample,
  onExplain
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="flex items-center">
          <Code className="mr-2 h-5 w-5 text-primary" />
          {selectedExample 
            ? (selectedExample === 'bollinger' 
                ? 'Bollinger Bands Strategy' 
                : 'Modified Bollinger Bands Strategy')
            : strategyName} Code Explanation
        </CardTitle>
        <CardDescription>
          AI-powered breakdown of how this strategy works
        </CardDescription>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectExample('bollinger')}
          className={selectedExample === 'bollinger' ? 'bg-primary/20' : ''}
        >
          Example 1
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectExample('bollingerModified')}
          className={selectedExample === 'bollingerModified' ? 'bg-primary/20' : ''}
        >
          Example 2
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectExample(null)}
          className={!selectedExample ? 'bg-primary/20' : ''}
        >
          Current
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExplain}
          disabled={isExplaining}
        >
          {isExplaining ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Re-analyze
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CodeHeader;
