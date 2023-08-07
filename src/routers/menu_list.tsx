import {
  CalculatorFilled,
  CommentOutlined,
  ContactsFilled,
  CrownFilled,
  DropboxCircleFilled,
  ExperimentFilled,
  FileImageFilled,
  FileTextFilled,
  GithubFilled,
  GithubOutlined,
  GitlabFilled,
  GoldenFilled,
  IdcardFilled,
  InsuranceFilled,
  LockFilled,
  MediumSquareFilled,
  MessageFilled,
  MoneyCollectFilled,
  NotificationFilled,
  PictureOutlined,
  RadarChartOutlined,
  ReconciliationFilled,
  RedEnvelopeFilled,
  RedditCircleFilled,
  ScheduleFilled,
  SettingFilled,
  ShopFilled,
  ShopOutlined,
  SmileFilled,
  UsergroupAddOutlined,
  WalletFilled
} from '@ant-design/icons'

const web = [
  {
    path: '/',
    name: '对话',
    icon: <CommentOutlined />,
    message: '与智能AI进行对话交流'
  },
  {
    path: '/draw',
    name: '绘画',
    icon: <PictureOutlined />,
    message: '利用智能AI绘画出图片'
  },
  {
    path: '/mapping',
    name: '思维导图',
    icon: <RadarChartOutlined />,
    message: '利用智能AI生成思维导图'
  },
  {
    path: '/shop',
    name: '商城',
    icon: <ShopOutlined />,
    message: '账户余额和充值套餐记录'
  },
  {
    path: '/user',
    name: '邀请',
    icon: <UsergroupAddOutlined />,
    message: '账户余额和充值套餐记录'
  },
  {
    path: 'https://github.com/79E/ChatGpt-Web',
    name: '项目地址',
    icon: <GithubOutlined />,
    message: '免费开源可商业化AiWeb项目'
  }
]

const admin = {
  path: '/',
  routes: [
    {
      path: '/admin',
      name: '欢迎光临',
      icon: <SmileFilled />
    },
    {
      path: '/admin_base',
      name: '基础管理',
      icon: <ExperimentFilled />,
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/carmi',
          name: '卡密管理',
          icon: <LockFilled />
        },
        {
          path: '/admin/aikey',
          name: 'AI Key管理',
          icon: <InsuranceFilled />
        }
      ]
    },
    {
      path: '/admin_user',
      name: '用户管理',
      icon: <CrownFilled />,
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/user',
          name: '用户列表',
          icon: <IdcardFilled />
        },
        {
          path: '/admin/turnover',
          name: '消费记录',
          icon: <ReconciliationFilled />
        },
        {
          path: '/admin/signin',
          name: '签到记录',
          icon: <ScheduleFilled />
        },
        {
          path: '/admin/invite',
          name: '邀请记录',
          icon: <ContactsFilled />
        },
        {
          path: '/admin/cashback',
          name: '佣金提成',
          icon: <CalculatorFilled />
        },
        {
          path: '/admin/withdrawal',
          name: '提现申请',
          icon: <RedEnvelopeFilled />
        },
        {
          path: '/admin/amounts',
          name: '余额明细',
          icon: <MediumSquareFilled />
        },
      ]
    },
    {
      name: '功能性管理',
      icon: <MessageFilled />,
      path: '/admin_message',
      routes: [
        {
          path: '/admin/dialog',
          name: '内置对话',
          icon: <GitlabFilled />
        },
        {
          path: '/admin/persona',
          name: '角色配置',
          icon: <RedditCircleFilled />
        },
        {
          path: '/admin/plugin',
          name: '插件管理',
          icon: <DropboxCircleFilled />
        },
        {
          path: '/admin/messages',
          name: '消息列表',
          icon: <FileTextFilled />
        },
        {
          path: '/admin/draw',
          name: '绘画列表',
          icon: <FileImageFilled />
        },
      ]
    },
    {
      path: '/admin_orders',
      name: '商品和订单',
      icon: <GoldenFilled />,
      routes: [
        {
          path: '/admin/product',
          name: '商品列表',
          icon: <ShopFilled />
        },
        {
          path: '/admin/payment',
          name: '支付配置',
          icon: <MoneyCollectFilled />
        },
        {
          path: '/admin/order',
          name: '支付订单',
          icon: <WalletFilled />
        }
      ]
    },
    {
      name: '通知配置',
      path: '/admin/notification',
      icon: <NotificationFilled />
    },
    {
      path: '/admin/config',
      name: '系统配置',
      icon: <SettingFilled />
    },
    {
      path: 'https://github.com/79E/ChatGpt-Web',
      name: 'Github',
      icon: <GithubFilled />
    }
  ]
}

export default {
  web,
  admin
}
