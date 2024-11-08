/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { markRaw } from 'vue';
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import router from '../routes';
import pinia from '../store';
import swal from './swal';
import loader from './loader';
import { api } from '../helpers/http';

const comps = import.meta.glob('../views/**/*.vue');

export async function registerPlugins(app) {
  pinia.use(({ store }) => {
    store.$router = markRaw(router);
  });
  loadFonts();
  app.use(vuetify);
  app.use(pinia);

  if (localStorage.getItem('access_token')) {
    const response = await api.get('/Tenant/Account/GetUserMenus');
    console.log(response);
    const menus = response.data.data.reduce((finalResult, item) => {
      finalResult[item.module] = finalResult[item.module] || {
        isMenu: item.mIsMenu,
        name: item.module,
        icon: item.mIcon,
        menu: { title: item.module },
        position: item.mPosition,
      };
      if (item.mComponent) {
        finalResult[item.module]['menu']['component'] = item.mComponent;
      }
      if (item.mUrl) {
        finalResult[item.module]['menu']['url'] = item.mUrl;
      }
      if (item.fUrl) {
        finalResult[item.module]['menu']['children'] = finalResult[item.module]['menu']['children'] || [];
        let findIndex = finalResult[item.module]['menu']['children'].findIndex((x) => x.title == item.feature);

        if (findIndex == -1)
          finalResult[item.module]['menu']['children'].push({
            isMenu: item.fIsMenu,
            title: item.feature,
            codes: [item.code],
            icon: item.fIcon,
            url: item.fUrl,
            component: item.fComponent,
            position: item.fPosition,
          });
        else finalResult[item.module]['menu']['children'][findIndex]['codes'].push(item.code);
      }

      return finalResult;
    }, {});

    // Manually added the "Organization Management" module with a "Organization" dropdown
    menus['Organization Management'] = {
      isMenu: true,
      name: 'Organization Management',
      icon: 'mdi-briefcase',
      menu: {
        title: 'Organization Management',
        children: [
          {
            isMenu: true,
            title: 'Organization',
            codes: ['ORG-R', 'ORG-C'],
            icon: 'mdi-domain',
            url: '/organization',
            component: 'organization/OrganizationView',
            position: 0,
          },
        ],
      },
      position: 4,
    };
    menus['Account'] = {
      isMenu: true,
      name: 'Account Management',
      icon: 'mdi-account-cog',
      menu: {
        title: 'Account Management',
        children: [
          {
            isMenu: true,
            title: 'BalanceSheet',
            codes: ['BLS-R'],
            icon: 'mdi-file-chart',
            url: '/balanceSheet',
            component: 'balanceSheet/BalanceSheetView',
            position: 0,
          },
        ],
      },
      position: 4,
    };
    console.log('menus', menus);
    const modules = [];

    // {
    //   "id": "3f03b1bd-5044-4235-bda4-1b3dabea1451",
    //   "name": "Dashboard",
    //   "code": "dashboard",
    //   "icon": "mdi-view-dashboard",
    //   "menu": {
    //     "title": "Dashboard",
    //     "url": "/dashboard",
    //     "component": "HomeView"
    //   },
    //   "position": 1,
    //   "createdAt": "2024-05-02T10:48:07.576Z",
    //   "updatedAt": "2024-05-02T10:48:07.576Z"
    // }
    for (let key in menus) modules.push(menus[key]);
    // const modules = [
    //   {
    //     "id": "3f03b1bd-5044-4235-bda4-1b3dabea1451",
    //     "name": "Dashboard",
    //     "code": "dashboard",
    //     "icon": "mdi-view-dashboard",
    //     "menu": {
    //         "title": "Dashboard",
    //         "url": "/dashboard",
    //         "component": "HomeView"
    //     },
    //     "position": 1,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    // },
    //   {
    //     "id": "6fc58c4d-609a-4bb2-a9ad-a142492b1a66",
    //     "name": "Accounting",
    //     "code": "accounting",
    //     "icon": "mdi-cash",
    //     "menu": {
    //         "title": "Accounting",
    //         "children": [
    //             {
    //                 "title": "Chart of Accounts",
    //                 "code": "chart_of_accounts",
    //                 "icon": "mdi-account",
    //                 "url": "/accounting/chart-of-accounts",
    //                 "component": "accounting/ChartOfAccountsView"
    //             },
    //             {
    //                 "title": "Vouchers",
    //                 "code": "vouchers",
    //                 "icon": "mdi-book",
    //                 "url": "/accounting/vouchers",
    //                 "component": "accounting/VouchersView"
    //             }
    //         ]
    //     },
    //     "position": 13,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    // },
    //   {
    //     "id": "408702f1-43aa-47a8-b172-eb6c4c514d80",
    //     "name": "Customer",
    //     "code": "customer",
    //     "icon": "mdi-account-group",
    //     "menu": {
    //       "title": "Customer",
    //       "url": "/customers",
    //       "component": "CustomersView"
    //     },
    //     "position": 10,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    //   },
    //   {
    //     "id": "408702f1-43aa-47a8-b172-eb6c4c514d80",
    //     "name": "Supplier",
    //     "code": "supplier",
    //     "icon": "mdi-account-group",
    //     "menu": {
    //       "title": "Suppliers",
    //       "url": "/suppliers",
    //       "component": "SuppliersView"
    //     },
    //     "position": 10,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    //   },
    //   {
    //     "id": "408702f1-43aa-47a8-b172-eb6c4c514d80",
    //     "name": "User Management",
    //     "code": "user",
    //     "icon": "mdi-account-group",
    //     "menu": {
    //       "title": "User Management",
    //       "url": "/users",
    //       "component": "UsersView"
    //     },
    //     "position": 3,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    //   },
    //   {
    //     "id": "6e37b655-f89e-40c3-85e7-11168446547c",
    //     "name": "Role Management",
    //     "code": "role",
    //     "icon": "mdi-account-key",
    //     "menu": {
    //       "title": "Role Management",
    //       "url": "/roles",
    //       "component": "RolesView"
    //     },
    //     "position": 4,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    //   },
    //   {
    //     "id": "b7c6b5b9-c45e-4bf6-a6ad-6d81ffb47da8",
    //     "name": "Privilege Management",
    //     "code": "privilege",
    //     "icon": "mdi-lock",
    //     "menu": {
    //       "title": "Privilege Management",
    //       "url": "/privileges",
    //       "component": "PrivilegesView"
    //     },
    //     "position": 5,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    //   },
    //   {
    //     "id": "c674b017-5826-476c-91db-1b6fb9fe6583",
    //     "name": "Catalog",
    //     "code": "catalog",
    //     "icon": "mdi-shopping",
    //     "menu": {
    //       "title": "Catalog",
    //       "children": [
    //         {
    //           "title": "Products",
    //           "code": "products",
    //           "icon": "mdi-package",
    //           "url": "/catalog/products",
    //           "position": 1,
    //           "component": "catalog/ProductsView"
    //         },
    //         {
    //           "title": "Stocks",
    //           "code": "stocks",
    //           "icon": "mdi-package",
    //           "url": "/catalog/stocks",
    //           "position": 1,
    //           "component": "catalog/StocksView"
    //         },

    //         {
    //           "title": "Manufacturer",
    //           "code": "manufacturer",
    //           "icon": "mdi-package",
    //           "url": "/catalog/Manufacturer",
    //           "position": 4,
    //           "component": "catalog/Manufacturer"
    //         },
    //         {
    //           "title": "Categories",
    //           "code": "categories",
    //           "icon": "mdi-sitemap",
    //           "url": "/catalog/categories",
    //           "position": 2,
    //           "component": "catalog/CategoriesView"
    //         },
    //         {
    //           "title": "Units",
    //           "code": "units",
    //           "icon": "mdi-scale-balance",
    //           "url": "/catalog/units",
    //           "position": 3,
    //           "component": "catalog/UnitsView"
    //         }
    //       ]
    //     },
    //     "position": 7,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    //   },
    //   {
    //     "id": "fd0cbbbc-31a2-49ba-a9d3-85dfa213c3b0",
    //     "name": "Invoices",
    //     "code": "invoice",
    //     "icon": "mdi-file-document",
    //     "menu": {
    //       "title": "Invoices",
    //       "children": [
    //         {
    //           "title": "Purchase Invoice",
    //           "code": "purchase_invoice",
    //           "icon": "mdi-file-document",
    //           "url": "/invoices/purchase",
    //           "component": "invoices/PurchaseInvoiceView"
    //         },
    //         {
    //           "title": "Sale Invoice",
    //           "code": "sale_invoice",
    //           "icon": "mdi-file-document",
    //           "url": "/invoices/sale",
    //           "component": "invoices/SaleInvoiceView"
    //         }
    //       ]
    //     },
    //     "position": 15,
    //     "createdAt": "2024-05-02T10:48:07.576Z",
    //     "updatedAt": "2024-05-02T10:48:07.576Z"
    //   }
    // ];
    await Promise.all(
      modules.map(async (module) => {
        if (module.menu) {
          let route = {};
          if (module.menu.url) {
            route.path = `${module.menu.url}`;
          }
          route.name = `${module.menu.title}`;
          route.redirect = module.menu.redirect ?? undefined;
          if (module.menu.component) {
            route.component = comps[`../views/${module.menu.component}.vue`];
          }
          route.meta = module.menu?.meta ?? {
            requiresAuth: true,

            layout: 'DashboardLayout',
          };
          if (module?.menu?.children) {
            route.children = await Promise.all(
              module.menu.children.map(async (child) => {
                const permissionCodes = Array.isArray(child.codes) ? child.codes : child.codes ? [child.codes] : [];
                return {
                  path: `${child.url}`,
                  name: `${child.title}`,
                  component: comps[`../views/${child.component}.vue`],
                  meta: child.meta ?? {
                    requiresAuth: true,
                    permissionCodes: permissionCodes,
                    layout: 'DashboardLayout',
                  },
                };
              }),
            );
          }
          router.addRoute(route);
        }
      }),
    );

    // router.addRoute({
    //   path: '/add-purchase-invoice',
    //   name: 'add-purchase-invoice',
    //   component: comps[`../views/purchase/AddPurchaseInvoiceView.vue`],
    //   meta: {
    //     requiresAuth: true,
    //     layout: 'DashboardLayout',
    //   },
    // });
    // router.addRoute({
    //   path: '/add-purchase-order',
    //   name: 'add-purchase-order',
    //   component: comps[`../views/purchase/AddPurchaseOrderView.vue`],
    //   meta: {
    //     requiresAuth: true,
    //     layout: 'DashboardLayout',
    //   },
    // });
    // router.addRoute({
    //   path: '/add-purchase-return-invoice',
    //   name: 'add-purchase-return-invoice',
    //   component: comps[`../views/purchase/AddPurchaseReturnInvoiceView.vue`],
    //   meta: {
    //     requiresAuth: true,
    //     layout: 'DashboardLayout',
    //   },
    // });
    // router.addRoute({
    //   path: '/add-sale-order',
    //   name: 'add-sale-order',
    //   component: comps[`../views/sale/AddSaleOrderView.vue`],
    //   meta: {
    //     requiresAuth: true,
    //     layout: 'DashboardLayout',
    //   },
    // });
    // router.addRoute({
    //   path: '/add-sale-invoice',
    //   name: 'add-sale-invoice',
    //   component: comps[`../views/sale/AddSaleInvoiceView.vue`],
    //   meta: {
    //     requiresAuth: true,
    //     layout: 'DashboardLayout',
    //   },
    // });
    // router.addRoute({
    //   path: '/add-sale-return-invoice',
    //   name: 'add-sale-return-invoice',
    //   component: comps[`../views/sale/AddReturnSaleInvoice.vue`],
    //   meta: {
    //     requiresAuth: true,
    //     layout: 'DashboardLayout',
    //   },
    // });
    app.provide('modules', modules);
  }

  app.use(loader(pinia));

  app.use(swal);
  app.use(router);

  return app;
}
