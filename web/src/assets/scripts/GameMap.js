import { GameObject } from "./GameObject.js";
import { Wall } from "./Wall.js";

export class GameMap extends GameObject {
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;

        this.L = 0;
        this.rows = 13;
        this.cols = 13;

        this.inner_walls_count = 20;
        this.walls = [];
    }

    check_connectivity(g, sx, sy, tx, ty) {
        if (sx == tx && sy == ty) {
            return true;
        }
        g[sx][sy] = true;

        const dx = [0, 0, 1, -1];
        const dy = [1, -1, 0, 0];

        for (let i = 0; i < 4; ++ i) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty)) {
                return true;
            }
        }

        return false;

    }

    create_walls() {
        const g = [];   // 用来标识每个位置是否为墙体

        // 初始化g，声明为全false的二维数组
        for (let r = 0; r < this.rows; ++ r) {
            g[r] = [];  // 声明为二维数组
            for (let c = 0; c < this.cols; ++ c) {
                g[r][c] = false;
            }
        }

        // 创建四周墙体
        for (let r = 0; r < this.rows; ++ r) {
            g[r][0] = g[r][this.cols - 1] = true;   // 左右两边
        }
        for (let c = 0; c < this.cols; ++ c) {
            g[0][c] = g[this.rows - 1][c] = true;   // 上下两边
        }

        // 创建随机墙体
        for (let i = 0; i < this.inner_walls_count; i += 2) {
            let j = 1000;
            while (j --) {
                let r = parseInt(Math.random() * (this.rows - 2)) + 1; // 随机行
                let c = parseInt(Math.random() * (this.cols - 2)) + 1; // 随机列
                if (g[r][c]) continue;  // 如果已经是墙体，重新随机
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue; // 如果是出生位置，重新随机
                g[r][c] = g[c][r] = true;   // 对称地生成墙体
                break;
            }
        }

        // 检查是否连通
        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false; // 如果不连通，重新生成

        // 生成迷宫
        for (let r = 0; r < this.rows; ++ r) {
            for (let c = 0; c < this.cols; ++ c) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;

    }

    start() {
        for (let i = 0; i < 100000; ++ i) {
            this.create_walls();
            if (this.check_connectivity()) break;
        }
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));   // 保证地图不会超出父元素
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_size();
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