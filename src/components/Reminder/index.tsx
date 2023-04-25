import styles from './index.module.less';

function Reminder(){

    const list = [
        {
            id: 'zhichangzhuli',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x11dd9e54d8caafc4b2.png',
            name: '职场助理',
            desc: '作为手机斗地主游戏的产品经理，该如何做成国内爆款？'
        },
        {
            id: 'dianyingjiaoben',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x12ff8d52b031b85fbe.png',
            name: '电影脚本',
            desc: '写一段电影脚本，讲一个北漂草根创业逆袭的故事'
        },
        {
            id: 'cuanxieduanwen',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x132f6276a56cf44e81.png',
            name: '撰写短文',
            desc: '写一篇短文，用故事阐释幸福的意义'
        },{
            id: 'daimabianxie',
            icon: 'https://www.imageoss.com/images/2023/04/23/Frame2x14a0f6c48d4355c6ea.png',
            name: '代码编写',
            desc: '使用JavaScript写一个获取随机数的函数'
        }
    ]

    return (
<div className={styles.reminder}>
        <h2 className={styles.reminder_title}><img src="https://www.imageoss.com/images/2023/04/23/robot-logo4987eb2ca3f5ec85.png" alt="" />欢迎来到 {import.meta.env.VITE_APP_TITLE}</h2>
        <p className={styles.reminder_message}>与AI智能聊天，畅想无限可能！基于先进的AI引擎，让你的交流更加智能、高效、便捷！</p>
        <p className={styles.reminder_message}><span>Shift</span> + <span>Enter</span> 换行。开头输入 <span>/</span> 召唤 Prompt 角色预设。</p>
        <div className={styles.reminder_question}>
            {
                list.map((item)=>{
                    return (
<div key={item.id} className={styles.reminder_question_item}>
                        <img src={item.icon} alt="" />
                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>
</div>
)
                })
            }

        </div>
</div>
);
}

export default Reminder;
