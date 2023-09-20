import Layout from '../layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/workspace',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/workspace/WorkspaceView.vue'),
        meta: {
          title: 'Workspace',
          role: ['admin'],
        },
      },
    ],
  },
  {
    path: '/addworkspace',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/workspace/AddWorkspaceView.vue'),
        meta: {
          title: 'New Workspace',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
