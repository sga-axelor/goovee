import {MdSort} from 'react-icons/md';
import {Popover, PopoverContent, PopoverTrigger} from '@ui/components/popover';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import type {PortalAppConfig, PortalWorkspace} from '@/types';
// ---- LOCAL IMPORTS ---- //
import styles from './sort-by.module.scss';
import {useState} from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    <div className={`${styles.sortby} hidden md:flex items-center grow gap-4`}>
      <p className="mb-0 shrink-0 text-sm">Sort By</p>

      <Select
        defaultValue={value?.value}
        onValueChange={e => {
          onChange({value: e});
        }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Array.isArray(options) &&
              options?.map(o => (
                <SelectItem key={o?.value} value={o?.value}>
                  {o?.label}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
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
    <div
      className="cursor-pointer flex items-center gap-2 border-r"
      ref={setTargetEl}
      onClick={toggle}>
      <Popover trigger={targetEl}>
        <PopoverTrigger asChild>
          <div className="flex">
            <MdSort className="text-2xl" />
            <p className="text-sm mb-0 font-bold">{i18n.get('Sort By')}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ul className="p-0">
            {options.map(o => {
              const isactive = o.value === active;
              return (
                <li
                  className={`${isactive ? 'bg-gray-100 font-bold' : ''} pointer`}
                  key={o.value}
                  onClick={() => onChange({value: o.value})}>
                  {o.label}
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export default SortBy;
