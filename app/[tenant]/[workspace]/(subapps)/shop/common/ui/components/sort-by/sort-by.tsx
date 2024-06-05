import {Select, Box, Popper, List, ListItem} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import type {PortalAppConfig, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import styles from './sort-by.module.scss';
import {useState} from 'react';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

const SORT_BY_OPTIONS = [
  {
    value: 'byNewest',
    label: i18n.get('New'),
  },
  {
    value: 'byFeature',
    label: i18n.get('Featured'),
  },
  {
    value: 'byAToZ',
    label: i18n.get('Name: A-Z'),
  },
  {
    value: 'byZToA',
    label: i18n.get('Name: Z-A'),
  },
  {
    value: 'byLessExpensive',
    label: i18n.get('Price: Low-High'),
  },
  {
    value: 'byMostExpensive',
    label: i18n.get('Price: High-Low'),
  },
];

export function SortBy({
  onChange,
  options: optionsProp,
  value: valueProp,
  workspace,
}: any) {
  const options =
    optionsProp ||
    SORT_BY_OPTIONS.filter(
      o =>
        workspace?.config &&
        (workspace?.config?.[o.value as keyof PortalAppConfig] as boolean),
    );

  const value = SORT_BY_OPTIONS.find(o => o.value === valueProp);

  return (
    <Box
      alignItems="center"
      flexGrow={1}
      gap="1rem"
      d={{base: 'none', md: 'flex'}}
      className={styles.sortby}>
      <Box as="p" mb={0} flexShrink={0}>
        Sort By
      </Box>
      {/*@ts-expect-error */}
      <Select
        clearIcon={false}
        onChange={onChange}
        options={options}
        optionKey={o => o.value}
        optionLabel={o => o.label}
        value={value}
      />
    </Box>
  );
}

export function MobileSortBy({
  workspace,
  onChange,
  active,
}: {
  workspace?: PortalWorkspace;
  onChange: ({value}: {value: string}) => void;
  active?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  const toggle = () => setOpen(v => !v);

  const options = SORT_BY_OPTIONS.filter(
    o =>
      workspace?.config &&
      (workspace?.config?.[o.value as keyof PortalAppConfig] as boolean),
  );

  return (
    <Box
      d="flex"
      alignItems="center"
      gap="0.5rem"
      borderEnd
      className="pointer"
      ref={setTargetEl}
      onClick={toggle}>
      <Box d="flex">
        <MaterialIcon icon="sort" />
      </Box>
      <Box as="p" mb={0} fontWeight="bold">
        {i18n.get('Sort By')}
      </Box>
      <Popper open={open} target={targetEl}>
        <List flush p={0}>
          {options.map(o => {
            const isactive = o.value === active;
            return (
              <ListItem
                className="pointer"
                key={o.value}
                {...(isactive
                  ? {
                      bg: 'light',
                      fontWeight: 'bold',
                    }
                  : {})}
                onClick={() => onChange({value: o.value})}>
                {o.label}
              </ListItem>
            );
          })}
        </List>
      </Popper>
    </Box>
  );
}

export default SortBy;
