import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {IMAGE_URL} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {getImageURL} from '@/utils/files';

import {
  MdOutlineSupervisedUserCircle,
  MdOutlineDiamond,
  MdFoodBank,
  MdAllInbox,
  MdMoney,
  MdOutlineMedicalServices,
  MdOutlineSmartphone,
} from 'react-icons/md';
import {TbTool} from 'react-icons/tb';

// ---- LOCAL IMPORTS ---- //
import Hero from './hero';
import {IconType} from 'react-icons';
import Link from 'next/link';
import {Swipe} from '../ticketing/common/ui/components/swipe';
import {cn} from '@/utils/css';
import {Map} from './common/ui/components/map';
import {Sort} from './common/ui/components/sort';

const markers = [
  {lat: 48.85341, lng: 2.3488},
  {lat: 48.85671, lng: 2.4475},
  {lat: 48.80671, lng: 2.4075},
];

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();

  // TODO: check if user auth is required
  // if (!session?.user) notFound();

  const {workspaceURL, tenant} = workspacePathname(params);

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
      <div>
        <Swipe
          items={cards}
          className="flex justify-center items-center !w-[127px] !h-[100px] mb-10 mt-5 pt-5 space-y-2"
        />
        <div className="flex has-[.expand]:flex-col gap-4 mt-4">
          <aside className="space-y-4">
            <Map showExpand markers={markers} />
            <Sort />
          </aside>
          <main className="grow flex flex-col gap-4">
            {Array.from({length: 10}).map((_, index) => (
              <div
                key={index}
                className="flex justify-center items-center p-4 h-40 bg-blue-400">
                cards
              </div>
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
          'flex items-center justify-center h-10 w-10 rounded-full m-auto',
        )}>
        <Icon className="h-8 w-8 " />
      </div>

      <p className="text-sm font-semibold text-center">{label}</p>
    </Link>
  );
}
