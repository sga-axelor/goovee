'use client';

// ---- CORE IMPORTS ---- //
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/components';
import {cn} from '@/utils/css';
import styles from './index.module.scss';

interface BaseAccordionMenu {
  id: string;
  name: string;
  icon?: string;
  items?: BaseAccordionMenu[];
}

interface AccordionMenuProps<T extends BaseAccordionMenu> {
  items: T[];
  onItemClick: (params: {item: T; level: number}) => void;
  level?: number;
  defaultOpenIds?: string[];
}

export type AccordionMenu = BaseAccordionMenu & {
  items?: AccordionMenu[];
};

export const AccordionMenu = <T extends BaseAccordionMenu>({
  items,
  onItemClick,
  level = 0,
  defaultOpenIds,
}: AccordionMenuProps<T>) => {
  return (
    <Accordion type="multiple" defaultValue={defaultOpenIds} className="w-full">
      {items.map((item: T) => (
        <AccordionItem
          value={item.id}
          key={item.id}
          className={cn('border-b-0 space-y-2 m-0', styles['accordion-item'])}>
          <AccordionTrigger
            className={'hover:no-underline py-2 px-2 rounded-lg'}>
            <div
              className={cn(
                'flex grow gap-2 items-center cursor-pointer py-2 px-4',
              )}
              onClick={() => onItemClick({item, level})}>
              <p className="leading-4 line-clamp-1 text-start">{item.name}</p>
            </div>
          </AccordionTrigger>
          {item.items?.length && (
            <AccordionContent>
              <div className="px-6 space-y-4">
                <AccordionMenu<T>
                  items={item.items as T[]}
                  onItemClick={onItemClick}
                  level={level + 1}
                />
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};
