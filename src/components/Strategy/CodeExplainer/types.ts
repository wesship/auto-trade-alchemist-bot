
export interface CodeExplainerProps {
  strategyCode: string;
  strategyName: string;
}

export interface ExplanationData {
  summary: string;
  keyComponents: {
    name: string;
    description: string;
  }[];
  lineByLine: {
    line: string;
    explanation: string;
    important: boolean;
  }[];
  suggestions: string[];
  aiPromptUsed: string;
}

export interface LineExplanation {
  line: string;
  explanation: string;
  important: boolean;
}
