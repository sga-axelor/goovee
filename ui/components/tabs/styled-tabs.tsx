import React from 'react';

import {Tabs, TabsList, TabsTrigger} from './tabs';
import {i18n} from '@/locale';

interface StyledTabItem {
  id: string;
  title: string;
  href?: string;
}

type StyledTabsProps = {
  items: StyledTabItem[];
  activeTab: string;
  onTabChange?: (e: any) => void;
  component?: React.ReactNode;
  children: any;
  controlled?: boolean;
};

export const StyledTabs = ({
  items,
  activeTab,
  onTabChange,
  children,
  controlled,
}: StyledTabsProps) => {
  return (
    <>
      <Tabs
        {...(controlled ? {value: activeTab} : {defaultValue: activeTab})}
        className="w-full">
        <TabsList className="w-full flex bg-transparent items-center justify-between md:justify-start border-black">
          {Array.isArray(items) &&
            items.map(t => (
              <TabsTrigger
                className="!rounded-t-[0.313rem] text-base font-semibold data-[state=active]:text-primary-foreground data-[state=active]:bg-success data-[state=inactive]:font-medium w-full md:w-fit box-border transition-none border border-transparent"
                key={t?.id}
                value={t?.id}
                onClick={() => onTabChange?.(t)}>
                {i18n.t(t?.title)}
              </TabsTrigger>
            ))}
        </TabsList>
        {children}
      </Tabs>
    </>
  );
};

export default StyledTabs;
