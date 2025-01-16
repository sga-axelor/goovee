import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {FaXTwitter} from 'react-icons/fa6';
import {MdOutlineWeb} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {t} from '@/lib/core/locale/server';
import {findWorkspace} from '@/orm/workspace';
import {Avatar, AvatarImage} from '@/ui/components';
import {clone} from '@/utils';
import {getImageURL} from '@/utils/files';
import {workspacePathname} from '@/utils/workspace';
import {FaInstagram, FaLinkedin} from 'react-icons/fa';

// ---- LOCAL IMPORTS ---- //
import {colors} from '../../common/constants';
import {findEntry, findMapConfig} from '../../common/orm';
import {findModelFields} from '../../common/orm/meta-json-fields';
import type {Entry} from '../../common/types';
import {Map} from '../../common/ui/components/map';
import {Category} from '../../common/ui/components/pills';
import {cn} from '@/utils/css';
import {InnerHTML} from '../../common/ui/components/inner-html';

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

  const config = await findMapConfig({
    workspaceId: workspace.id,
    tenantId: tenant,
  });

  return (
    <div className="container flex flex-col gap-4 mt-4 mb-5">
      <div className="flex flex-col gap-4 bg-card p-4 rounded-lg">
        <Details entryDetail={entry} tenant={tenant} />
        <Map className="h-80 w-full" entries={[clone(entry)]} config={config} />
      </div>
      {entry.directoryContactSet && entry.directoryContactSet?.length > 0 && (
        <>
          <h2 className="font-semibold text-xl pl-4">
            {await t(
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
    address,
    twitter,
    website,
    description,
    linkedIn,
    image,
    instagram,
    directoryEntryCategorySet,
    attrs,
  } = entryDetail;

  const customFields = (
    await findModelFields({
      modelName: 'com.axelor.apps.portal.db.DirectoryEntry',
      modelField: 'attrs',
      tenantId: tenant,
    })
  ).map(field => {
    const fieldValue =
      typeof attrs === 'object' && attrs != null ? attrs[field.name] : null;
    if (!fieldValue) return null;
    return (
      <div key={field.id}>
        <span className="text-base font-semibold me-2">{field.title}:</span>
        <span className="text-sm text-muted-foreground">{fieldValue}</span>
      </div>
    );
  });

  return (
    <div>
      <div className="flex bg-card gap-5 justify-between">
        <div className="space-y-4 mt-4">
          <h2 className="font-semibold text-xl">{title}</h2>
          {directoryEntryCategorySet?.map(cat => (
            <Category
              name={cat?.title}
              key={cat.id}
              className={cn('me-3', colors[cat.color as keyof typeof colors])}
            />
          ))}
          <p className="text-success text-base">{address?.formattedFullName}</p>
        </div>

        {/* image */}
        <Image
          width={156}
          height={138}
          className="rounded-r-lg h-[138px]"
          src={getImageURL(image?.id, tenant, {noimage: true})}
          alt="image"
        />
      </div>
      <hr />

      {/* directory description */}

      <div className="space-y-4 mt-5">
        <InnerHTML content={description} />
        {customFields}
      </div>
      {(linkedIn || twitter || instagram || website) && (
        <p className="font-semibold text-xl mt-5 mb-5">
          {await t('Social media')}
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
  const {
    simpleFullName,
    emailAddress,
    fixedPhone,
    linkedinLink,
    mobilePhone,
    picture,
  } = contact;
  return (
    <div className="bg-card space-y-4 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            className="object-cover"
            src={getImageURL(picture?.id, tenant, {
              noimage: true,
              noimageSrc: '/images/user.png',
            })}
          />
        </Avatar>
        <span className="font-semibold">{simpleFullName}</span>
      </div>
      <div className="ms-4 space-y-4">
        {emailAddress && (
          <>
            <h4 className="font-semibold">{await t('Email')}</h4>
            <Link
              className="text-sm text-muted-foreground hover:underline hover:!text-palette-blue-dark"
              href={`mailto:${emailAddress.address}`}>
              {emailAddress.address}
            </Link>
          </>
        )}
        <>
          <h4 className="font-semibold">{await t('Phone number')}</h4>
          {fixedPhone && (
            <Link
              className="text-sm text-muted-foreground hover:underline hover:!text-palette-blue-dark"
              href={`tel:${fixedPhone}`}>
              {fixedPhone}
            </Link>
          )}
          <br />
          {mobilePhone && (
            <Link
              className="text-sm text-muted-foreground hover:underline hover:!text-palette-blue-dark"
              href={`tel:${mobilePhone}`}>
              {mobilePhone}
            </Link>
          )}
        </>

        {linkedinLink && (
          <Link href={`${linkedinLink}`}>
            <FaLinkedin className="h-8 w-8 text-palette-blue-dark" />
          </Link>
        )}
      </div>
    </div>
  );
}
