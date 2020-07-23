import { streamA, streamB } from './save-image.cron';
class Alarmer {
    alarmDate: Date;
    timeout: number;
    constructor() {
        streamA();
        streamB();
    }

    tick() {

        this.alarmDate = this.getAlarmDate();
        this.timeout = new Date().getTime() - this.getAlarmDate().getTime();
        setTimeout(() => {
                streamA();
                streamB();
                a.tick();
            },
            this.timeout
        )

    }

    getAlarmDate() {
        const currentDate = new Date();
        return new Date(currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            currentDate.getHours() + 1,
            1
        )
    }
}

const a = new Alarmer();
a.tick();




