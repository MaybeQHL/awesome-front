## timer 定时任务处理器

在线demo 
https://maybeqhl.github.io/awesome-front/timer/demo.html

使用
```
const t = timer.create()

 t.setConfig({
    count:5,
    interval:1000,
    immediate: false,
    delay: 0
});

// 同步使用
t.setFunction(()=>{

})
// 异步使用
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
t.start(); // 开始/继续定时任务
// t.restart(); // 重置定时任务
// t.stop();// 停止定时任务
// t.pause();// 暂停定时任务
```
