/**
 * @author : Nyaundi Brian
 */

/*Globals */
var context,
    contextW ,  //Width of drawing area
    contextH ,  //height of ...
    snakeHead,  //snake leg .. haha
    snakeFood,  //snake pizza
    score,
    gameOver,   //boolean

    scorePane,  //dom document for score display
    statePane,  //dom document for instruction

    gameTimer,  //frame rate timer
    paused;     //boolean

/*Snake object*/
var snake = {
    snakelength: null,
    DIRECTION: null,
    sizeY: null, sizeX: null,
    dead: null,
    size: null,
    Parts: null,
    start: function () {
        gamePlay.startSnake();
    },
    init: function () {
        this.snakelength = 3;
        this.DIRECTION = 'RIGHT';
        this.sizeY = 10;
        this.sizeX = 5;
        this.dead = false;
        this.size = 5;
        this.Parts = [];
        snakeHead = new Point(0, 50);
        this.Parts.push(snakeHead);
        //console.log('game started');
    },
    stop: function () {//todo: remove this
        gamePlay.stopSnake();
    },
    grow: function () {
        this.size++;
    },
    move: function (DIRECTION) {
        //console.log('snake moving '+DIRECTION);
        switch (DIRECTION) {
            case 'DOWN': //down
                this.moveDown();
                break;
            case 'RIGHT': //right
                this.moveRight();
                break;
            case 'UP': //up
                this.moveUp();
                break;
            case 'LEFT'://left
                this.moveLeft();
                break;
        }

    },
    //Snake movements
    moveDown: function () {
        snakeHead = new Point(snakeHead.x, snakeHead.y + snake.sizeX);
        this.Parts.push(snakeHead);
    },
    moveUp: function () {
        snakeHead = new Point(snakeHead.x, snakeHead.y - snake.sizeX);
        this.Parts.push(snakeHead);
    },
    moveLeft: function () {
        snakeHead = new Point(snakeHead.x - snake.sizeY, snakeHead.y);
        this.Parts.push(snakeHead);

    },
    moveRight: function () {
        snakeHead = new Point(snakeHead.x + snake.sizeY, snakeHead.y);
        this.Parts.push(snakeHead);

    },
    headInParts: function () {
        return this.pointInParts(snakeHead, this.Parts.slice(0, this.Parts.length - 2));
    },
    validate: function () {
        //validates if snake is dead or not
        if (
            snakeHead.x < contextW &&
            snakeHead.x >= 0 &&
            snakeHead.y >= 0 &&
            snakeHead.y < contextH && !this.headInParts()
            ) {
            //game still valid
        } else {
            gameOver = true;
            return null;
            //gamePlay.stop();
        }

        if (this.Parts.length > this.size) {
            //console.log("Tall snake");
            this.Parts.shift();
        }
    },
    foodInParts: function (fd) {
        return this.pointInParts(fd, this.Parts);
    },
    pointInParts: function (point, parts) {
        var toReturn = false;

        parts.forEach(function (pnt) {
            if (pnt.x == point.x && pnt.y == point.y) {
                toReturn = true;
                return null;
            }
        });
        return toReturn;
    },
    eatFood: function () {
        //if(snakeHead.x==snakeFood.x && snakeHead.y==snakeFood.y){//equality sign works too
        //context.clearRect(snakeFood.x,snakeFood.y,snake.sizeY,snake.sizeX);
        if (this.foodInParts(snakeFood)) {
            context.fillStyle = '#000000';//todo:lots of redundant code. should fix
            context.fillRect(snakeFood.x, snakeFood.y, this.sizeY, this.sizeX);
            snakeFood = null;
            this.grow();
            score = score + 8;
            gamePlay.displayScore();
            gamePlay.createFood();
        }

    },
    /**
     *
     */
    drawUpdate: function () {
        //fill clear rect in last snake part then draw rect in snake front
        context.clearRect(0, 0, contextW, contextH);
        context.fillStyle = "#000000";
        context.fillRect(this.Parts[i].x, this.Parts[i].y, this.sizeY, this.sizeX);


    },
    draw: function () {
        if (gameOver)return;
        //console.log('drawing snake');
        context.clearRect(0, 0, contextW, contextH);

        for (var i = 0; i < this.Parts.length; i++) {
            context.fillStyle = "#000000";
            context.fillRect(this.Parts[i].x, this.Parts[i].y, this.sizeY, this.sizeX);
            context.fillStyle = "#26f421";
            context.fillRect(snakeFood.x, snakeFood.y, this.sizeY, this.sizeX); //draw snake food
        }

    }

};

/*Game play manager*/
var gamePlay = {
    startSnake: function () {
        gameTimer = setInterval('gamePlay.gameOn()', 100);
        paused = false;
        //setTimeout("snake.draw",1000);
    },
    start: function () {//its like init

        context = getCanvsCont();
        contextW = context.canvas.width;
        contextH = context.canvas.height;

        scorePane = document.getElementById('score');
        statePane = document.getElementById('state');
        gamePlay.reset();
        snake.init();
        gamePlay.createFood();
        gamePlay.startSnake();

    },
    restart: function () {
        gamePlay.reset();
        snake.init();
        gamePlay.startSnake();
    },
    reset: function () {
        score = 0;
        gameOver = false;
        paused = false;
        statePane.innerHTML = 'YOUR SCORE: ';
        gamePlay.displayScore();
    },
    stopSnake: function () {
        clearInterval(gameTimer);
        paused = true;
    },
    gameOn: function () {
        if (gameOver) {
            snake.stop();
            statePane.innerHTML = 'GAME OVER!!.. press <kbd>Tab</kbd>'
        }
        snake.move(snake.DIRECTION);
        snake.draw();
        snake.eatFood();
        snake.validate();

    },
    createFood: function () {//creates a random point within the canvas
        var food = null;
        do {
            food = new Point(
                    (Math.ceil(Math.random() * 30) * 10) - snake.sizeY,
                    (Math.ceil(Math.random() * 30) * 5 ) - snake.sizeX
            );
            //console.log('FOOD: '+food);
        } while (snake.foodInParts(food));//validate snakeFood to not be in parts
        snakeFood = food;
    },
    displayScore: function () {
        scorePane.innerHTML = score;
    }
};

/**
 *
 * @param x
 * @param y
 * @constructor for a snake part
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}
window.onkeydown = function (e) {
    e.preventDefault();
    if (paused && e.keyCode != 32) {
        //ignore key events when game is paused
        return;
    }
    switch (e.keyCode) {
        case 37:
            if (snake.DIRECTION != 'RIGHT' && snake.DIRECTION != 'LEFT') {
                snake.DIRECTION = 'LEFT';
            }
            break;
        case 38:
            if (snake.DIRECTION != 'DOWN' && snake.DIRECTION != 'UP') {
                snake.DIRECTION = 'UP';
            }
            break;
        case 39:
            if (snake.DIRECTION != 'LEFT' && snake.DIRECTION != 'RIGHT') {
                snake.DIRECTION = 'RIGHT';
            }
            break;
        case 40:
            if (snake.DIRECTION != 'UP' && snake.DIRECTION != 'DOWN') {
                snake.DIRECTION = 'DOWN';
            }
            break;
        case 32://spacebar pause or restarts the game
            if (gameOver) {
                gamePlay.restart();
            } else {
                if (paused) {
                    snake.start();
                } else {
                    snake.stop();
                }
            }
            break;//really? need for this??
    }
};

function getCanvsCont() {
    canvas = document.getElementById("canvs");
    return canvas.getContext("2d");

}
window.onload = gamePlay.start;