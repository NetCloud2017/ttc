import { Layout, Home } from '../../views/';
export default {
  meta: {
    name: '主页'
  },
  path: '/',
  name: 'Home',
  component: Layout.Home,
  redirect: 'index',
  children: [{
    path: 'index',
    name: 'Index',
    icon: 'bar-chart',
    component: Home.IndexContent
  }]
};
