const HEARTBEAT = {
  alive: false, // 是否断开连接
  delta: 100, // 心跳频率
  connect(cb = () => {}) {
    if (top === self) {
      // 接收端
      window.addEventListener('message', event => {
        const data = event.data || {}
        if (data.type === 'live') {
          HEARTBEAT.alive = true
        }
      })
      // 检测是否收到
      setInterval(prev => {
        cb(HEARTBEAT.alive)
        HEARTBEAT.alive = false
        // 延时必须比client端晚一点
      }, HEARTBEAT.delta * 1.5)
    } else {
      setInterval(() => {
        // 发送心跳包
        top.postMessage({ type: 'live' }, '*')
      }, HEARTBEAT.delta)
    }
  },
}
