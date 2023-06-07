import styles from './index.module.less'

function Page404 (){
    return (
        <div className={styles.page404}>
            <img className={styles.page404_icon} src="https://u1.dl0.cn/images/l2963j.png" alt="" srcSet="" />
            <div className={styles.page404_text}>
                <h3>抱歉，您访问的页面不存在!</h3>
                <p>请确认链接地址是否正确后重新尝试</p>
            </div>
            <div className={styles.page404_button} onClick={()=>{
                location.href = '/'
            }}
            >
                回到首页
            </div>
        </div>
    )
}

export default Page404;
