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
              {
                type: 'field',
                name: 'productCategory',
                colSpan: '3',
                autoTitle: 'Product category',
              },
              {
                type: 'field',
                name: 'supplierCatalogList',
                colSpan: '9',
                autoTitle: 'Supplier Catalog Lines',
                formView: 'supplier-catalog-form',
                gridView: 'supplier-catalog-grid',
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

export const GRID_VIEW = {
  type: 'VIEW',
  schema: {
    name: 'product-production-stock-grid',
    title: 'Produits',
    model: 'com.axelor.apps.base.db.Product',
    orderBy: 'code,name',
    type: 'grid',
    editIcon: true,
    rowHeight: 80,
    items: [
      {
        type: 'field',
        name: 'code',
        width: '120',
        bind: '{{code|unaccent|uppercase}}',
        autoTitle: 'Code',
      },
      {
        type: 'field',
        name: 'category',
        target: 'com.axelor.apps.base.db.ProductCategory',
        targetName: 'name',
        formView: 'product-category-form',
        gridView: 'product-category-grid',
        autoTitle: 'Catégorie produit',
      },
      {
        type: 'field',
        name: 'name',
        width: '300',
        autoTitle: 'Nom',
      },
      {
        type: 'field',
        name: 'createdBy',
        target: 'com.axelor.auth.db.User',
        targetName: 'name',
        formView: 'user-form',
        gridView: 'user-grid',
        autoTitle: 'User',
      },
      {
        type: 'field',
        name: 'color',
        width: '100',
        autoTitle: 'Color',
      },
      {
        type: 'field',
        name: 'notes',
        width: '400',
        widget: 'html',
        autoTitle: 'Notes',
      },
    ],
  },
};

export const FORM_VIEW_2 = {
  type: 'VIEW',
  schema: {
    name: 'supplier-catalog-form',
    title: 'Supplier catalog',
    model: 'com.axelor.apps.purchase.db.SupplierCatalog',
    type: 'form',
    items: [
      {
        type: 'panel',
        name: 'container',
        items: [
          {
            type: 'panel',
            items: [
              {
                type: 'field',
                name: 'productSupplierName',
                autoTitle: 'Product name on catalog',
              },
              {
                type: 'field',
                name: 'description',
                autoTitle: 'Description',
              },
              {
                type: 'field',
                name: 'productSupplierCode',
                autoTitle: 'Product code on catalog',
              },
            ],
          },
        ],
      },
    ],
  },
};

export const GRID_VIEW_2 = {
  type: 'VIEW',
  schema: {
    name: 'supplier-catalog-grid',
    title: 'Supplier catalogs',
    model: 'com.axelor.apps.purchase.db.SupplierCatalog',
    orderBy: 'productSupplierName',
    type: 'grid',
    editIcon: true,
    rowHeight: 80,
    items: [
      {
        type: 'field',
        name: 'productSupplierName',
        autoTitle: 'Product name on catalog',
      },
      {
        type: 'field',
        name: 'productSupplierCode',
        autoTitle: 'Product code on catalog',
      },
      {
        type: 'field',
        name: 'description',
        autoTitle: 'Description',
      },
      {
        type: 'field',
        name: 'supplierPartner',
        target: 'com.axelor.apps.base.db.Partner',
        targetName: 'fullName',
        autoTitle: 'Partner',
      },
    ],
  },
};
