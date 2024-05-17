"use client";

import React from "react";
import { Tabs } from "../tabs";
import { Box } from "@axelor/ui";
import styles from "./style.module.scss";

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
    <Box>
      <Tabs items={items} activeTab={activeTab} onTabChange={onTabChange} />
      <Box className={styles["nav-view-tab-content"]}>{children}</Box>
    </Box>
  );
};

export default NavView;
