
import React, { useState, useEffect } from 'react';
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
import { TeamMember, TeamMemberRole, TeamMemberStatus } from '@/utils/team/types';

interface TeamMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TeamMemberFormValues) => void;
  member?: TeamMember;
  isEdit?: boolean;
}

// Form schema for validating inputs
const teamMemberSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  role: z.nativeEnum(TeamMemberRole),
  status: z.nativeEnum(TeamMemberStatus),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  member,
  isEdit = false,
}) => {
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      role: TeamMemberRole.VIEWER,
      status: TeamMemberStatus.INVITED,
    },
  });

  // Update form when member changes
  useEffect(() => {
    if (member && isEdit) {
      form.reset({
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: TeamMemberRole.VIEWER,
        status: TeamMemberStatus.INVITED,
      });
    }
  }, [member, isEdit, form]);

  // Handle form submission
  const handleSubmit = (values: TeamMemberFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Team Member' : 'Add Team Member'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this team member.'
              : 'Add a new member to your trading team.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      disabled={isEdit} // Email shouldn't be changed for existing members
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TeamMemberRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={TeamMemberRole.TRADER}>Trader</SelectItem>
                      <SelectItem value={TeamMemberRole.ANALYST}>Analyst</SelectItem>
                      <SelectItem value={TeamMemberRole.VIEWER}>Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TeamMemberStatus.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={TeamMemberStatus.INVITED}>
                          Invited
                        </SelectItem>
                        <SelectItem value={TeamMemberStatus.INACTIVE}>
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? 'Update Member' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberForm;
