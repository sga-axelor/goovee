'use client';

import React from 'react';
import {Tabs} from '../tabs/index';
import {TabsContent} from '@ui/components/tabs';

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
      <Tabs items={items} activeTab={activeTab} onTabChange={onTabChange}>
        <TabsContent value={activeTab}>{children}</TabsContent>
      </Tabs>
    </div>
  );
};

export default NavView;
