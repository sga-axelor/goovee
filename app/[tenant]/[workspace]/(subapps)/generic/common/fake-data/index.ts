export const FORM_VIEW = {
  type: 'VIEW',
  schema: {
    name: 'product-form',
    title: 'Product',
    model: 'com.axelor.apps.base.db.Product',
    type: 'form',
    items: [
      {
        type: 'panel',
        name: 'overviewPanel',
        title: 'Overview',
        items: [
          {
            type: 'panel',
            colSpan: '3',
            items: [
              {
                type: 'field',
                name: 'isActivity',
                showTitle: false,
                colSpan: '12',
                autoTitle: 'Activity',
              },
            ],
          },
          {
            type: 'panel',
            colSpan: '9',
            items: [
              {
                type: 'field',
                name: 'name',
                colSpan: '3',
                autoTitle: 'Name',
              },
              {
                type: 'field',
                name: 'code',
                colSpan: '9',
                autoTitle: 'Code',
              },
            ],
          },
        ],
      },
      {
        type: 'panel',
        name: 'notesPanel',
        title: 'Notes',
        items: [
          {
            type: 'field',
            name: 'description',
            showTitle: false,
            colSpan: '12',
            widget: 'html',
            autoTitle: 'Description',
          },
        ],
      },
    ],
  },
};
