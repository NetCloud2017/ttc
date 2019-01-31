import { Layout, Omc } from '../../views';
export default {
  meta: {
    name: '订单中心'
  },
  path: '/oms/',
  component: Layout.Home,
  redirect: {name: 'Order'},
  children: [
    {
      meta: {
        name: '购物车管理'
      },
      path: 'cart',
      name: 'Cart',
      component: Layout.Content,
      redirect: {name: 'CarList'},
      children: [
        {
          meta: {
            name: '购物车列表'
          },
          path: 'list',
          name: 'CarList',
          component: Omc.Cart.List
        },
        {
          meta: {
            name: '测试页1'
          },
          path: 'add',
          name: 'AddCarTest',
          component: Omc.Cart.Test
        },
        {
          meta: {
            name: '测试页2'
          },
          path: 'add2',
          name: 'AddCarTest2',
          component: Omc.Cart.Test2
        }
      ]
    },
    {
      meta: {
        name: '订单管理'
      },
      path: 'order',
      name: 'Order',
      component: Layout.Content,
      redirect: {name: 'OrderList'},
      children: [
        {
          meta: {
            name: '订单列表'
          },
          path: 'list',
          name: 'OrderList',
          component: Omc.Order.List
        },
        {
          meta: {
            name: '订单详情'
          },
          path: 'detail',
          name: 'OrderDetail',
          component: Omc.Order.Detail
        }
      ]
    },
    {
      meta: {
        name: '商品管理'
      },
      path: 'product',
      name: 'Product',
      component: Layout.Content,
      redirect: {name: 'ProductList'},
      children: [
        {
          meta: {
            name: '商品列表'
          },
          path: 'list',
          name: 'ProductList',
          component: Omc.Product.List
        },
        {
          meta: {
            name: '商品详情'
          },
          path: 'detail',
          name: 'ProductDetail',
          component: Omc.Product.Detail
        },
        {
          meta: {
            name: '新增商品'
          },
          path: 'add',
          name: 'AddProduct',
          component: Omc.Product.Add
        },
        {
          meta: {
            name: '修改商品'
          },
          path: 'edit',
          name: 'EditProduct',
          component: Omc.Product.Edit
        }
      ]
    },
    {
      meta: {
        name: '收货人地址'
      },
      path: 'shipping',
      name: 'Shipping',
      component: Layout.Content,
      redirect: {name: 'ShippingList'},
      children: [
        {
          meta: {
            name: '收货人地址列表'
          },
          path: 'list',
          name: 'ShippingList',
          component: Omc.Shipping.List
        }
      ]
    },
    {
      meta: {
        name: '商品分类'
      },
      path: 'category',
      name: 'category',
      component: Layout.Content,
      redirect: {name: 'CategoryList'},
      children: [
        {
          meta: {
            name: '商品分类列表'
          },
          path: 'list',
          name: 'CategoryList',
          component: Omc.Category.List
        }
      ]
    }
  ]
};
