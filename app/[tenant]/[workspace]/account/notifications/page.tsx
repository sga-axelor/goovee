'use client';

import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Button} from '@/ui/components/button';

import {Form} from '@/ui/components/form';

// ---- LOCAL IMPORTS ---- //
import {Title} from '../common/ui/components';

const formSchema = z.object({});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  return (
    <div className="bg-white p-2 lg:p-0 lg:bg-inherit">
      {' '}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-20">
            <div className="space-y-4">
              <Title text={i18n.get('Notifications')} />
            </div>

            <div className="space-y-4 text-end sr-only">
              <Button variant="success" disabled>
                {i18n.get('Save settings')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
