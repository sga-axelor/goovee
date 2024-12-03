'use client';

import React from 'react';
import {TabsContent, StyledTabs} from '@/ui/components/tabs';

interface TabItem {
  id: string;
  title: string;
}

type NavViewProps = {
  items: TabItem[];
  activeTab: string;
  onTabChange: (e: any) => void;
  children: React.ReactNode;
};

export const NavView = ({
  items,
  activeTab,
  onTabChange,
  children,
}: NavViewProps) => {
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

export default NavView;
