import styles from './index.module.scss';

type TabContentProps = {
  children: React.ReactNode;
  active: boolean;
};

export const TabContent = ({children, active}: TabContentProps) => {
  return (
    <div className={`${styles.tab} ${active ? styles.active : ''}`}>
      {children}
    </div>
  );
};

export default TabContent;
