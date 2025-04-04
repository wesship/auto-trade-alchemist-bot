
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCcw, Settings, Shield, Cpu, BarChart4, BellRing } from 'lucide-react';
import { toast } from 'sonner';
import featureFlags from '@/utils/featureFlags';

const FeatureFlags = () => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    loadFeatureFlags();
  }, []);
  
  const loadFeatureFlags = () => {
    const currentFlags = featureFlags.getAll();
    setFlags(currentFlags);
  };
  
  const handleToggleFeature = (feature: string) => {
    const newValue = featureFlags.toggle(feature);
    setFlags(prev => ({
      ...prev,
      [feature]: newValue
    }));
    
    toast.success(`Feature "${feature}" ${newValue ? 'enabled' : 'disabled'}`, {
      description: `The feature has been ${newValue ? 'turned on' : 'turned off'}`
    });
  };
  
  const handleResetFeatures = () => {
    featureFlags.reset();
    loadFeatureFlags();
    toast.success('Feature flags reset', {
      description: 'All feature flags have been reset to their default values'
    });
  };
  
  const getFeatureIcon = (feature: string) => {
    if (feature.includes('CIRCUIT')) return <Shield className="h-5 w-5" />;
    if (feature.includes('MODEL')) return <Cpu className="h-5 w-5" />;
    if (feature.includes('NOTIFICATION')) return <BellRing className="h-5 w-5" />;
    if (feature.includes('PERFORMANCE')) return <BarChart4 className="h-5 w-5" />;
    return <Settings className="h-5 w-5" />;
  };
  
  const getFeatureCategory = (feature: string) => {
    if (feature.includes('CIRCUIT') || feature.includes('SECURITY')) return 'Security';
    if (feature.includes('MODEL') || feature.includes('TRAINING')) return 'AI Model';
    if (feature.includes('NOTIFICATION')) return 'Notifications';
    if (feature.includes('PERFORMANCE') || feature.includes('ANALYTICS')) return 'Analytics';
    if (feature.includes('MARKET') || feature.includes('TRADING')) return 'Trading';
    return 'System';
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Security': return 'bg-red-500/10 text-red-500';
      case 'AI Model': return 'bg-purple-500/10 text-purple-500';
      case 'Notifications': return 'bg-yellow-500/10 text-yellow-500';
      case 'Analytics': return 'bg-blue-500/10 text-blue-500';
      case 'Trading': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
          <p className="text-muted-foreground">
            Manage and configure system feature flags
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 lg:mt-0">
          <Button variant="outline" onClick={loadFeatureFlags}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="destructive" onClick={handleResetFeatures}>
            Reset All
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Feature Configuration</CardTitle>
          <CardDescription>
            Toggle features on or off to control system behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-6">
              {Object.entries(flags).map(([feature, enabled]) => {
                const category = getFeatureCategory(feature);
                const categoryColorClass = getCategoryColor(category);
                
                return (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 rounded-full bg-secondary">
                        {getFeatureIcon(feature)}
                      </div>
                      <div>
                        <div className="font-medium">{feature}</div>
                        <div className="flex items-center">
                          <Badge variant="outline" className={categoryColorClass}>
                            {category}
                          </Badge>
                          <Badge variant={enabled ? 'default' : 'secondary'} className="ml-2">
                            {enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={() => handleToggleFeature(feature)}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureFlags;
