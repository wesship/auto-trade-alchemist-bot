
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  AI_AGENT_MODELS, 
  AI_AGENT_PERMISSIONS, 
  AI_AGENT_SPECIALTIES, 
  TeamMemberRole
} from '@/utils/team/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AIAgentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AIAgentFormValues) => void;
}

// Form schema for validating inputs
const aiAgentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  aiModel: z.string().min(1, { message: 'Please select an AI model' }),
  agentType: z.string().min(1, { message: 'Please select an agent type' }),
  description: z.string().optional(),
  autoExecute: z.boolean().default(false),
  specialties: z.array(z.string()).optional(),
});

export type AIAgentFormValues = z.infer<typeof aiAgentSchema>;

const AIAgentForm: React.FC<AIAgentFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');

  const form = useForm<AIAgentFormValues>({
    resolver: zodResolver(aiAgentSchema),
    defaultValues: {
      name: '',
      aiModel: '',
      agentType: '',
      description: '',
      autoExecute: false,
      specialties: [],
    },
  });

  const handleSubmit = (values: AIAgentFormValues) => {
    // Add the selected specialties to the form values
    values.specialties = selectedSpecialties;
    onSubmit(values);
    onOpenChange(false);
  };

  const addSpecialty = () => {
    if (specialtyInput && !selectedSpecialties.includes(specialtyInput)) {
      const newSpecialties = [...selectedSpecialties, specialtyInput];
      setSelectedSpecialties(newSpecialties);
      form.setValue('specialties', newSpecialties);
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    const newSpecialties = selectedSpecialties.filter(s => s !== specialty);
    setSelectedSpecialties(newSpecialties);
    form.setValue('specialties', newSpecialties);
  };

  const selectPredefinedSpecialty = (specialty: string) => {
    if (!selectedSpecialties.includes(specialty)) {
      const newSpecialties = [...selectedSpecialties, specialty];
      setSelectedSpecialties(newSpecialties);
      form.setValue('specialties', newSpecialties);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add AI Agent to Team</DialogTitle>
          <DialogDescription>
            Configure a new AI agent to assist with trading activities.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Market Analyzer Agent" />
                  </FormControl>
                  <FormDescription>
                    Give your AI agent a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aiModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AI_AGENT_MODELS.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} ({model.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The underlying AI model that powers this agent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(AI_AGENT_PERMISSIONS).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Determines the agent's role and permissions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="This agent specializes in market analysis and trend identification..."
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of the agent's capabilities and purpose
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Specialties</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSpecialties.map((specialty) => (
                  <Badge key={specialty} className="flex items-center gap-1">
                    {specialty}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSpecialty(specialty)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  placeholder="Add custom specialty"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialty();
                    }
                  }}
                />
                <Button type="button" onClick={addSpecialty} size="sm">
                  Add
                </Button>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">Predefined specialties:</p>
                <div className="flex flex-wrap gap-2">
                  {AI_AGENT_SPECIALTIES.map((specialty) => (
                    <Badge 
                      key={specialty} 
                      className="cursor-pointer hover:bg-primary/90"
                      variant="outline"
                      onClick={() => selectPredefinedSpecialty(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="autoExecute"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Auto-Execute Trades
                    </FormLabel>
                    <FormDescription>
                      Allow this agent to execute trades without approval
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add AI Agent
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AIAgentForm;
