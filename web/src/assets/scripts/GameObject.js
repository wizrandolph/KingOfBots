const GAME_OBJECTS = [];

export class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        this.time_delta = 0;
        this.has_called_start = false;
    }

    start() {   // 只在第一次渲染时调用

    }

    update() {  // 每一帧都会调用

    }

    on_destroy() {

    }

    destroy() {
        this.on_destroy();
        
        for (let i in GAME_OBJECTS) {
            const obj = GAME_OBJECTS[i];
            if (obj === this) {
                GAME_OBJECTS.splice(i);
                break;
            }
        }
    }

}

let last_timestamp;
const step = timestamp => {
    for (let obj of GAME_OBJECTS) {
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.time_delta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step);
}

requestAnimationFrame(step)