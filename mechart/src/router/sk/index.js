import { SkLayout, Sk } from '@/views/';
export default {
  meta: {
    name: '风控系统'
  },
  path: '/skclient/',
  component: SkLayout.Home,
  redirect: {name: 'home'},
  children: [
    {
      meta: {
        name: '首页'
      },
      path: 'home',
      name: 'home',
      component: Sk.Home.home
    },
    {
      meta: {
        name: '市场行情'
      },
      path: 'marketIndex',
      name: 'marketIndex',
      component: Sk.Market.marketIndex
    },
    {
      meta: {
        name: '项目库'
      },
      path: 'projectIndex',
      name: 'projectIndex',
      component: Sk.Project.projectIndex
    },
    {
      meta: {
        name: '宏观市场'
      },
      path: 'macroIndex',
      name: 'macroIndex',
      component: Sk.MacroApproval.macroIndex
    },
    {
      meta: {
        name: '评级查询'
      },
      path: 'gradeIndex',
      name: 'gradeIndex',
      component: Sk.Grade.gradeIndex
    },
    {
      meta: {
        name: '示例'
      },
      path: 'demo',
      name: 'demo',
      component: Sk.Demo.demoList
    }
  ]
};
