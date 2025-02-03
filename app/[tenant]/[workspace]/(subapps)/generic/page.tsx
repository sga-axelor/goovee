import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {GenericForm, GenericGrid} from './common/components';
import {FORM_VIEW, GRID_VIEW} from './common/fake-data';
import {findFieldsOfModel} from './common/orm/meta-field';
import {workspacePathname} from '@/utils/workspace';
import {clone} from '@/utils';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {tenant} = workspacePathname(params);

  const metaFields = await findFieldsOfModel({
    name: FORM_VIEW.schema.model,
    tenantId: tenant,
  }).then(clone);

  return (
    <div>
      <GenericForm
        content={FORM_VIEW.schema}
        metaFields={metaFields as any[]}
      />
      <GenericGrid
        content={GRID_VIEW.schema}
        data={[
          {
            code: 'laptop-touchscreen',
            notes:
              'With an 11.6-inch HD screen and slim, lightweight frame, the laptop offers an ultra-compact, portable solution for email, browsing and more. ',
            color: 'gray',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: '11.6-inch Touchscreen Laptop',
            id: 2,
            category: {
              code: 'laptop',
              name: 'Laptops',
              id: 3,
              $version: 0,
            },
          },
          {
            code: 'laptop-metal',
            notes:
              'The slim and lightweight laptop now features diamond-cut edges and textured finishes, and is available in 3 distinct colors that have been chosen to reflect your personality.',
            color: 'chocolate',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Full HD 15.6 Inch Metal Laptop',
            id: 3,
            category: {
              code: 'laptop',
              name: 'Laptops',
              id: 3,
              $version: 0,
            },
          },
          {
            code: 'food-processor',
            notes:
              'Multifunctional Food Processor: Includes 11 attachments, own Topchef food processor, means you get blender, chopper, citrus juicer, knead dough machine, mixer, etc. It meets your most demands of cooking preparation, save time and money.',
            color: 'teal',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Multifunctional Food Processor',
            id: 8,
            category: {
              code: 'kitchen-home',
              name: 'Kitchen & Home Appliances',
              id: 7,
              $version: 0,
            },
          },
          {
            code: 'storage-box',
            notes:
              'Ideal outdoor storage box for garden tools and equipment, furniture cushions and accessories',
            color: 'yellow',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Outdoor Storage Box',
            id: 9,
            category: {
              code: 'garden-outdoor',
              name: 'Garden & Outdoors',
              id: 8,
              $version: 0,
            },
          },
          {
            code: 'LOUNGECHAIR',
            notes:
              'Tough and durable powder coated steel frame with anti corrosion coating guarantees a long life outside',
            color: 'black',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Patio Lounge Chair',
            id: 10,
            category: {
              code: 'garden-outdoor',
              name: 'Garden & Outdoors',
              id: 8,
              $version: 0,
            },
          },
          {
            code: 'slice-toaster',
            notes:
              'Frozen setting - no need to de-frost your bread first for ease and convenience',
            color: 'black',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Slice Toaster',
            id: 6,
            category: {
              code: 'kitchen-home',
              name: 'Kitchen & Home Appliances',
              id: 7,
              $version: 0,
            },
          },
          {
            code: 'microwave',
            notes: 'Slimline design, 27L - Larger turntable (34cm)',
            color: 'white',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Small Combination Microwave Oven & Grill',
            id: 7,
            category: {
              code: 'kitchen-home',
              name: 'Kitchen & Home Appliances',
              id: 7,
              $version: 0,
            },
          },
          {
            code: 'the-age-of-ai',
            notes:
              'An AI learned to win chess by making moves human grand masters had never conceived. Another AI discovered a new antibiotic by analysing molecular properties human scientists did not understand.',
            color: null,
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'The Age of AI: And Our Human Future',
            id: 5,
            category: {
              code: 'books',
              name: 'Books',
              id: 5,
              $version: 0,
            },
          },
          {
            code: 'the-universe',
            notes:
              'We once thought of our Earth as unique, but we have now discovered thousands of alien planets, and that’s barely a fraction of the worlds that are out there. And there are more stars in the Universe than grains of sand on every planet in the Solar System.',
            color: null,
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'The Universe',
            id: 4,
            category: {
              code: 'books',
              name: 'Books',
              id: 5,
              $version: 0,
            },
          },
          {
            code: 'wireless-keyboard',
            notes: 'Slim Wireless Keyboard and Mouse Set, 2.4G Cordless',
            color: 'black',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Wireless Keyboard',
            id: 12782782,
            category: {
              code: 'computers',
              name: 'Computers',
              id: 2,
              $version: 0,
            },
          },
          {
            code: 'microwave',
            notes: 'Slimline design, 27L - Larger turntable (34cm)',
            color: 'white',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Small Combination Microwave Oven & Grill',
            id: 72752782,
            category: {
              code: 'kitchen-home',
              name: 'Kitchen & Home Appliances',
              id: 7,
              $version: 0,
            },
          },
          {
            code: 'the-age-of-ai',
            notes:
              'An AI learned to win chess by making moves human grand masters had never conceived. Another AI discovered a new antibiotic by analysing molecular properties human scientists did not understand.',
            color: null,
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'The Age of AI: And Our Human Future',
            id: 527278,
            category: {
              code: 'books',
              name: 'Books',
              id: 5,
              $version: 0,
            },
          },
          {
            code: 'the-universe',
            notes:
              'We once thought of our Earth as unique, but we have now discovered thousands of alien planets, and that’s barely a fraction of the worlds that are out there. And there are more stars in the Universe than grains of sand on every planet in the Solar System.',
            color: null,
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'The Universe',
            id: 48768,
            category: {
              code: 'books',
              name: 'Books',
              id: 5,
              $version: 0,
            },
          },
          {
            code: 'wireless-keyboard',
            notes: 'Slim Wireless Keyboard and Mouse Set, 2.4G Cordless',
            color: 'black',
            createdBy: {
              code: 'admin',
              name: 'Administrator',
              id: 1,
              $version: 2,
            },
            name: 'Wireless Keyboard',
            id: 15465,
            category: {
              code: 'computers',
              name: 'Computers',
              id: 2,
              $version: 0,
            },
          },
        ]}
      />
    </div>
  );
}
