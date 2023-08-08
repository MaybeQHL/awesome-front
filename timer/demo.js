import timer from './timer.js'
const t = timer.create({
    name: '定时任务demo1'
});
/*{
                count: 2,
            interval: 1000,
            delay: 0,
            immediate: true
}*/


const renderStatus = () => {
    document.getElementById('text').innerText = JSON.stringify(t.getStatus());
}
t.setFunction(async () => {
    renderStatus();
    await new Promise((res) => {
        setTimeout(() => {
            res();
        }, 2000)
    });
    console.log({ msg: '接口请求完成' })

})
// t.setFunction(() => {
//     renderStatus();
//     console.log('普通任务')
// })

t.on('finish', () => {
    document.getElementById('finish').innerText = '所有任务执行完成';
    renderStatus();
})

document.getElementById('start').addEventListener('click', () => {

    // document.getElementById('finish').innerText = '';
    // document.getElementById('text').innerText = '';

    const count = document.getElementById('countInp').value;
    const interval = document.getElementById('intervalInp').value;
    const im = document.getElementById('imInp').value;
    const delay = document.getElementById('delayInp').value;
    t.setConfig({
        count,
        interval,
        immediate: im == 'true',
        delay: delay
    })
    t.start();
})
document.getElementById('restart').addEventListener('click', () => {
    document.getElementById('finish').innerText = '';
    document.getElementById('text').innerText = '';
    t.restart();
})

document.getElementById('pause').addEventListener('click', () => {
    t.pause();
    renderStatus();
})