package com.kob.backend.consumer.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private Integer id;
    private Integer botId;  // -1 代表手动操作， 正数代表ai
    private String botCode;
    private Integer sx;
    private Integer sy;
    private List<Integer> steps;

    public Integer getId() {
        return id;
    }

    public Integer getSx() {
        return sx;
    }

    public Integer getSy() {
        return sy;
    }

    public List<Integer> getSteps() {
        return steps;
    }

    public String getStepsString() {
        StringBuilder res = new StringBuilder();
        for (int d : steps) {
            res.append(d);
        }
        return res.toString();
    }
    private boolean checkTailIncreasing(int stepCount) {
        if (stepCount <= 10) return true;
        return stepCount % 4 == 1;
    }
    public List<Cell> getCells() {
        List<Cell> res = new ArrayList<>();
         int[] dx = {-1, 0, 1, 0};
         int[] dy = {0, 1, 0, -1};
         int x = sx, y = sy;
         int stepCount = 0;
         res.add(new Cell(x, y));
         for (int d : steps) {
             x += dx[d];
             y += dy[d];
             res.add(new Cell(x, y));
             if (!checkTailIncreasing( ++ stepCount)) {
                res.remove(0);
             }
         }
         return res;
    }

}
