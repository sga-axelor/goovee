import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {FaXTwitter} from 'react-icons/fa6';
import {MdOutlineWeb} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {getTranslation} from '@/lib/core/i18n/server';
import {findWorkspace} from '@/orm/workspace';
import {Avatar, AvatarImage} from '@/ui/components';
import {clone} from '@/utils';
import {getImageURL} from '@/utils/files';
import {getProfilePic} from '../../common/utils';
import {workspacePathname} from '@/utils/workspace';
import {FaInstagram, FaLinkedin} from 'react-icons/fa';

// ---- LOCAL IMPORTS ---- //
import {colors} from '../../common/constants';
import {Entry, findEntry} from '../../common/orm';
import {Map} from '../../common/ui/components/map';
import {Category} from '../../common/ui/components/pills';

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

  const entry = await findEntry({
    id,
    workspaceId: workspace.id,
    tenantId: tenant,
  });
  if (!entry) notFound();

  return (
    <div className="container flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-4 bg-card p-4">
        <Details entryDetail={entry} tenant={tenant} />
        <Map className="h-80 w-full" entries={[clone(entry)]} />
      </div>
      {entry.directoryContactSet && entry.directoryContactSet?.length > 0 && (
        <>
          <h2 className="font-semibold text-xl">
            {await getTranslation(
              `${entry.directoryContactSet.length > 1 ? 'Contacts' : 'Contact'}`,
            )}
          </h2>

          {entry.directoryContactSet.map(contact => (
            <Contact key={contact.id} tenant={tenant} contact={contact} />
          ))}
        </>
      )}
    </div>
  );
}

async function Details({
  entryDetail,
  tenant,
}: {
  entryDetail: Entry;
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
    instagram,
    directoryEntryCategorySet,
  } = entryDetail;

  return (
    <div>
      <div className="flex bg-card gap-5 justify-between">
        <div className="space-y-4 mt-4">
          <h2 className="font-semibold text-xl">{title}</h2>
          {directoryEntryCategorySet?.map((cat, idx) => (
            <Category
              name={cat?.title}
              key={idx}
              className={`me-3 ${colors[cat.color as keyof typeof colors] ?? ''}`}
              variant={cat?.color}
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
      {(linkedIn || twitter || instagram || website) && (
        <p className="font-semibold text-xl mt-5 mb-5">
          {await getTranslation('Social media')}
        </p>
      )}
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
        {instagram && (
          <Link href={`${instagram}`}>
            <FaInstagram className="h-8 w-8 text-palette-yellow-dark" />
          </Link>
        )}
        {website && (
          <Link href={`${website}`}>
            <MdOutlineWeb className="h-8 w-8 text-gray-dark" />
          </Link>
        )}
      </div>
    </div>
  );
}

async function Contact({
  tenant,
  contact,
}: {
  tenant: string;
  contact: NonNullable<Entry['directoryContactSet']>[number];
}) {
  const {firstName, lastName, email, phoneNumber, linkedinLink} = contact;
  return (
    <div className="bg-card space-y- p-4">
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
        {email && (
          <>
            <h4 className="font-semibold">{await getTranslation('Email')}</h4>
            <a
              className="text-sm text-muted-foreground"
              href={`mailto:${email}`}>
              {email}
            </a>
          </>
        )}
        {phoneNumber && (
          <>
            <h4 className="font-semibold">{await getTranslation('Phone')}</h4>
            <a
              className="text-sm text-muted-foreground"
              href={`tel:${phoneNumber}`}>
              {phoneNumber}
            </a>
          </>
        )}
        {linkedinLink && (
          <Link href={`${linkedinLink}`}>
            <FaLinkedin className="h-8 w-8 text-palette-blue-dark" />
          </Link>
        )}
      </div>
    </div>
  );
}
