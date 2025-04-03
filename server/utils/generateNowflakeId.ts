/**
 * 生成分布式全局唯一ID（雪花算法）
 * @param {number} nodeId 节点ID，取值范围是0-4095
 * @param {number} epoch 起始时间戳，单位是毫秒，默认值为2021-01-01 00:00:00的时间戳
 * @throws {Error} 如果在同一毫秒内生成的ID数量达到了最大值（4096），则会抛出异常
 * @returns {string} 64位整数字符串
 */
function generateSnowflakeId(nodeId: number, epoch = 1672502400000) {
  let sequence = 0
  let lastTimestamp = 0

  /**
   * 等待下一毫秒
   * @param {number} timestamp 当前时间戳
   * @returns {number} 下一毫秒的时间戳
   */
  const waitNextMillis = (timestamp: number) => {
    let nextTimestamp = Date.now() - epoch
    while (nextTimestamp <= timestamp) {
      nextTimestamp = Date.now() - epoch
    }
    return nextTimestamp
  }

  return function () {
    let timestamp = Date.now() - epoch

    if (timestamp < lastTimestamp) {
      throw new Error('Clock moved backwards!')
    }

    if (timestamp === lastTimestamp) {
      sequence = (sequence + 1) & 4095
      if (sequence === 0) {
        timestamp = waitNextMillis(timestamp)
      }
    } else {
      sequence = 0
    }

    lastTimestamp = timestamp

    const id = ((BigInt(timestamp) << 22n) | (BigInt(nodeId) << 12n) | BigInt(sequence)).toString()
    return id
  }
}

export default generateSnowflakeId
