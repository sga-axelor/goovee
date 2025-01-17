'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {TabsContent, StyledTabs} from '@/ui/components/tabs';

interface TabItem {
  id: string;
  title: string;
}

type TabsListProps = {
  items: TabItem[];
  activeTab: string;
  onTabChange: (e: any) => void;
  children: React.ReactNode;
};

export const TabsList = ({
  items,
  activeTab,
  onTabChange,
  children,
}: TabsListProps) => {
  return (
    <div>
      <StyledTabs items={items} activeTab={activeTab} onTabChange={onTabChange}>
        <TabsContent className="mt-6" value={activeTab}>
          {children}
        </TabsContent>
      </StyledTabs>
    </div>
  );
};

export default TabsList;
