/**
 * timer 定时器
 * @author maybe
 * @doc https://github.com/MaybeQHL/awesome-front/tree/main/timer
 */


const statusEnum = {
    inactive: 'inactive',
    started: 'started',
    paused: 'paused',
    finished: 'finished'
}

/**
 * 创建定时器
 */
function create(opts) {
    const baseConf = {
        desc: '任务',
        /**
         * 触发次数
         */
        count: Infinity,
        /**
         * 触发间隔(ms)
         */
        interval: 0,
        /**
         * 延迟执行(ms)
         */
        delay: 0,
        /**
         * 是否立即执行（一般用于定时任务）
         */
        immediate: false

    }
    // 合并配置
    opts = Object.assign(baseConf, opts);
    console.log(opts)

    let timer;// 定时器实例
    // let exFunc; // 执行函数
    let pending = false;// 异步函数是否执行中
    let finished = false; // 是否执行完成
    let exCount = 0;// 已经触发的次数
    let run = false;// 定时任务是否执行
    let status = statusEnum.inactive;
    let events = {
        finish: () => { },
        exFunc: () => { }
    }

    const setConf = (conf) => {
        // 合并配置
        opts = Object.assign(opts, conf);
        opts.count = Number(opts.count)
        opts.interval = Number(opts.interval)
        opts.delay = Number(opts.delay)
        printLog('已更新配置', opts)
    }
    const setFunction = (func) => {
        console.log('setFunction');
        // exFunc = func;
        // events['exFunc'] = func
        on('exFunc', func)
    }

    const start = () => {
        printLog('任务已开始');

        //  暂停后继续执行定时任务
        if (status == statusEnum.paused) {
            status = statusEnum.started;
            return;
        }
        // 执行状态重复点击无效
        if (status == statusEnum.started) {
            return;
        }
        status = statusEnum.started;

        const startFunc = async () => {
            if (opts.immediate) await task()
            timer = setInterval(task, opts.interval);
        }
        const task = async () => {
            // 暂停中...
            if (status == statusEnum.paused) {
                return;
            }
            if (pending) return; // 如接口请求中定时器逻辑不执行

            // 超过最大次数清除定时器
            if (opts.count != Infinity && exCount >= opts.count) {
                stop();
                emit('finish')
                return;
            }

            // 次数加1
            exCount++;

            printLog(`次数:${exCount} 任务执行中...`)

            try {
                pending = true;
                // 接口验证...
                await emit('exFunc');
                pending = false;
            } catch (error) {
                console.error(error)
                pending = false;
            }

        }

        // 延迟执行
        if (opts.delay > 0) {
            // console.log(`延迟执行${opts.delay}ms`)
            printLog(`延迟执行${opts.delay}ms`)
            setTimeout(() => {
                startFunc();
            }, opts.delay)
            return;
        }

        startFunc();


    }

    const restart = () => {
        // console.log('restart', '任务已重置');
        printLog('任务已重置')
        // 重置次数
        exCount = 0;

        // 重新调用
        start();
    }

    const stop = () => {
        // console.log('stop');
        printLog('任务已停止')
        clearInterval(timer);
        timer = null;
        pending = false;
        status = statusEnum.finished
        exCount = 0;
    }
    const getStatus = () => {
        return {
            exCount,
            status
        };
    }
    const on = (event, func) => {
        console.log(`on:${event}`)
        events[event] = func;
    }
    const emit = (event, ...arg) => {
        events[event]();
    }

    const pause = () => {
        // 如已经完成任务终止暂停逻辑
        if (status == statusEnum.finished) return;
        console.log('任务暂停中....')
        status = statusEnum.paused;
    }

    const printLog = (...args) => { 
        console.log(`[${opts.desc}]:`,...args)
    }


    return {
        start,
        restart,
        setConf,
        setFunction,
        getStatus,
        on,
        pause
    }
}


export default {
    create
}
