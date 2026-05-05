// ---- CORE IMPORTS ---- //
import type {Client} from '@/goovee/.generated/client';
import type {AOSMetaJsonField} from '@/goovee/.generated/models';
import type {SelectOptions} from '@goovee/orm';
import {clone} from '@/utils';

export type ModelField = {
  id: string;
  version: number;
  name: string;
  title: string | null;
  type: string;
  defaultValue: string | null;
  model: string;
  modelField: string;
  widget: string | null;
  help: string | null;
  selection: string | null;
  selectionOptions: SelectionOption[] | null;
  hidden: boolean | null;
  required: boolean | null;
  readonly: boolean | null;
  nameField: boolean | null;
  minSize: number | null;
  maxSize: number | null;
  precision: number | null;
  scale: number | null;
  sequence: number | null;
  columnSequence: number | null;
  regex: string | null;
  showIf: string | null;
  contextField: string | null;
  contextFieldValue: string | null;
  widgetAttrs: string | null;
  targetJsonModel: {
    id: string;
    version: number;
    name: string | null;
  } | null;
  targetModel: string | null;
  jsonModel: {
    id: string;
    version: number;
    name: string | null;
  } | null;
  _count?: string | undefined;
  _cursor?: string | undefined;
  _hasNext?: boolean | undefined;
  _hasPrev?: boolean | undefined;
};

export type SelectionOption = {
  id: string;
  version: number;
  title: string | null;
  color: string | null;
  order: number | null;
  icon: string | null;
  value: string | null;
  _count?: string | undefined;
  _cursor?: string | undefined;
  _hasNext?: boolean | undefined;
  _hasPrev?: boolean | undefined;
};

export const modelFieldSelect = {
  columnSequence: true,
  name: true,
  title: true,
  type: true,
  defaultValue: true,
  model: true,
  modelField: true,
  selection: true,
  widget: true,
  help: true,
  hidden: true,
  required: true,
  readonly: true,
  nameField: true,
  minSize: true,
  maxSize: true,
  precision: true,
  scale: true,
  sequence: true,
  regex: true,
  showIf: true,
  contextField: true,
  contextFieldValue: true,
  widgetAttrs: true,
  targetJsonModel: {name: true},
  jsonModel: {name: true},
  targetModel: true,
} as const satisfies SelectOptions<AOSMetaJsonField>;

export async function findModelFields({
  modelName,
  jsonModelName,
  modelField,
  client,
  fieldName,
}: {
  modelName?: string;
  jsonModelName?: string;
  modelField: string;
  client: Client;
  fieldName?: string;
}): Promise<ModelField[]> {
  const fields = await client.aOSMetaJsonField
    .find({
      where: {
        modelField,
        showIf: null,
        ...(modelName && {model: modelName}),
        ...(jsonModelName && {jsonModel: {name: jsonModelName}}),
        ...(fieldName && {name: fieldName}),
        OR: [{hidden: false}, {hidden: null}],
      },
      orderBy: {sequence: 'ASC'},
      select: modelFieldSelect,
    })
    .then(clone);

  const result: ModelField[] = [];

  for (const _f of fields) {
    if (_f.selection != null) {
      const options = await findSelectionItems({
        selectionName: _f.selection,
        client,
      });
      result.push({..._f, selectionOptions: options});
    } else {
      result.push({..._f, selectionOptions: null});
    }
  }

  return result;
}

export async function findSelectionItems({
  selectionName,
  client,
}: {
  selectionName: string;
  client: Client;
}) {
  const options = await client.aOSMetaSelectItem.find({
    where: {
      select: {name: {eq: selectionName}},
    },
    select: {color: true, icon: true, order: true, title: true, value: true},
  });

  return options;
}
