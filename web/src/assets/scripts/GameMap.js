import { GameObject } from "./GameObject.js";
import { Snake } from "./Snake.js";
import { Wall } from "./Wall.js";

export class GameMap extends GameObject {
    constructor(ctx, parent, store) {
        super();

        this.ctx = ctx;
        this.parent = parent;

        this.L = 0;
        this.rows = 13;
        this.cols = 14;
        this.store = store;

        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#ff0000", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#0000ff", r: 1, c: this.cols - 2}, this)
        ];
    }

    create_walls() {
        const g = this.store.state.pk.gamemap;

        // 生成迷宫
        for (let r = 0; r < this.rows; ++ r) {
            for (let c = 0; c < this.cols; ++ c) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
    }

    add_listening_events() {
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === "w") {snake0.set_direction(0);}
            if (e.key === "d") {snake0.set_direction(1);}
            if (e.key === "s") {snake0.set_direction(2);}
            if (e.key === "a") {snake0.set_direction(3);}
            if (e.key === "ArrowUp") {snake1.set_direction(0);}
            if (e.key === "ArrowRight") {snake1.set_direction(1);}
            if (e.key === "ArrowDown") {snake1.set_direction(2);}
            if (e.key === "ArrowLeft") {snake1.set_direction(3);}
        });
    }

    start() {
        for (let i = 0; i < 10000; ++ i) {
            if (this.create_walls()) break;
        }

        this.add_listening_events();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));   // 保证地图不会超出父元素
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    // 判断两个蛇是否都准备好下一回合
    check_ready() {
        for (let snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    // 让两条蛇进入下一回合
    next_step() {
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    // 检查某个位置是否合法
    check_valid(cell) {

        // 检查是否撞墙
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) return false;
        }

        // 检查是否撞蛇身体
        for (const snake of this.snakes) {
            let k = snake.cells.length;
            // 蛇尾不增长时
            if (!snake.check_tail_increasing()) {
                k -- ;
            }
            for (let i = 0; i < k; ++ i) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) return false;
            }
        }

        return true;
    }

    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {
        const color_even = "#f0f0f0";
        const color_odd = "#ffffff";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c++ ) {
                if (r + c & 1) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L); // canvas的坐标轴是左上角为原点，向右为x轴正方向，向下为y轴正方向
            }
        
        }
    }
}