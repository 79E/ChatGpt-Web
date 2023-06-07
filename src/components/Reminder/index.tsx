import styles from './index.module.less'

function Reminder() {
  const list = [
    {
      id: 'zhichangzhuli',
      icon: 'https://p1.meituan.net/travelcube/ff6b82c66b420ca0867244eca69196a51213.png',
      name: '职场助理',
      desc: '作为手机斗地主游戏的产品经理，该如何做成国内爆款？'
    },
    {
      id: 'dianyingjiaoben',
      icon: 'https://p1.meituan.net/travelcube/114c7d1966a4c80a961ea2b51d45f30a1264.png',
      name: '电影脚本',
      desc: '写一段电影脚本，讲一个北漂草根创业逆袭的故事'
    },
    {
      id: 'cuanxieduanwen',
      icon: 'https://p0.meituan.net/travelcube/1d69e439c722baad87266e4d2f8de0f0428.png',
      name: '撰写短文',
      desc: '写一篇短文，用故事阐释幸福的意义'
    },
    {
      id: 'daimabianxie',
      icon: 'https://p0.meituan.net/travelcube/755ac03833e2f9e5dca8069ad1f437ff495.png',
      name: '代码编写',
      desc: '使用JavaScript写一个获取随机数的函数'
    }
  ]

  return (
    <div className={styles.reminder}>
      <h2 className={styles.reminder_title}>
        <img
          src="https://p0.meituan.net/travelcube/aa79b6289ebbc27e588c20944e58c5742303.png"
          alt=""
        />
        欢迎来到 {document.title}
      </h2>
      <p className={styles.reminder_message}>
        与AI智能聊天，畅想无限可能！基于先进的AI引擎，让你的交流更加智能、高效、便捷！
      </p>
      <p className={styles.reminder_message}>
        <span>Shift</span> + <span>Enter</span> 换行。开头输入 <span>/</span> 召唤 Prompt
        AI提示指令预设。
      </p>
      <div className={styles.reminder_question}>
        {list.map((item) => {
          return (
            <div key={item.id} className={styles.reminder_question_item}>
              <img src={item.icon} alt="" />
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reminder
