import { Box } from "@axelor/ui";
import styles from "./index.module.scss";

type TabContentProps = {
  children: React.ReactNode;
  active: boolean;
};

export const TabContent = ({ children, active }: TabContentProps) => {
  return (
    <Box className={`${styles.tab} ${active ? styles.active : ""}`}>
      {children}
    </Box>
  );
};

export default TabContent;
