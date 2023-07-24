import { chatStore, configStore } from '@/store'
import styles from './index.module.less'
import { Avatar } from 'antd'

function Reminder() {
  const { random_personas, website_logo } = configStore()
  const { addChat } = chatStore()

  return (
    <div className={styles.reminder}>
      {website_logo && <img src={website_logo} className={styles.reminder_logo} />}
      <h2 className={styles.reminder_title}>欢迎来到 {document.title}</h2>
      <p className={styles.reminder_message}>
        与AI智能聊天，畅想无限可能！基于先进的AI引擎，让你的交流更加智能、高效、便捷！
      </p>
      <p className={styles.reminder_message}>
        <span>Shift</span> + <span>Enter</span> 换行。开头输入 <span>/</span> 召唤 Prompt
        AI提示指令预设。
      </p>
      <div className={styles.reminder_question}>
        {random_personas.map((item) => {
          return (
            <div
              key={item.id}
              className={styles.reminder_question_item}
              onClick={() => {
                addChat({
                  persona_id: item.id,
                  name: item?.title
                })
              }}
            >
              {item.avatar && <Avatar shape="square" size={24} src={item.avatar} />}
              <h3>{item.title}</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reminder
