import React from "react";

import {
  Tabs as NavTabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
interface TabItem {
  id: string;
  title?: React.ReactNode;
  href?: string;
}

type TabsProps = {
  items: TabItem[];
  activeTab: string;
  onTabChange?: (e: any) => void;
  component?: React.ReactNode;
  children: any;
};

export const Tabs = ({ items, activeTab, onTabChange, children }: TabsProps) => {

  return (
    <>
      <NavTabs defaultValue={activeTab} className="w-full !border-b border-solid !border-black">
        <TabsList className="w-full flex bg-transparent items-center justify-start">
          {Array.isArray(items) && items.map((t) => (
            <TabsTrigger className="rounded-t text-base font-semibold data-[state=active]:text-primary-foreground data-[state=active]:bg-primary" key={t?.id} value={t?.id} onClick={() => onTabChange?.(t)} >{t?.title}</TabsTrigger>
          ))}
        </TabsList>
        {children}
      </NavTabs>
    </>
  );
};

export default Tabs;
