// added my pictures into the cvs, so cvs drawing is commented out.
// added sounds with zzfx, so snd is commented out.
// zzfx(...[,.1,60,.15,.1,.8,1,1.26,,,629,.14,,.6,,.04]);
// zzfx(...[,,862,.26,.35,.27,,1.28,.8,.4,-182,.07,.07,,,,.11]);
const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");

// ctx.lineWidth = 3;

// game variables and constants:
const paddle_width = 100;
const paddle_height = 20;
const paddle_margin_bottom = 50;
const ball_radius = 8;
let life = 3;
let score = 0;
const score_unit = 10;
let level = 1;
const max_level = 3;
let game_over = false;
let leftArrow = false;
let rightArrow = false;
let pause = false;

const paddle = {
    x: cvs.width/2 - paddle_width/2,
    y: cvs.height - paddle_margin_bottom - paddle_height,
    width: paddle_width,
    height: paddle_height,
    dx: 5
}

function drawPaddle() {
    ctx.fillStyle = "#777";
    ctx.fillRect(paddle.x, paddle.y, paddle_width, paddle_height);
    
    ctx.strokeStyle = "ffcd00";
    ctx.strokeRect(paddle.x, paddle.y, paddle_width, paddle_height);
    ctx.drawImage(PADDLE_img, paddle.x, paddle.y);
}

// control keys:
document.addEventListener("keydown", function(event) {
    if (event.keyCode == 37) {
        leftArrow = true;
    } else if(event.keyCode == 39) {
        rightArrow = true;
    }
});
document.addEventListener("keyup", function(event) {
    if (event.keyCode == 37) {
        leftArrow = false;
    } else if(event.keyCode == 39) {
        rightArrow = false;
    }
});
// pause:
document.addEventListener("keydown", function(event) {
    if (event.keyCode == 80) {
        pause = !pause;
        console.log("Pause is " + pause);
    }
});

// move paddle:
function movePaddle() {
    if(rightArrow && paddle.x + paddle_width < cvs.width) {
        paddle.x += paddle.dx;
    } else if(leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

// create a Ball and config:
const ball = {
    x: cvs.width/2,
    y: paddle.y - ball_radius,
    radius: ball_radius,
    speed: 4.4,
    dx: 3 * (Math.random() * 2 - 1), // between 3 and -3
    dy: -3
}

// draw Ball:
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    //ctx.fillStyle = "#111";
    //ctx.fill();
    //ctx.strokeStyle = "#9C9B8D";
    //ctx.stroke();
    ctx.closePath();
}

// move Ball:
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Ball-Paddle collision:
function ballPaddleCollision() {
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y > paddle.height && ball.y > paddle.y) {
        //PADDLE_HIT_snd.play();
        zzfx(...[,,131,.1,.1,.09,,1.3,,-0.1,-3,1.2,2,,,,.3]);
        // Check WHERE on the Paddle the Ball hits, otherwise Paddle would just behave like a WALL, but it's NOT
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        // Normalize the values:
        collidePoint = collidePoint / (paddle.width/2);
        // Calculate the angle of the Ball:
        let angle = collidePoint * Math.PI/3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// Ball-Wall collision:
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = - ball.dx; // bounce from sides
        //WALL_HIT_snd.play();
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = - ball.dy; // bounce from top
    }
    if (ball.y + ball.radius > cvs.height) {
        // ball.dy = - ball.dy;
        
        life -- ;
        zzfx(...[.7,.1,28,.29,.27,.38,1,1.84,-9.6,,,,.01,,1.6,.3]);
        resetBall();
        console.log(life);
    }
}

// Reset the Ball:
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = paddle.y - ball_radius;
    ball.dx = 3 * (Math.random() * 2 - 1); // between 3 and -3
    ball.dy = -3;
}

// create Bricks:
const brick = {
    row: 3,
    column: 8,
    width: 32,
    height: 20,
    offSetLeft: 15,
    offSetTop: 15,
    marginTop: 50,
    // strokeColor: "#999"
}
let bricks = [];
// r = row | c = column
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}
createBricks();

