package com.kob.backend.consumer.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.kob.backend.consumer.WebSocketServer;
import com.kob.backend.pojo.Record;
import org.springframework.security.core.parameters.P;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.concurrent.locks.ReentrantLock;

public class Game extends Thread{
    private final Integer rows;
    private final Integer cols;
    private final Integer innerWallCount;

    private final int[][] g;
    private final static int[] dx = {0, 0, 1, -1};
    private final static int[] dy = {1, -1, 0, 0};

    private final Player playerA, playerB;
    private Integer nextStepA = null;
    private Integer nextStepB = null;
    private ReentrantLock lock = new ReentrantLock();
    private String status = "playing";
    private String loser = "";

    public Game(Integer rows, Integer cols, Integer innerWallCount, Integer idA, Integer idB) {
        this.rows = rows;
        this.cols = cols;
        this.innerWallCount = innerWallCount;
        this.g = new int[rows][cols];
        this.playerA = new Player(idA, rows - 2, 1, new ArrayList<>());
        this.playerB = new Player(idB, 1, cols - 2, new ArrayList<>());
    }

    public Player getPlayerA() {
        return playerA;
    }

    public Player getPlayerB() {
        return playerB;
    }

    public void setNextStepA(Integer nextStepA) {
        System.out.println("[Next Step of A]:\t" + nextStepA);
        lock.lock();
        try {
            this.nextStepA = nextStepA;
        } finally {
            lock.unlock();
        }
    }

    public void setNextStepB(Integer nextStepB) {
        System.out.println("[Next Step of B]:\t" + nextStepB);
        lock.lock();
        try {
            this.nextStepB = nextStepB;
        } finally {
            lock.unlock();
        }
    }

    public int[][] getG() {
        return g;
    }

    private String getMapString() {
        StringBuilder res = new StringBuilder();
        for (int i = 0; i < rows; ++ i) {
            for (int j = 0; j < cols; ++ j) {
                res.append(g[i][j]);
            }
        }

        return res.toString();
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

    private boolean nextStep() { // 等待两名玩家的下一步操作

        System.out.println("[Next Step]");
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        for (int i = 0; i < 500; ++ i) {
            try {
                Thread.sleep(100);
                lock.lock();
                try {
                    if (nextStepA != null && nextStepB != null) {
                        playerA.getSteps().add(nextStepA);
                        playerB.getSteps().add(nextStepB);
                        return true;
                    }
                } finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        return false;
    }

    private boolean checkValid(List<Cell> cellsA, List<Cell> cellsB) {
        int n = cellsA.size();
        Cell cell = cellsA.get(n - 1);

        if (g[cell.x][cell.y] == 1) {
            System.out.println("撞到了墙");
            return false;
        }

        for (int i = 0; i < n - 1; ++ i) {
            if (cellsA.get(i).x == cell.x && cellsA.get(i).y == cell.y) {
                System.out.println("撞到了自己的身体");
                return false;
            }
        }

        for (int i = 0; i < n - 1; ++ i) {
            if (cellsB.get(i).x == cell.x && cellsB.get(i).y == cell.y) {
                System.out.println("撞到了对方身体");
                return false;
            }
        }

        return true;
    }



    private void judge() { // 判断两名玩家下一步操作是否合法
        List<Cell> cellsA = playerA.getCells();
        List<Cell> cellsB = playerB.getCells();
        boolean validA = checkValid(cellsA, cellsB);
        boolean validB = checkValid(cellsB, cellsA);
        if (!validB || !validA) {
            status = "finished";
            if (!validA && !validB) loser = "all";
            else if (!validA) loser = "A";
            else if (!validB) loser = "B";
        }
    }

    private void saveToDatabase() {
        Record record = new Record(
                null,
                playerA.getId(),
                playerA.getSx(),
                playerA.getSy(),
                playerB.getId(),
                playerB.getSx(),
                playerB.getSy(),
                playerA.getStepsString(),
                playerB.getStepsString(),
                getMapString(),
                loser,
                new Date()
        );

        WebSocketServer.recordMapper.insert(record);
    }

    private void sendResult() {
        JSONObject resp = new JSONObject();
        resp.put("event", "result");
        resp.put("loser", loser);
        sendAllMessage(resp.toJSONString());

        saveToDatabase();
    }

    private void sendMove() { // 像两个client传递
        lock.lock();
        try {
            JSONObject resp = new JSONObject();
            resp.put("event", "move");
            resp.put("a_direction", nextStepA);
            resp.put("b_direction", nextStepB);
            sendAllMessage(resp.toJSONString());
            nextStepA = nextStepB = null;

        } finally {
            lock.unlock();
        }
    }

    private void sendAllMessage(String message) {
        if (WebSocketServer.users.get(playerA.getId()) != null)
            WebSocketServer.users.get(playerA.getId()).sendMessage(message);
        if (WebSocketServer.users.get(playerB.getId()) != null)
            WebSocketServer.users.get(playerB.getId()).sendMessage(message);
    }
    @Override
    public void run() {
        for (int i = 0; i < 1000; i ++) {
            System.out.println("[Total Steps Count]:\t" + i);
            if (nextStep()) {

                judge();
                if (status.equals("playing")) {
                    sendMove();
                } else if (status.equals("finished")) {
                    sendResult();
                    break;
                }
            } else {
                status = "finished";
                lock.lock();
                try {
                    if (nextStepA == null && nextStepB == null) {
                        loser = "all";
                    } else if (nextStepA == null) {
                        loser = "A";
                    } else if (nextStepB == null) {
                        loser = "B";
                    }
                } finally {
                    lock.unlock();
                }

                sendResult();
                break;
            }
        }
    }
}
