import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {i18n} from '@/i18n';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {FaLinkedin, FaInstagram} from 'react-icons/fa';
import {Avatar, AvatarImage} from '@/ui/components';
import {getProfilePic} from '@/utils/files';
import {MdOutlineWeb} from 'react-icons/md';
import {FaXTwitter} from 'react-icons/fa6';

// ---- LOCAL IMPORTS ---- //
import {Map} from '../common/ui/components/map';
import {Category} from '../common/ui/components/pills';

const markers = [{lat: 48.85341, lng: 2.3488}];
export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string; id: string};
}) {
  const session = await getSession();
  const {id} = params;

  // TODO: check if user auth is required
  // if (!session?.user) notFound();

  const {workspaceURL, tenant} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) notFound();

  return (
    <div className="container flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-4 bg-card p-4">
        <Details />
        <Map className="h-80 w-full" markers={markers} />
      </div>
      <div className="bg-card p-4">
        <Contacts tenant={tenant} />
      </div>
    </div>
  );
}

function Details() {
  const category = [{name: 'service'}, {name: 'industry'}, {name: 'wholesale'}];
  return (
    <div>
      <div className="flex bg-card gap-5 justify-between">
        <div className="space-y-6">
          <h2 className="font-semibold text-xl">Entry Name</h2>
          {category.map((cat, idx) => (
            <Category
              name={cat?.name}
              key={idx}
              className="me-3"
              variant={cat?.name}
            />
          ))}
          <p className="text-success text-base">43 Mainstreet - London</p>
        </div>
        <div className="bg-yellow-200 w-[150px] h-[153px]"></div>
      </div>
      <hr />

      {/* directory description */}

      <div className="space-y-4 mt-5">
        <p className="text-sm text-gray-500">
          Lorem ipsum dolor sit amet consectetur. Vitae nec pulvinar bibendum
          mattis pharetra sed. Sem id morbi nunc consectetur ultrices. Magna id
          nisi metus tortor pharetra nullam. Eget vestibulum nisi orci aliquam.
          Convallis sed turpis et amet. Pharetra eget adipiscing vivamus mattis
          lorem iaculis bibendum. Egestas lectus diam ultrices nibh scelerisque
          nunc scelerisque at consectetur.
        </p>

        <div>
          <span className="text-base font-semibold me-2">Info 1:</span>
          <span className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur. Vitae nec pulvinar bibendum
            mattis pharetra sed.
          </span>
        </div>
        <div>
          <span className="text-base font-semibold me-2">Info 2:</span>
          <span className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur. Vitae nec pulvinar bibendum
            mattis pharetra sed.
          </span>
        </div>
      </div>
      <p className="font-semibold text-xl mt-5 mb-5">
        {i18n.get('Social media')}
      </p>
      <div className="flex space-x-6">
        <FaLinkedin className="h-8 w-8 text-blue-700" />
        <FaXTwitter className="h-8 w-8" />
        <FaInstagram className="h-8 w-8 text-yellow-500" />
        <MdOutlineWeb className="h-8 w-8 text-gray-500" />
      </div>
    </div>
  );
}

function Contacts({tenant}: {tenant: string}) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">{i18n.get('Contact')}</h2>
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            className="object-cover"
            src={getProfilePic('', tenant)}
          />
        </Avatar>
        <span className="font-semibold">Alfredo Keebler</span>
      </div>
      <div className="ms-4 space-y-4">
        <h4 className="font-semibold">{i18n.get('Email')}</h4>
        <a
          className="text-sm text-muted-foreground"
          href="mailto:alfredo.keebler@example.com">
          alfredo.keebler@example.com
        </a>
        <h4 className="font-semibold">{i18n.get('Phone')}</h4>
        <a className="text-sm text-muted-foreground" href="tel:+1-202-555-0170">
          +1 (202) 555-0170
        </a>
        <FaLinkedin className="h-8 w-8 text-blue-700" />
      </div>
    </div>
  );
}
