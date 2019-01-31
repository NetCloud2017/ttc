import { Layout, Uac } from '../../views/';

export default {
  meta: {
    name: '用户中心'
  },
  path: '/uas/',
  component: Layout.Home,
  redirect: {name: 'Role'},
  children: [
    {
      meta: {
        name: '角色管理'
      },
      path: 'role',
      name: 'Role',
      component: Layout.Content,
      redirect: {name: 'roleList'},
      children: [
        {
          meta: {
            name: '角色列表'
          },
          path: 'list',
          name: 'roleList',
          component: Uac.Role.List
        },
        {
          meta: {
            name: '绑定权限'
          },
          path: 'bindAction',
          name: 'BindAction',
          component: Uac.Role.BindAction
        },
        {
          meta: {
            name: '绑定菜单'
          },
          path: 'bindMenu',
          name: 'BindMenu',
          component: Uac.Role.BindMenu
        }
      ]
    },
    {
      meta: {
        name: '用户管理'
      },
      path: 'user',
      name: 'User',
      component: Layout.Content,
      redirect: {name: 'userList'},
      children: [
        {
          meta: {
            name: '用户列表'
          },
          path: 'list',
          name: 'userList',
          component: Uac.User.List
        },
        {
          meta: {
            name: '在线用户'
          },
          path: 'onLineList',
          name: 'OnLineList',
          component: Uac.User.OnLine
        },
        {
          meta: {
            name: '用户详情'
          },
          path: 'view',
          name: 'userView',
          component: Uac.User.View
        }
      ]
    },
    {
      meta: {
        name: '权限管理'
      },
      path: 'action',
      name: 'Action',
      component: Layout.Content,
      redirect: {name: 'actionList'},
      children: [
        {
          meta: {
            name: '权限列表'
          },
          path: 'list',
          name: 'actionList',
          component: Uac.Action.List
        }
      ]
    },
    {
      meta: {
        name: '菜单管理'
      },
      path: 'menu',
      name: 'Menu',
      component: Layout.Content,
      redirect: {name: 'menuList'},
      children: [
        {
          meta: {
            name: '菜单列表'
          },
          path: 'list',
          name: 'menuList',
          component: Uac.Menu.List
        }
      ]
    },
    {
      meta: {
        name: '组织管理'
      },
      path: 'group',
      name: 'Group',
      component: Layout.Content,
      redirect: {name: 'groupList'},
      children: [
        {
          meta: {
            name: '组织列表'
          },
          path: 'list',
          name: 'groupList',
          component: Uac.Group.List
        }
      ]
    },
    {
      meta: {
        name: '运营监控'
      },
      path: 'monitor',
      name: 'Monitor',
      component: Layout.Content,
      redirect: {name: 'Swagger'},
      children: [
        {
          meta: {
            name: '接口文档'
          },
          path: 'swagger',
          name: 'Swagger',
          component: Uac.Monitor.Swagger
        },
        {
          meta: {
            name: '数据源监控'
          },
          path: 'druid',
          name: 'Druid',
          component: Uac.Monitor.Druid
        },
        {
          meta: {
            name: '调用链监控'
          },
          path: 'zipkin',
          name: 'Zipkin',
          component: Uac.Monitor.Zipkin
        },
        {
          meta: {
            name: 'boot-admin监控'
          },
          path: 'boot',
          name: 'Boot',
          component: Uac.Monitor.Boot
        },
        {
          meta: {
            name: '操作日志监控'
          },
          path: 'log',
          name: 'Log',
          component: Uac.Log.List
        },
        {
          meta: {
            name: '异常日志监控'
          },
          path: 'exception',
          name: 'Exception',
          component: Uac.Exception.List
        },
        {
          meta: {
            name: '用户Token监控'
          },
          path: 'token',
          name: 'Token',
          component: Uac.Token.List
        }
      ]
    },
    {
      meta: {
        name: '开发者'
      },
      path: 'dev',
      name: 'Dev',
      component: Layout.Content,
      redirect: {name: 'devList'},
      children: [
        {
          meta: {
            name: '列表'
          },
          path: 'list',
          name: 'devList',
          component: Uac.Dev.List
        },
        {
          meta: {
            name: '表单'
          },
          path: 'bill',
          name: 'devBill',
          component: Uac.Dev.Bill
        },
        {
          meta: {
            name: '选择框'
          },
          path: 'selectdemo',
          name: 'Select',
          component: Uac.Dev.Select
        },
        {
          meta: {
            name: '文件上传预览'
          },
          path: 'filedemo',
          name: 'FileUpload',
          component: Uac.Dev.FileUpload
        },
        {
          meta: {
            name: '表单'
          },
          path: 'form',
          name: 'form',
          component: Uac.Dev.Form
        },
        {
          meta: {
            name: '时间'
          },
          path: 'timedemo',
          name: 'Time',
          component: Uac.Dev.Time
        },
        {
          meta: {
            name: 'layer弹窗'
          },
          path: 'sideWindowdemo',
          name: 'sideWindow',
          component: Uac.Dev.SideWindow
        },
        {
          meta: {
            name: '三级联动选择'
          },
          path: 'threeSelect',
          name: 'threeSelect',
          component: Uac.Dev.ThreeSelect
        },
        {
          meta: {
            name: 'svg图片使用'
          },
          path: 'svg',
          name: 'svg',
          component: Uac.Dev.Svg
        },
        {
          meta: {
            name: '动态添加列表'
          },
          path: 'addDeleteTable',
          name: 'addDeleteTable',
          component: Uac.Dev.AddDeleteTable
        },
        {
          meta: {
            name: '信息分类显示组件demo'
          },
          path: 'infoCategoryDemo',
          name: 'infoCategoryDemo',
          component: Uac.Dev.InfoCategoryDemo
        }
      ]
    }
  ]
};
