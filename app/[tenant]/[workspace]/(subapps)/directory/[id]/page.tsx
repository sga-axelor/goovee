import {notFound} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {FaLinkedin, FaInstagram} from 'react-icons/fa';
import {Avatar, AvatarImage} from '@/ui/components';
import {getImageURL, getProfilePic} from '@/utils/files';
import {MdOutlineWeb} from 'react-icons/md';
import {FaXTwitter} from 'react-icons/fa6';

// ---- LOCAL IMPORTS ---- //
import {Map} from '../common/ui/components/map';
import {Category} from '../common/ui/components/pills';
import {getTranslation} from '@/lib/core/i18n/server';
import {findEntryDetailById} from '../common/orm/directory-entry';
import {findDirectoryContactById} from '../common/orm/directory-contact';

const markers = [{lat: 48.85341, lng: 2.3488}];

type EntryDetailProps = {
  title?: string;
  city?: string;
  address?: string;
  twitter?: string;
  website?: string;
  description?: string;
  image?: {
    id: string;
  };
  linkedIn?: string;
  isMap?: boolean;
};

type ContactDetaillProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  linkedinLink?: string;
};

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

  const [entryDetail, contactDetail] = await Promise.all([
    findEntryDetailById({
      id,
      workspace,
      tenantId: tenant,
    }).then(clone),
    findDirectoryContactById({
      id,
      workspace,
      tenantId: tenant,
    }).then(clone),
  ]);

  return (
    <div className="container flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-4 bg-card p-4">
        <Details entryDetail={entryDetail} tenant={tenant} />
        <Map className="h-80 w-full" markers={markers} />
      </div>
      <div className="bg-card p-4">
        <Contacts tenant={tenant} contactDetail={contactDetail} />
      </div>
    </div>
  );
}

async function Details({
  entryDetail,
  tenant,
}: {
  entryDetail: EntryDetailProps;
  tenant: string;
}) {
  const {
    title,
    city,
    address,
    twitter,
    website,
    description,
    linkedIn,
    isMap,
    image,
  } = entryDetail;

  const category = [{name: 'service'}, {name: 'industry'}, {name: 'wholesale'}];
  return (
    <div>
      <div className="flex bg-card gap-5 justify-between">
        <div className="space-y-4 mt-4">
          <h2 className="font-semibold text-xl">{title}</h2>
          {category.map((cat, idx) => (
            <Category
              name={cat?.name}
              key={idx}
              className="me-3"
              variant={cat?.name}
            />
          ))}
          <p className="text-success text-base">
            {address} - {city}
          </p>
        </div>

        {/* image */}
        <Image
          width={156}
          height={138}
          className="rounded-r-lg  object-cover"
          src={getImageURL(image?.id, tenant, {noimage: true})}
          alt="image"
        />
      </div>
      <hr />

      {/* directory description */}

      <div className="space-y-4 mt-5">
        <p className="text-sm text-muted-foreground">{description}</p>

        <div>
          <span className="text-base font-semibold me-2">Info 1 :</span>
          <span className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur. Vitae nec pulvinar bibendum
            mattis pharetra sed.
          </span>
        </div>
        <div>
          <span className="text-base font-semibold me-2">Info 2 :</span>
          <span className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur. Vitae nec pulvinar bibendum
            mattis pharetra sed.
          </span>
        </div>
      </div>
      <p className="font-semibold text-xl mt-5 mb-5">
        {await getTranslation('Social media')}
      </p>
      <div className="flex space-x-6">
        {linkedIn && (
          <Link href={`${linkedIn}`}>
            <FaLinkedin className="h-8 w-8 text-palette-blue-dark" />
          </Link>
        )}
        {twitter && (
          <Link href={`${twitter}`}>
            <FaXTwitter className="h-8 w-8" />
          </Link>
        )}
        <FaInstagram className="h-8 w-8 text-palette-yellow-dark" />
        {website && (
          <Link href={`${website}`}>
            <MdOutlineWeb className="h-8 w-8 text-gray-dark" />
          </Link>
        )}
      </div>
    </div>
  );
}

async function Contacts({
  tenant,
  contactDetail,
}: {
  tenant: string;
  contactDetail: ContactDetaillProps;
}) {
  const {firstName, lastName, email, phoneNumber, linkedinLink} = contactDetail;
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">
        {await getTranslation('Contact')}
      </h2>
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            className="object-cover"
            src={getProfilePic('', tenant)}
          />
        </Avatar>
        <span className="font-semibold">
          {firstName} {lastName}
        </span>
      </div>
      <div className="ms-4 space-y-4">
        <h4 className="font-semibold">{await getTranslation('Email')}</h4>
        <a className="text-sm text-muted-foreground" href={`mailto:${email}`}>
          {email}
        </a>
        <h4 className="font-semibold">{await getTranslation('Phone')}</h4>
        <a
          className="text-sm text-muted-foreground"
          href={`tel:${phoneNumber}`}>
          {phoneNumber}
        </a>
        {linkedinLink && (
          <Link href={`${linkedinLink}`}>
            <FaLinkedin className="h-8 w-8 text-palette-blue-dark" />
          </Link>
        )}
      </div>
    </div>
  );
}
