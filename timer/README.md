使用

```
const t = timer.create()

 t.setConf({
    count:5,
    interval:1000,
    immediate: false,
    delay: 0
});

 t.setFunction(async() => {
    // 模拟接口延迟
    return await new Promise((res) => {
            setTimeout(() => {
              res();
      }, 1000)
    })
 })
t.on('finish', () => {
 // 所有任务执行完成
})
t.start(); // 开始定时任务
// t.restart(); // 重置定时任务
// t.stop();// 停止定时任务
```