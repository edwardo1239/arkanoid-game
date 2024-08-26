
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const $sprite = document.querySelector("#sprite")
const $bricks = document.querySelector("#bricks")
canvas.width = 448;
canvas.height = 400;

// Variables de la pelota
const ballRadius = 3;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 3;
let dy = -3;

//Variables de la paleta
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.width - paddleWidth - 10;

let rightPressed = false;
let leftPressed = false;

const PADDLE_SENSITIVITY = 8;

//Variable de los ladrillos
const brickRowCount = 6;
const brickColummnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
}

//se inicializa los bricks
for ( let c = 0; c < brickColummnCount; c++){
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++){
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        const random = Math.floor(Math.random() * 8);
        bricks[c][r] = { x:brickX, y:brickY, status:BRICK_STATUS.ACTIVE, color:random }
        
    }
}

function drawball() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.drawImage(
        $sprite,
        29,
        174,
        paddleWidth,
        paddleHeight,
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight
    )

}

function drawBricks() {
    for ( let c = 0; c < brickColummnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            const currentBrick = bricks[c][r];
            if(currentBrick.status === BRICK_STATUS.DESTROYED){
                continue
            } 

            const clipX = currentBrick.color * 32
            ctx.drawImage(
                $bricks,
                clipX,
                0,
                brickWidth, // 31
                brickHeight, // 14
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            )
        }
    }
}

function collisionDetection() {
    for ( let c = 0; c < brickColummnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            const currentBrick = bricks[c][r];
            if(currentBrick.status === BRICK_STATUS.DESTROYED){
                continue
            } 

            const isBallSameXAsBrick  = x > currentBrick.x && x < currentBrick.x + brickWidth;
            const isBallSameYAsBrick = y > currentBrick.y && y < currentBrick.y + brickHeight;

            if(isBallSameXAsBrick  && isBallSameYAsBrick) {
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }
}

function ballMovement() {
    //la apred derecha
    if (
        x + dx > canvas.width - ballRadius ||
        x + dx < ballRadius
    ) {
        dx = -dx
    }
    //rebote en la parte superior
    if (
        y + dy < ballRadius
    ) {
        dy = -dy
    }

    const isBallSameX = x > paddleX && x < paddleX + paddleWidth;
    const isBallSameY = y + dy > paddleY

    if(isBallSameX && isBallSameY){
        dy = -dy
    }else if (y + dy > canvas.height - ballRadius) {
        console.log("game Over");
        document.location.reload();
    }
    x += dx;
    y += dy;
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = true
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = true
        }
    }

    function keyUpHandler(event) {
        const { key } = event
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = false
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = false
        }
    }
}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSITIVITY
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSITIVITY
    }
}

function draw() {
    cleanCanvas();
    //dibujar elementos
    drawball();
    drawPaddle();
    drawBricks();

    //drawScore

    //colisiones y movimiento
    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}

initEvents();
draw()
