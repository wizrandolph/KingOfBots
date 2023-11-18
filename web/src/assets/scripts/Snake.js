import { Cell } from './Cell.js';
import { GameObject } from './GameObject.js';

export class Snake extends GameObject {
    constructor(info, gamemap) {
        super();
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];    // cells[0]存放蛇头
        this.next_cell = null   // 下一步的目标位置

        this.speed = 5;   // 蛇的速度每秒钟移动5个格子

        this.direction = -1;   // 蛇的移动方向，-1表示未移动, 0、1、2、3分别表示上右下左
        this.status = "idle";   // 蛇的状态，idle表示静止，move表示正在移动，die表示死亡
        this.dr = [-1, 0, 1, 0];    // 行的变化量
        this.dc = [0, 1, 0, -1];    // 列的变化量

        this.step = 0;  // 蛇的移动步数，即回合数
        this.eps = 1e-2;   // 允许的误差，用于浮点数比较

        this.eye_direction = 0;   // 蛇眼的方向，0、1、2、3分别表示上右下左
        if (this.id === 1) {
            this.eye_direction = 2;     // 右上角的蛇眼向下看
        }

        this.eye_dx = [-1, 1, 1, -1];    // 蛇眼的x坐标变化量
        this.eye_dy = [-1, -1, 1, 1];    // 蛇眼的y坐标变化量
    }

    start() {

    }

    set_direction(d) {
        this.direction = d;
    }

    // 检测蛇尾要不要增加
    check_tail_increasing() {
        if (this.cells.length <= 4) {
            return true;
        }
        if (this.step % 3 === 1) {
            return true;
        }
        return false;
    }

    // 将蛇的状态变为下一步
    next_step() {
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);  // 计算下一步的目标位置
        this.direction = -1;
        this.status = "move";
        this.step ++;

        const k = this.cells.length;
        for (let i = k; i > 0; -- i) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        if (!this.gamemap.check_valid(this.next_cell)) {
            this.status = "die";
        }

        this.eye_direction = d;
    }

    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.eps) {
            this.cells[0] = this.next_cell;
            this.next_cell = null;
            this.status = "idle";

            if (!this.check_tail_increasing()) this.cells.pop();

        } else {
            const move_distance = this.speed * this.time_delta / 1000;
            this.cells[0].x += dx / distance * move_distance;
            this.cells[0].y += dy / distance * move_distance; 

            if (!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1];
                const tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += tail_dx / distance * move_distance;
                tail.y += tail_dy / distance * move_distance;
            }
        }
    }

    update() {
        if (this.status === "move") {
            this.update_move();
        }
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        if (this.status === "die") {
            ctx.fillStyle = "#000000";
        }

        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, 0.8 * L / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        for (let i = 1; i < this.cells.length; ++ i) {
            const a = this.cells[i];
            const b = this.cells[i - 1];
            if (Math.abs(a.x - b.y) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.5 * 0.8) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.5 * 0.8) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < 2; ++ i) {
            let eye_direction = (this.eye_direction + i) % 4;
            const eye_x = this.cells[0].x + this.eye_dx[eye_direction] * 0.15;
            const eye_y = this.cells[0].y + this.eye_dy[eye_direction] * 0.15;
            ctx.beginPath();
            ctx.arc(eye_x * L, eye_y * L, 0.2 * L / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        
    }
}