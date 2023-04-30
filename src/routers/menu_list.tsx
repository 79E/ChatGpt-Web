import { CommentOutlined, PictureOutlined, ShopOutlined } from '@ant-design/icons';

const menuList = [
  {
    path: '/',
    name: '对话',
    icon: <CommentOutlined />,
    message: '与智能AI进行对话交流',
  },
  {
    path: '/draw',
    name: '绘画',
    icon: <PictureOutlined />,
    message: '利用智能AI绘画出图片',
  },
  {
    path: '/shop',
    name: '商城',
    icon: <ShopOutlined />,
    message: '账户余额和充值套餐记录',
  },
];
export default menuList;
