import DashboardLayout from '@/layouts/DashboardLayout.vue';

const routes = [
  {
    path: '/workspace',
    component: () => import('../views/workspace/WorkspaceView.vue'),
    meta: {
      title: 'Workspace',
      role: ['admin'],
      layout: DashboardLayout,
    },
  },
  {
    path: '/workspace/add',
    component: () => import('../views/workspace/AddWorkspaceView.vue'),
    meta: {
      title: 'New Workspace',
      role: ['admin'],
      layout: DashboardLayout,
    },
  },
];

export default routes;
