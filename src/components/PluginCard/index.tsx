import styles from './index.module.less'

function PluginCard(info: {
    avatar: string,
    name: string,
    description?: string,
}) {
    return (
        <div className={styles.pluginCard}>
            <img src={info.avatar} alt=""  />
            <div className={styles.pluginCard_info}>
                <p>{info.name}</p>
                <span>{info.description}</span>
            </div>
        </div>
    )
}

export default PluginCard;