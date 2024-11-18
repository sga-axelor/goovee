import Link from 'next/link';
import {notFound} from 'next/navigation';
import {IconType} from 'react-icons';
import {
  MdAllInbox,
  MdFoodBank,
  MdMoney,
  MdOutlineDiamond,
  MdOutlineMedicalServices,
  MdOutlineSmartphone,
  MdOutlineSupervisedUserCircle,
} from 'react-icons/md';
import {TbTool} from 'react-icons/tb';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {IMAGE_URL} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {cn} from '@/utils/css';
import {getImageURL} from '@/utils/files';
import {workspacePathname} from '@/utils/workspace';

import {MdOutlineNotificationAdd} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import {Card} from './common/ui/components/card';
import {Map} from './common/ui/components/map';
import {Sort} from './common/ui/components/sort';
import {Swipe} from './common/ui/components/swipe';
import Hero from './hero';
import {Button} from '@/ui/components';
import {i18n} from '@/lib/core/i18n';

const markers = [
  {lat: 48.85341, lng: 2.3488},
  {lat: 48.85671, lng: 2.4475},
  {lat: 48.80671, lng: 2.4075},
];

const cardData = [
  {
    id: '1',
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi veritatis ex labore illum quos dolores, nam optio consectetur odit. Minus facilis illo, consequuntur dolor nam illum facere velit? Ipsum, illo! purus aenean porttitor morbi. Turpis. ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    id: '2',
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    id: '3',
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    id: '4',
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    id: '5',
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
];

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();

  // TODO: check if user auth is required
  // if (!session?.user) notFound();

  const {workspaceURL, workspaceURI, tenant} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) notFound();

  // TODO: change it to direcotory app later
  const imageURL = workspace.config.ticketHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.ticketHeroBgImage.id, tenant)})`
    : IMAGE_URL;

  const cards = [
    {
      icon: MdOutlineSupervisedUserCircle,
      label: 'Services',
      iconClassName: 'bg-palette-purple text-palette-purple-dark',
    },
    {
      icon: MdOutlineDiamond,
      label: 'Luxury',
      iconClassName: 'bg-palette-yellow text-palette-yellow-dark',
    },
    {
      icon: MdFoodBank,
      label: 'Agribusiness',
      iconClassName: 'bg-palette-pink text-palette-pink-dark',
    },
    {
      icon: MdAllInbox,
      label: 'Wholesales',
      iconClassName: 'text-success bg-success-light',
    },
    {
      icon: TbTool,
      label: 'Industry',
      iconClassName: 'bg-palette-purple text-palette-purple-dark',
    },
    {
      icon: MdMoney,
      label: 'Bank',
      iconClassName: 'bg-palette-blue text-palette-blue-dark',
    },
    {
      icon: MdOutlineMedicalServices,
      label: 'Medical',
      iconClassName: 'bg-palette-purple text-palette-purple-dark',
    },
    {
      icon: MdOutlineSmartphone,
      label: 'Communication',
      iconClassName: 'bg-palette-yellow text-palette-yellow-dark',
    },
  ].map(props => <DirectoryCards {...props} key={props.label} />);
  return (
    <>
      <Hero
        title={workspace.config.ticketHeroTitle}
        description={workspace.config.ticketHeroDescription}
        background={workspace.config.ticketHeroOverlayColorSelect}
        image={imageURL}
        tenantId={tenant}
      />
      <div className="container mb-5">
        <div className="flex justify-between mt-5">
          <p className="text-xl font-semibold">Services</p>
          <Button variant="success" className="flex items-center">
            <MdOutlineNotificationAdd className="size-6 me-2" />
            <span>{i18n.get('Subscribe')}</span>
          </Button>
        </div>
        <Swipe
          items={cards}
          className="flex justify-center items-center mt-5 p-2 space-y-2"
        />
        <div className="flex has-[.expand]:flex-col gap-4 mt-4">
          <aside className="space-y-4">
            <Map showExpand markers={markers} />
            <Sort />
          </aside>
          <main className="grow flex flex-col gap-4">
            {cardData.map(item => (
              <Card
                item={item}
                url={`${workspaceURI}/directory/${item.id}`}
                key={item.id}
              />
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

type DirectoryCardsProps = {
  label: string;
  icon: IconType;
  iconClassName: string;
};

function DirectoryCards(props: DirectoryCardsProps) {
  const {label, icon: Icon, iconClassName} = props;
  return (
    <Link href="">
      <div
        className={cn(
          iconClassName,
          'flex items-center justify-center  h-14 w-14 rounded-full m-auto',
        )}>
        <Icon className="h-10 w-10 " />
      </div>

      <p className="text-[0.8125rem] font-semibold text-center mt-1">{label}</p>
    </Link>
  );
}
