package com.kob.backend.consumer.utils;

import java.util.Random;

public class Game {
    final private Integer rows;
    final private Integer cols;
    final private Integer innerWallCount;

    final private int[][] g;
    final private static int[] dx = {0, 0, 1, -1};
    final private static int[] dy = {1, -1, 0, 0};

    public Game(Integer rows, Integer cols, Integer innerWallCount) {
        this.rows = rows;
        this.cols = cols;
        this.innerWallCount = innerWallCount;
        this.g = new int[rows][cols];
    }

    public int[][] getG() {
        return g;
    }

    boolean checkConnectivity(int sx, int sy, int tx, int ty) {
        if (sx == tx && sy == ty) {
            return true;
        }
        g[sx][sy] = 1;

        for (int i = 0; i < 4; ++ i) {
            int x = sx + dx[i];
            int y = sy + dy[i];
            if (g[x][y] == 0 && x >= 0 && x < rows && y >= 0 && y < cols) {
                if (checkConnectivity(x, y, tx, ty)) {
                    g[sx][sy] = 0;
                    return true;
                }
            }
        }

        g[sx][sy] = 0;
        return false;
    }

    private boolean draw() {

        for (int i = 0; i < rows; ++ i) {
            for (int j = 0; j < cols; ++ j) {
                g[i][j] = 0;
            }
        }

        for (int r = 0; r < rows; ++ r) {
            g[r][0] = g[r][cols - 1] = 1;
        }
        for (int c = 0; c < cols; ++ c) {
            g[0][c] = g[rows - 1][c] = 1;
        }

        Random random = new Random();
        for (int i = 0; i < this.innerWallCount; i += 2) {
            for (int j = 0; j < 1000; ++ j) {
                int r = random.nextInt(rows);
                int c = random.nextInt(cols);
                if (g[r][c] == 1 || g[rows - 1 - r][cols - 1 - c] == 1)
                    continue;
                if (r == rows - 2 && c == 1 || r == 1 && c == cols - 2)
                    continue;

                g[r][c] = g[rows - 1 - r][cols - 1 - c] = 1;
                break;
            }
        }

        return checkConnectivity(rows - 2, 1, 1, cols - 2);
    }

    public void createMap() {
        for (int i = 0; i < 1000; ++ i) {
            if (draw()) break;
        }
    }
}