// draw Bricks:
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let br = bricks[r][c];
            // if brick is not broken:
            if(br.status) {
                //ctx.fillStyle = brick.fillColor;
                //ctx.fillRect(br.x, br.y, brick.width, brick.height);
                //ctx.strokeStyle = brick.strokeColor;
                //ctx.strokeRect(br.x, br.y, brick.width, brick.height);
                if(c % 2){
                    ctx.drawImage(BATGHOST_img, br.x, br.y);
                }else if(c % 3){
                    ctx.drawImage(BATGHOST2_img, br.x, br.y);
                }else{
                    ctx.drawImage(BATGHOST3_img, br.x, br.y);
                }
            }
        }
    }
}

// Ball-Brick collision:
function ballBrickCollision() {
        for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let br = bricks[r][c];
            // if brick is not broken:
            if(br.status) {
                if(ball.x + ball.radius > br.x && ball.x - ball.radius < br.x + brick.width &&
                    ball.y + ball.radius > br.y && ball.y - ball.radius < br.y + brick.height) {
                        //BRICK_HIT_snd.play();
                        zzfx(...[,.8,,.1,.2,.3,,3,,,,,1,,,,.6]);
                        ball.speed += 0.03;
                        ball.dy = - ball.dy;
                        br.status = false; // Brick is Broken
                        score += score_unit;
                        console.log("Score is " + score);
                        // if(score == 150) { alert("Nice!") };
                }
            }
        }
    }
}

// show game stats:
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text:
    ctx.fillStyle = "#DDD";
    ctx.font = "24px Arial";
    ctx.fillText(text, textX, textY);
    // draw image:
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// draw stuff:
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
    
    // show stats:
    showGameStats(score, 35, 25, SCORE_img, 5, 5);
    showGameStats(life, 375, 25, LIFE_img, 345, 5);
    showGameStats(level, 200, 25, LEVEL_img, 170 , 5);
}

// GAME OVER:
function gameOver(){
    if(life == 0){
        // zzfx(...[.6,-0.1,76,.1,.1,.2,,,-1.6,65,72,1.12,,,-2.7,.4,.01]); // kurz
        zzfx(...[0.7,.85,9,.1,.2,3,,1.2,1,,500,.1,.3,.5,.8,.1,.8]); // lang
        console.log("Game Over! Deine Score: " + score);
        // alert("Game Over! Deine Score: " + score);
        game_over = true;
        ctx.fillStyle = "#DDD";
        ctx.font = "24px Arial";
        ctx.fillText("G A M E   O V E R", 100, 166);
        ctx.fillText("Score: ", 100, 200);
        ctx.fillText(score, 100, 230);
    }
}

// level up:
function levelUp(){
    let isLevelDone = true;

    // check if all the bricks are broken:
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }

    if(isLevelDone){
        //WIN_snd.play();
        if(level == max_level){
            zzfx(...[,.85,9,.1,.2,3,,1.2,1,,500,.1,.3,.5,.8,.1,.8]); // lang
            console.log("Game Over! Deine Score: " + score);
            // alert("Game Over! Deine Score: " + score);
            game_over = true;
            ctx.fillStyle = "#DDD";
            ctx.font = "24px Arial";
            ctx.fillText("WELL   DONE", 133, 166);
            return;
        }
        // getting harder now:
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        level++;
        // gain ONE UP
        life += 1;
        zzfx(...[,.2,8,.8,.08,.8,,.36,.4,,,,.24,,2.4,,.8]);
    }
}

// update Game (60fps from the Loop)
function update() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    levelUp();
    gameOver();
    // if(life == 0) { alert("Not Nice!") };
}

// Game Loop:
function loop() {
    ctx.drawImage(BG_img, 0, 0);
    ctx.drawImage(PLAYER_img, paddle.x + 40, paddle.y + 16);
    ctx.drawImage(BAT_img, ball.x - 12, ball.y -12);

    draw(); // Objects visible

    if(!game_over) {
        requestAnimationFrame(loop);
    }
    if(!pause) {
        update(); // Objects in motion
    } else {
        ctx.shadowColor = '#A89';
        ctx.shadowBlur = 6;
        ctx.fillStyle = "#DDD";
        ctx.font = "24px Arial";
        ctx.fillText("P A U S E D", 133, 166);
    }
        ctx.shadowBlur = 0;
}
loop();

document.getElementById("Reload").addEventListener('click',function () {
    window.location.reload();
});
