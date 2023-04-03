const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highscore");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
// getting high score from local storage using getitem method
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High score : ${ highScore}`;

// change food position
const changeFoodPosition = () => {
    // passing a random 0-30 value as food postion
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // cleraing the timer and reloading the pagr on game over
    clearInterval(setIntervalId);
    alert("Game over! press ok to replay.....");
    location.reload();



}

const changeDirection = (e) => {
    // changing velocity values based on key press
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;

    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;

    }
    else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;

    }
}

controls.forEach(key =>{
    // calling changedirectin on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

    // create food postion
    const initGame = () => {
        if (gameOver) return handleGameOver();
        let htmlMarkup = `<div class="food" style = "grid-area: ${foodY} / ${foodX}"></div>`;

        // checking if the snake hit the food
        if (snakeX === foodX && snakeY === foodY) {
            changeFoodPosition();
            // console.log(snakeBody);
            // push the food postion to snake body array
            snakeBody.push([foodX, foodY]);
        
            // increase the score by 1 after snake eats food
            score++;
            // set highscore if score is higher than highscore
            highScore = score >= highScore ? score : highScore;
            // store the highscore in local storage using setitem method
            localStorage.setItem("high-score", highScore);

            // set increased score into html element
            scoreElement.innerText = `score : ${score}`;
            highScoreElement.innerText = `high-score : ${ highScore}`;
           
        }

        for (let i = snakeBody.length - 1; i > 0; i--) {
            // shifting forword the values of the element in the snake body by one
            snakeBody[i] = snakeBody[i - 1];

        }

        // setting first element of snake body to current snake position
        snakeBody[0] = [snakeX, snakeY];

        // update the snake head postion based on current velocity
        snakeX += velocityX;
        snakeY += velocityY;

        // checking if snake's head is out of wall, if yes setting gameover to true
        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
            gameOver = true;


        }

        for (let i = 0; i < snakeBody.length; i++) {

            // adding a div for each part of snake's body
            htmlMarkup += `<div class="head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

            // checking if snake head hit the body, if yes set gameover to true 
            // i have not understand these logic check out later
            if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
                gameOver = true;
            }

        }



        playBoard.innerHTML = htmlMarkup;

    }
    changeFoodPosition();
    setIntervalId = setInterval(initGame, 200);

    // move snake head
    document.addEventListener("keydown", changeDirection);