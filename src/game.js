import Paddle from './paddle.js';
import InputHandler from './input.js';
import Ball from './ball.js';
import { buildLevel, level1, level2 } from './levels.js';

const GAMESTATE = {
    PAUSED: 0,
    RUNNIG: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEW_LEVEL: 4
}

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.gameState = GAMESTATE.MENU;

        this.gameObjects = [];
        this.lives = 3;

        this.levels = [level1, level2];
        this.currentLevel = 0;

        this.ball = new Ball(this);
        this.paddle = new Paddle(this);
        this.bricks = [];
        new InputHandler(this.paddle, this);
    }

    start() {
        if (this.gameState != GAMESTATE.MENU && 
            this.gameState != GAMESTATE.NEW_LEVEL) {
            return;
        }

        this.bricks = buildLevel(this, this.levels[this.currentLevel]);
        this.ball.reset();
        this.gameObjects = [this.ball, this.paddle];
        this.gameState = GAMESTATE.RUNNIG;
    }

    draw(ctx) {
        this.gameObjects.forEach(obj => obj.draw(ctx));

        if (this.gameState == GAMESTATE.PAUSED) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);

        }

        if (this.gameState == GAMESTATE.MENU) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Press space to start", this.gameWidth / 2, this.gameHeight / 2);

        }

        if (this.gameState == GAMESTATE.GAMEOVER) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);

        }
    }

    update(deltaTime) {
        if (this.lives == 0) {
            this.gameState = GAMESTATE.GAMEOVER;
        }

        if (this.gameState == GAMESTATE.PAUSED ||
            this.gameState == GAMESTATE.MENU ||
            this.gameState == GAMESTATE.GAMEOVER) {
            return;
        }

        if (this.bricks.length == 0) {
            this.currentLevel++;
            this.gameState = GAMESTATE.NEW_LEVEL;
            this.start();
        }

        [...this.gameObjects, ...this.bricks].forEach(obj => obj.update(deltaTime));

        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }

    togglePause() {
        if (this.gameState == GAMESTATE.PAUSED) {
            this.gameState = GAMESTATE.RUNNIG;
        } else {
            this.gameState = GAMESTATE.PAUSED;
        }
    }
}