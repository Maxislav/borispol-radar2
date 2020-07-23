"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const save_image_cron_1 = require("./save-image.cron");
class Alarmer {
    constructor() {
        save_image_cron_1.streamA();
        save_image_cron_1.streamB();
    }
    tick() {
        this.alarmDate = this.getAlarmDate();
        this.timeout = this.getAlarmDate().getTime() - new Date().getTime();
        setTimeout(() => {
            save_image_cron_1.streamA();
            save_image_cron_1.streamB();
            a.tick();
        }, this.timeout);
    }
    getAlarmDate() {
        const currentDate = new Date();
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours() + 1, 1);
    }
}
const a = new Alarmer();
a.tick();
//# sourceMappingURL=cron.js.map