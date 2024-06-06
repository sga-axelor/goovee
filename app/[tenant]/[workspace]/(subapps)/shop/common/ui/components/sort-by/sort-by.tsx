import { Select, Popper, List, ListItem } from "@axelor/ui";
import { MdSort } from "react-icons/md";
// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import type { PortalAppConfig, PortalWorkspace } from "@/types";
// ---- LOCAL IMPORTS ---- //
import styles from "./sort-by.module.scss";
import { useState } from "react";
const SORT_BY_OPTIONS = [
  {
    value: "byNewest",
    label: i18n.get("New"),
  },
  {
    value: "byFeature",
    label: i18n.get("Featured"),
  },
  {
    value: "byAToZ",
    label: i18n.get("Name: A-Z"),
  },
  {
    value: "byZToA",
    label: i18n.get("Name: Z-A"),
  },
  {
    value: "byLessExpensive",
    label: i18n.get("Price: Low-High"),
  },
  {
    value: "byMostExpensive",
    label: i18n.get("Price: High-Low"),
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
      (o) =>
        workspace?.config &&
        (workspace?.config?.[o.value as keyof PortalAppConfig] as boolean)
    );
  const value = SORT_BY_OPTIONS.find((o) => o.value === valueProp);

  return (
    <div className={`${styles.sortby} hidden md:flex items-center grow gap-4`}>
      <p className="mb-0 shrink-0 text-sm">Sort By</p>
      <Select
        clearIcon={false}
        onChange={onChange}
        options={options}
        optionKey={(o) => o.value}
        optionLabel={(o) => o.label}
        value={value}
      />
    </div>
  );
}
export function MobileSortBy({
  workspace,
  onChange,
  active,
}: {
  workspace?: PortalWorkspace;
  onChange: ({ value }: { value: string }) => void;
  active?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
  const toggle = () => setOpen((v) => !v);
  const options = SORT_BY_OPTIONS.filter(
    (o) =>
      workspace?.config &&
      (workspace?.config?.[o.value as keyof PortalAppConfig] as boolean)
  );

  return (
    <div
      className="cursor-pointer flex items-center gap-2 border-r"
      ref={setTargetEl}
      onClick={toggle}
    >
      <div className="flex">
        <MdSort className="text-2xl" />
      </div>
      <p className="text-sm mb-0 font-bold">{i18n.get("Sort By")}</p>
      <Popper open={open} target={targetEl}>
        <List flush p={0}>
          {options.map((o) => {
            const isactive = o.value === active;
            return (
              <ListItem
                className="cursor-pointer"
                key={o.value}
                {...(isactive
                  ? {
                      bg: "light",
                      fontWeight: "bold",
                    }
                  : {})}
                onClick={() => onChange({ value: o.value })}
              >
                {o.label}
              </ListItem>
            );
          })}
        </List>
      </Popper>
    </div>
  );
}
export default SortBy;