//网格的个数
let drawSize = 25;

//蛇的位置
let snakePos;

//蛇移动的方向
let direction;

//蛇移动的速度,毫秒为单位
let moveSpeed;

//键盘开关
let keyFlag;

//蛇移动的定时器
let time1;

//得分
let score = 0;

//初始化网格
function initDraw() {
    //网格的行
    for (let i = 0; i < drawSize; i++) {
        //网格的列
        for (let j = 0; j < drawSize; j++) {
            let div = $("<div id='" + i + "-" + j + "' class='item'></div>");
            div.css({
                width: $(".screen").innerWidth() / drawSize + "px",
                height: $(".screen").innerHeight() / drawSize + "px"
            });
            $(".screen").append(div);
        }
    }
}

initDraw();

//画蛇
function drawSnake() {
    //清除上一次的蛇身体
    $(".snake").removeClass("snake");
    //清除上一次的蛇头
    $(".item.head").removeClass("head");
    //重新绘制蛇身体
    $.each(snakePos, function (index, val) {
        $(`#${val.x}-${val.y}`).addClass("snake");
    });
    //重新标记蛇头
    let snakeHeadInfo = snakePos[snakePos.length - 1];
    $(`#${snakeHeadInfo.x}-${snakeHeadInfo.y}`).addClass("head");
}

// drawSnake();

//蛇移动
function snakeMove() {
    time1 = setInterval(function () {
        //新蛇头的信息
        let newHeadInfo = {};
        //旧蛇头的信息
        let oldHeadInfo = snakePos[snakePos.length - 1];
        if (direction === "right") {
            newHeadInfo = {
                x: oldHeadInfo.x,
                y: oldHeadInfo.y + 1
            };
        } else if (direction === "left") {
            newHeadInfo = {
                x: oldHeadInfo.x,
                y: oldHeadInfo.y - 1
            };
        } else if (direction === "top") {
            newHeadInfo = {
                x: oldHeadInfo.x - 1,
                y: oldHeadInfo.y
            };
        } else if (direction === "bottom") {
            newHeadInfo = {
                x: oldHeadInfo.x + 1,
                y: oldHeadInfo.y
            };
        }
        //判断是否吃到食物
        if (!$("#" + newHeadInfo.x + "-" + newHeadInfo.y).hasClass("food")) {
            //删除蛇尾
            snakePos.shift();
        }

        /*
            蛇碰到边界的处理
        */
        //y
        if (newHeadInfo.y > drawSize - 1) {
            newHeadInfo.y = 0;
        } else if (newHeadInfo.y < 0) {
            newHeadInfo.y = drawSize - 1;
        }

        //x
        if (newHeadInfo.x > drawSize - 1) {
            newHeadInfo.x = 0;
        } else if (newHeadInfo.x < 0) {
            newHeadInfo.x = drawSize - 1;
        }
        //蛇头碰到身体
        if ($("#" + newHeadInfo.x + "-" + newHeadInfo.y).hasClass("snake")) {
            stop();
            return;
        }
        //添加蛇头
        snakePos.push(newHeadInfo);
        //重新画蛇
        drawSnake();

        //重新生成食物
        if($("#" + newHeadInfo.x + "-" + newHeadInfo.y).hasClass("food")){
            createFood();
            score++;
            setScore();
        }
        //打开控制方向开关
        keyFlag = true;
    }, moveSpeed)
}

// snakeMove();

//蛇改变移动方向
function changeDirection() {

    $(window).keydown(function (e) {
        if (!keyFlag) {
            return;
        }
        keyFlag = false;
        if (e.keyCode === 37 && (direction === "top" || direction === "bottom")) {
            direction = "left";
        } else if (e.keyCode === 39 && (direction === "top" || direction === "bottom")) {
            direction = "right";
        } else if (e.keyCode === 38 && (direction === "left" || direction === "right")) {
            direction = "top";
        } else if (e.keyCode === 40 && (direction === "left" || direction === "right")) {
            direction = "bottom";
        }
    });

}

// changeDirection();

//生成食物
function createFood() {
    $(".item.food").removeClass("food");
    let x, y;
    do {
        x = getRandom(0, drawSize - 1);
        y = getRandom(0, drawSize - 1);
    } while ($("#"+x+"-"+y).hasClass("snake"))
    $("#" + x + "-" + y).addClass("food");
}

// createFood();

//开始游戏
function start() {

    //蛇的位置
    snakePos = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];

    //蛇移动的方向
    direction = "right";

    //蛇移动的速度,毫秒为单位
    moveSpeed = 100;

    //键盘开关
    keyFlag = true;

    //得分
    score = 0;

    //画蛇
    drawSnake();
    //蛇移动
    snakeMove();
    //生成食物
    createFood();
    //添加蛇改变方向事件
    changeDirection();
    //设置分数
    setScore();
}

//停止游戏
function stop() {
    clearInterval(time1);
    $(window).off("keydown");
    if(score>localStorage.maxScore*1||(!localStorage.maxScore)){
        localStorage.maxScore = score;
    }
    if (confirm("游戏失败，是否重新开始游戏？")) {
        start();
    }
}

//生成随机数
function getRandom(start, end) {

    return Math.round(Math.random() * (end - start) + start);


}


//设置分数
function setScore(){
    if(score%5===0&&score!==0){
        moveSpeed-=30;
        clearInterval(time1);
        snakeMove();
    }
    $(".now span").text(score);
    if(score>localStorage.maxScore*1||(!localStorage.maxScore)){
        $(".max span").text(score);
    }else {
        $(".max span").text(localStorage.maxScore);
    }
}

start();
