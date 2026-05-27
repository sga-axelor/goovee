'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {TabsContent, StyledTabs} from '@/ui/components/tabs';

interface TabItem {
  id: string;
  title: string;
}

type TabsListProps<T extends TabItem> = {
  items: T[];
  activeTab: string;
  onTabChange: (tab: T) => void;
  children: React.ReactNode;
  controlled?: boolean;
};

export const TabsList = <T extends TabItem>({
  items,
  activeTab,
  onTabChange,
  children,
  controlled,
}: TabsListProps<T>) => {
  return (
    <div>
      <StyledTabs
        controlled={controlled}
        items={items}
        activeTab={activeTab}
        onTabChange={onTabChange as (e: unknown) => void}>
        <TabsContent className="mt-6" value={activeTab}>
          {children}
        </TabsContent>
      </StyledTabs>
    </div>
  );
};

export default TabsList;
