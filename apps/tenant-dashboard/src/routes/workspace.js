const routes = [
  {
    path: '/workspace',
    component: () => import('../views/workspace/WorkspaceView.vue'),
    meta: {
      title: 'Manage Workspace',
    },
  },
];

export default routes;
