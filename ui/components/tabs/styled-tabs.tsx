import React from 'react';

import {Tabs, TabsList, TabsTrigger} from './tabs';

interface StyledTabItem {
  id: string;
  title?: React.ReactNode;
  href?: string;
}

type StyledTabsProps = {
  items: StyledTabItem[];
  activeTab: string;
  onTabChange?: (e: any) => void;
  component?: React.ReactNode;
  children: any;
};

export const StyledTabs = ({
  items,
  activeTab,
  onTabChange,
  children,
}: StyledTabsProps) => {
  return (
    <>
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="w-full flex bg-transparent items-center justify-start">
          {Array.isArray(items) &&
            items.map(t => (
              <TabsTrigger
                className="rounded-t text-base font-semibold data-[state=active]:text-primary-foreground data-[state=active]:bg-primary"
                key={t?.id}
                value={t?.id}
                onClick={() => onTabChange?.(t)}>
                {t?.title}
              </TabsTrigger>
            ))}
        </TabsList>
        {children}
      </Tabs>
    </>
  );
};

export default StyledTabs;
