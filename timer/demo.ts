import timer from './timer';
const t = timer.create();
t.setConfig({
    interval: 2000
})
t.start();