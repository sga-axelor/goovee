'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

// ----- LOCAL IMPORTS ------//
import {Post} from '@/subapps/forum/common/types/forum';

export const Tab = ({
  tab,
  onClick,
  isActive,
}: {
  tab: any;
  isActive: boolean;
  onClick: (value: string) => void;
}) => {
  const Icon = tab.icon;
  const handleClick = () => {
    onClick(tab.key);
  };

  return (
    <div
      key={tab.id}
      className={`py-2 rounded cursor-pointer font-semibold text-base flex gap-2 items-center justify-center ${
        isActive ? 'bg-success-light text-success' : 'bg-white'
      }`}
      onClick={handleClick}>
      <Icon className="w-6 h-6" />
      {i18n.get(tab.title)}
    </div>
  );
};

export const Tabs = ({
  activeTab,
  tabs,
  posts = [],
  groupId,
  pageInfo,
  onClick,
}: {
  activeTab: string;
  tabs: any[];
  posts: Post[];
  groupId?: string;
  pageInfo: any;
  onClick: (value: string) => void;
}) => {
  const findTabComponent = (tabKey: string) => {
    const tab = tabs.find(t => t.key === tabKey);
    return tab ? tab.component : null;
  };
  const TabComponent = findTabComponent(activeTab);

  return (
    <>
      <div className="bg-white px-4 pb-4 pt-1 rounded-b-lg border-none">
        <div className="grid grid-cols-2 gap-2">
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              tab={tab}
              onClick={onClick}
              isActive={activeTab === tab.key}
            />
          ))}
        </div>
      </div>
      {TabComponent && (
        <TabComponent posts={posts} groupId={groupId} pageInfo={pageInfo} />
      )}
    </>
  );
};

export default Tabs;
