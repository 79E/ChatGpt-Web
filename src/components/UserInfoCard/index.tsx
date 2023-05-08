
import { UserDetail } from '@/types';
import styles from './index.module.less';

function UserInfoCard(props: {
    info?: UserDetail
}) {
    return (
        <div className={styles.userInfo}>
            <img className={styles.userInfo_avatar} src={props.info?.avatar} alt="" />
            <div className={styles.userInfo_info}>
                <p>{props.info?.nickname}</p>
                <span>{props.info?.account}</span>
            </div>
            <div className={styles.userInfo_quota}>
                <p />
            </div>
        </div>
    )
}

export default UserInfoCard;