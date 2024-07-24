'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  Tabs as ShadCnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {MediaContent, PostsContent} from '@/subapps/forum/common/ui/components';
import styles from './style.module.scss';

export const Tabs = ({
  activeTab,
  tabs,
  onClick,
}: {
  activeTab: string | null;
  tabs: any[];
  onClick: (value: string) => void;
}) => {
  return (
    <ShadCnTabs defaultValue={activeTab ?? 'posts'} className="w-full">
      <TabsList
        className={`bg-white px-4 rounded-b-lg grid w-full grid-cols-2 gap-2 border-none ${styles['custom-tabs']}`}>
        {tabs.map((tab: any) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.key}
              className={`py-2 rounded cursor-pointer font-semibold text-base flex gap-2 items-center justify-center`}
              onClick={() => onClick(tab.key)}>
              <Icon className="w-6 h-6" /> {i18n.get(tab.title)}
            </TabsTrigger>
          );
        })}
      </TabsList>
      <TabsContent value="posts">
        <PostsContent />
      </TabsContent>
      <TabsContent value="media">
        <MediaContent />
      </TabsContent>
    </ShadCnTabs>
  );
};

export default Tabs;
