import React, { useEffect, useRef } from "react";
import { NavTabs } from "@axelor/ui";
import styles from "./index.module.scss";

interface TabItem {
  id: string;
  title: React.ReactNode;
  href: string;
}

type TabsProps = {
  items: TabItem[];
  activeTab: string;
  onTabChange?: (e: any) => void;
  component?: React.ReactNode;
};

export const Tabs = ({ items, activeTab, onTabChange }: TabsProps) => {
  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabsElement = tabRef?.current?.querySelector(
      `div[data-tab-id='${activeTab}']`
    );
    const tabId = tabsElement?.getAttribute("data-tab-id");
    if (tabId === activeTab && tabsElement) {
      const nestedDiv = tabsElement.querySelector<HTMLElement>("div div");
      if (nestedDiv) {
        nestedDiv.style.borderRadius = "5px 5px 0 0";
      }
    }
  }, [activeTab]);

  return (
    <>
      <NavTabs
        className={styles.tabs}
        onItemClick={(e) => onTabChange && onTabChange(e)}
        items={items}
        active={activeTab}
        ref={tabRef}
      />
    </>
  );
};

export default Tabs;
