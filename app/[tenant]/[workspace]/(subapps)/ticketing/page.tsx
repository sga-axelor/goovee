import {MdAdd} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

import {Button, HeroSearch} from '@/ui/components';

import {Card} from './common/ui/components/card';
import {TicketTypes} from './common/ui/components/ticket-types';
import {TicketList} from './common/ui/components/ticket-list';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  /**
   * TODO
   *
   * Fetch projects per workspace
   */

  const projectList = [
    {
      projectName: 'Project 1',
      totalTickets: 156,
    },
    {
      projectName: 'Project 2',
      totalTickets: 43,
    },
    {
      projectName: 'Project 3',
      totalTickets: 20,
    },
    {
      projectName: 'Project 4',
      totalTickets: 123,
    },
    {
      projectName: 'Project 5',
      totalTickets: 8,
    },
    {
      projectName: 'Project 6',
      totalTickets: 18,
    },
  ];

  const tickets: any = [
    {
      ticketId: '#00342AB',
      requestedBy: 'User 1',
      subject: 'Problem with creating a topic on the forum',
      priority: 'Low',
      status: 'New',
      category: 'Technical Issues',
      assignedTo: 'Client',
      updatedOn: '22/11/23',
    },
    {
      ticketId: '#00342AB',
      requestedBy: 'User 2',
      subject: 'Problem with creating a topic on the forum',
      priority: 'Low',
      status: 'New',
      category: 'Technical Issues',
      assignedTo: 'Client',
      updatedOn: '22/11/23',
    },
    {
      ticketId: '#00342AB',
      requestedBy: 'User 3',
      subject: 'Problem with creating a topic on the forum',
      priority: 'Low',
      status: 'New',
      category: 'Technical Issues',
      assignedTo: 'Client',
      updatedOn: '22/11/23',
    },
  ];
  return (
    <>
      <HeroSearch
        title={i18n.get('Ticketing')}
        description={i18n.get(
          'Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium etiam viverra. Ac at non pretium etiam',
        )}
        image={IMAGE_URL}
      />
      <div className="container mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            {i18n.get('Choose your project')}
          </h2>
          <Button variant="success" className="flex items-center">
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a new project')}</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-5">
          {projectList?.length > 1 ? (
            projectList.map((item, i) => {
              return (
                <Card
                  key={i}
                  projectName={item?.projectName}
                  totalTickets={item?.totalTickets}
                />
              );
            })
          ) : (
            <>
              <TicketTypes />
              <TicketList tickets={tickets} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
