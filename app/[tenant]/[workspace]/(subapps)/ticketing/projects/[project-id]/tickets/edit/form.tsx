'use client';

// ---- LOCAL IMPORT ---- //
import {create} from './action';

import {useRef} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Button} from '@/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/ui/components/form';
import {Input} from '@/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {i18n} from '@/lib/i18n';
import {Textarea} from '@/ui/components';
import {ID} from '@goovee/orm';
import {AOSProjectTask} from '@/goovee/.generated/models';

const formSchema = z.object({
  subject: z.string().min(1, {message: 'Subject is required'}),
  category: z.string(),
  priority: z.string(),
  contact: z.string(),
  description: z.string(),
});

type TicketFormProps = {
  ticket: AOSProjectTask;
  categories: {
    id: string;
    name: string;
  }[];
  priorities: {
    id: string;
    name: string;
  }[];
  statuses: {
    id: string;
    name: string;
  }[];
  contacts: {
    id: string;
    name: string;
  }[];
};
export default function TicketForm(props: TicketFormProps) {
  const {ticket, contacts, categories, priorities, statuses} = props;
  const {workspaceURL} = useWorkspace();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      category: '',
      priority: '',
      contact: '',
      description: '',
    },
  });

  const handleSubmit = () => {
    /**
     * TODO
     *
     * Call create action with formdata and workspaceURL
     */
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mt-5 mb-5">
        <h3 className="text-lg font-semibold">{i18n.get('Create a ticket')}</h3>
      </div>
      <Form {...form}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md border bg-white p-4">
            <FormField
              control={form.control}
              name="subject"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Subject')}*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={i18n.get('Enter your subject')}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Category')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={i18n.get('Select your category')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem value={category.id} key={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Priority')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={i18n.get('Select your priority')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem value={priority.id} key={priority.id}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Contact')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={i18n.get('Select your contact')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts.map(contact => (
                        <SelectItem value={contact.id} key={contact.id}>
                          {contact.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Ticket description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={i18n.get('Enter ticket description')}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="w-30" variant="success">
                {i18n.get('Create a ticket')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
