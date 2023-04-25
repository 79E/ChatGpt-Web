import { FolderOpenFilled, WalletFilled, SmileFilled, MailFilled, MobileFilled, CrownFilled, SkinFilled, AccountBookFilled, ChromeFilled, SlidersFilled, GoldFilled, DollarCircleFilled, ClockCircleFilled, BookFilled, ProfileFilled, SlackCircleFilled, RedditCircleFilled, ReconciliationFilled, LayoutFilled } from '@ant-design/icons';

const menuList = {
    path: '/',
    routes: [
      {
        path: '/admin',
        name: '欢迎观临',
        icon: <SmileFilled />,
      },
      {
        path: '/admin_user',
        name: '用户管理',
        icon: <SkinFilled />,
        access: 'canAdmin',
        component: './Admin',
        routes: [
          {
            path: '/admin/users',
            name: '用户列表',
            icon: <CrownFilled />,
          },
          {
            path: '/admin/user_turnover',
            name: '消费记录',
            icon: <AccountBookFilled />,
          },
        ],
      },
      {
        name: '消息管理',
        icon: <FolderOpenFilled />,
        path: '/admin_message',
        routes: [
          {
            path: '/admin/messages',
            name: '消息列表',
            icon: <MobileFilled />,
          },
          {
            path: '/admin/examine_delay',
            name: '延迟审核匿名',
            icon: <ClockCircleFilled />,
          },
          {
            path: '/admin/nmsms',
            name: '三方消息列表',
            icon: <MailFilled />,
          },
          {
            path: '/admin/nmsms_examine',
            name: '三方待审核列表',
            icon: <WalletFilled />,
          },
          {
            path: '/admin/record',
            name: '发送记录',
            icon: <ReconciliationFilled />,
          },
        ],
      },
      {
        path: '/admin_orders',
        name: '商品和订单',
        icon: <SlidersFilled />,
        routes: [
            {
                path: '/admin/goods',
                name: '短信额度商品',
                icon: <GoldFilled />,
            },
            {
                path: '/admin/pays',
                name: '微信支付记录',
                icon: <DollarCircleFilled />,
            },
        ],
      },
      {
        path: '/admin/jihua',
        name: '计划管理',
        icon: <ClockCircleFilled />,
        routes: [
            {
                path: '/admin/plan',
                name: '计划类目',
                icon: <LayoutFilled />,
            },
            {
                path: '/admin/execute',
                name: '用户计划',
                icon: <RedditCircleFilled />,
            },
            {
              path: '/admin/essay',
              name: '短信文案',
              icon: <ProfileFilled />,
            },
            {
              path: '/admin/types',
              name: '文案类型',
              icon: <SlackCircleFilled />,
            },
        ],
      },
      {
        path: 'http://jie2.jiesms.cn/user/',
        name: '短信控制台',
        icon: <ChromeFilled />,
      },
      {
        path: 'https://www.kaifain.com/dashboard',
        name: 'AI-API控制台',
        icon: <ChromeFilled />,
      },
      {
        path: 'https://ai.baidu.com/censoring',
        name: '百度内容审核控制台',
        icon: <ChromeFilled />,
      },
    ],
};
export default menuList;
