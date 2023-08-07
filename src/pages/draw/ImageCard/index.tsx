import { Image, Tooltip } from 'antd'
import styles from './index.module.less'
import { DrawRecord } from '@/types'
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

function ImageCard(props: DrawRecord & {
  type: string,
  onClickOperate: (id: number | string, status: number) => void
}) {
  return (
    <div className={styles.imageCard}>
      <Image className={styles.imageCard_image} src={props.images?.[0]} />
      {
        props.type === 'me' && (
          <div className={styles.imageCard_operate}>
            {
              props.status === 1 ? (
                <Tooltip placement="top" title="公开">
                  <p onClick={() => {
                    props.onClickOperate?.(props.id, 4)
                  }}
                  ><EyeOutlined />
                  </p>
                </Tooltip>
              ) : props.status === 4 ? (
                <Tooltip placement="top" title="私有">
                  <p onClick={() => {
                    props.onClickOperate?.(props.id, 1)
                  }}
                  ><EyeInvisibleOutlined />
                  </p>
                </Tooltip>
              ) : <span />
            }
            <Tooltip placement="top" title="删除">
              <p onClick={() => {
                props.onClickOperate?.(props.id, 0)
              }}
              ><DeleteOutlined />
              </p>
            </Tooltip>
          </div>
        )
      }
      <div className={styles.imageCard_message}>
        <div>
          <span>{props.create_time}</span>
        </div>
        <Tooltip placement="top" title={props.prompt}>
          <p>{props.prompt}</p>
        </Tooltip>
      </div>
    </div>
  )
}

export default ImageCard
