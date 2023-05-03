import { ProLayout } from '@ant-design/pro-components';
import styles from './index.module.less';
import HeaderRender from '@/components/HeaderRender';

function DrawPage() {
    return (
        <div className={styles.chatPage}>
            <ProLayout
                title={import.meta.env.VITE_APP_TITLE}
                logo={import.meta.env.VITE_APP_LOGO}
                layout="mix"
                splitMenus={false}
                contentWidth="Fluid"
                fixedHeader
                fixSiderbar
                headerRender={HeaderRender}
                contentStyle={{
                    height: 'calc(100vh - 56px)',
                    background: '#fff'
                }}
                siderMenuType="group"
                style={{
                    background: '#fff'
                }}
                menu={{
                    hideMenuWhenCollapsed: true,
                    locale: false,
                    collapsedShowGroupTitle: false
                }}
                suppressSiderWhenMenuEmpty
                siderWidth={300}
                avatarProps={{
                    src: 'https://cdn.jsdelivr.net/gh/duogongneng/testuitc/1682426702646avatarf3db669b024fad66-1930929abe2847093.png',
                    size: 'small',
                    render: (props, dom) => <>{dom}</>
                }}
            >
                <div className={styles.chatPage_container}>
                    <div className={styles.chatPage_container_one} />
                    <div className={styles.chatPage_container_two} />
                </div>
            </ProLayout>
        </div>
    )
}

export default DrawPage;