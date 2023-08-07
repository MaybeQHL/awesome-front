
export enum statusEnum {
    inactive = 'inactive',
    started = 'started',
    paused = 'paused',
    finished = 'finished'
}

export type Config = {
    name: string,
    /**
     * 触发次数
     */
    count: number,
    /**
     * 触发间隔(ms)
     */
    interval: number,
    /**
     * 延迟执行(ms)
     */
    delay: number,
    /**
     * 是否立即执行（一般用于定时任务）
     */
    immediate: boolean
}

export type statusResult = {
    /**
     * 任务执行次数
     */
    exCount: number,
    /**
     * 当前活动任务状态值
     */
    status: statusEnum
}

export function create(): {
    start: () => any,
    restart: () => any,
    setConfig: (conf: Config) => any,
    setFunction: (func: Function) => any,
    getStatus: () => statusResult,
    on: (event: string, func: Function) => any,
    pause: () => any
}

export default {
    create
}