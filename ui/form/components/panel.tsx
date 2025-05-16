import {useCallback, useMemo} from 'react';

import {i18n} from '@/locale';
import {Label, Separator} from '@/ui/components';

import type {DisplayPanel} from '../types';
import {getColspan} from '../display.helpers';

export const PanelComponent = ({
  item,
  renderItem,
}: {
  item: DisplayPanel;
  renderItem: (item: any, name: string) => React.JSX.Element;
}) => {
  const content = useMemo(() => item.content ?? [], [item.content]);

  const width = useMemo(() => getColspan(item.colSpan), [item.colSpan]);

  const isRoot = useMemo(() => item.parent == null, [item.parent]);

  const Wrapper = useCallback(
    ({
      children,
      containerStyle = true,
      direction = 'flex-row',
    }: {
      children: any;
      containerStyle?: boolean;
      direction?: string;
    }) => {
      return (
        <div
          className={`flex ${direction} flex-wrap flex-grow min-w-[200px] ${isRoot && containerStyle ? 'rounded-md border bg-card p-4 mt-5' : ''}`}
          style={{width: `${width}%`}}>
          {children}
        </div>
      );
    },
    [isRoot, width],
  );

  const renderContent = useCallback(
    (containerStyle: boolean = true) => {
      return (
        <Wrapper containerStyle={containerStyle}>
          {content.map(_i => renderItem(_i, _i.name))}
        </Wrapper>
      );
    },
    [Wrapper, content, renderItem],
  );

  if (item.title != null) {
    return (
      <Wrapper direction="flex-col">
        <div className="w-full mb-4">
          <Label className="text-md">{i18n.t(item.title)}</Label>
          <Separator />
        </div>
        {renderContent(false)}
      </Wrapper>
    );
  }

  return renderContent();
};
