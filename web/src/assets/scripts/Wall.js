import { GameObject } from "./GameObject";

export class Wall extends GameObject {
    constructor(r, c, gamemap) {
        super();
        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#001100";
    }

    update() {
        this.render();
    }

    render() {
        const L = this.gamemap.L;   // 动态获取地图的格子大小，因为地图大小会随着窗口大小改变而改变
        const ctx = this.gamemap.ctx;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L); 
    }
}