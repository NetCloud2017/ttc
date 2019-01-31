import { Layout, Mdc } from '../../views';

export default {
  meta: {
    name: '数据中心'
  },
  path: '/mds/',
  component: Layout.Home,
  redirect: {name: 'Dict'},
  children: [
    {
      meta: {
        name: '数据字典'
      },
      path: 'dict',
      name: 'Dict',
      component: Layout.Content,
      redirect: {name: 'dictList'},
      children: [
        {
          meta: {
            name: '字典列表'
          },
          path: 'list',
          name: 'dictList',
          component: Mdc.Dict.List
        }
      ]
    },
    {
      meta: {
        name: 'Topic管理'
      },
      path: 'topic',
      name: 'Topic',
      component: Layout.Content,
      redirect: {name: 'TopicList'},
      children: [
        {
          meta: {
            name: 'Topic列表'
          },
          path: 'list',
          name: 'TopicList',
          component: Mdc.Topic.List
        }
      ]
    },
    {
      meta: {
        name: 'Tag管理'
      },
      path: 'tag',
      name: 'Tag',
      component: Layout.Content,
      redirect: {name: 'TagList'},
      children: [
        {
          meta: {
            name: 'Tag列表'
          },
          path: 'list',
          name: 'TagList',
          component: Mdc.Tag.List
        }
      ]
    },
    {
      meta: {
        name: 'producer管理'
      },
      path: 'producer',
      name: 'Producer',
      component: Layout.Content,
      redirect: {name: 'ProducerList'},
      children: [
        {
          meta: {
            name: 'producer列表'
          },
          path: 'list',
          name: 'ProducerList',
          component: Mdc.Producer.List
        }
      ]
    },
    {
      meta: {
        name: 'consumer管理'
      },
      path: 'consumer',
      name: 'Consumer',
      component: Layout.Content,
      redirect: {name: 'ConsumerList'},
      children: [
        {
          meta: {
            name: 'Consumer列表'
          },
          path: 'list',
          name: 'ConsumerList',
          component: Mdc.Consumer.List
        }
      ]
    },
    {
      meta: {
        name: '订阅管理'
      },
      path: 'subscribe',
      name: 'Subscribe',
      component: Layout.Content,
      redirect: {name: 'SubscribeList'},
      children: [
        {
          meta: {
            name: '订阅列表'
          },
          path: 'list',
          name: 'SubscribeList',
          component: Mdc.Subscribe.List
        }
      ]
    },
    {
      meta: {
        name: '发布管理'
      },
      path: 'publish',
      name: 'Publish',
      component: Layout.Content,
      redirect: {name: 'PublishList'},
      children: [
        {
          meta: {
            name: '发布列表'
          },
          path: 'list',
          name: 'PublishList',
          component: Mdc.Publish.List
        }
      ]
    },
    {
      meta: {
        name: '可靠消息'
      },
      path: 'message',
      name: 'Message',
      component: Layout.Content,
      redirect: {name: 'ReliableMessage'},
      children: [
        {
          meta: {
            name: '可靠消息列表'
          },
          path: 'reliable',
          name: 'ReliableMessage',
          component: Mdc.Message.Reliable
        },
        {
          meta: {
            name: '消息记录'
          },
          path: 'record',
          name: 'RecordMessage',
          component: Mdc.Message.Record
        }
      ]
    }
  ]
};
