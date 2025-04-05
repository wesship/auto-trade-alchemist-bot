
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";

interface ComponentsTabProps {
  keyComponents: {
    name: string;
    description: string;
  }[];
}

const ComponentsTab: React.FC<ComponentsTabProps> = ({ keyComponents }) => {
  return (
    <TabsContent value="components" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keyComponents.map((component, index) => (
          <div key={index} className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-1">{component.name}</h3>
            <p className="text-sm text-muted-foreground">{component.description}</p>
          </div>
        ))}
      </div>
    </TabsContent>
  );
};

export default ComponentsTab;
