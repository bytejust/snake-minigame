let apple_eat = new Audio()
apple_eat.src = "sfx/apple.mp3"

class Snake{
    constructor(x,y,size){
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{x:this.x,y:this.y}]
        this.rotateX = 0
        this.rotateY = 1
    }

    move(){
        let newRect;
        if(this.rotateX == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if(this.rotateX == -1){
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if(this.rotateY == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if(this.rotateY == -1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }

    checkSelfCollision(){
        const head = this.tail[this.tail.length - 1];

        for (let i = 0; i < this.tail.length - 1; i++) {
            if (head.x === this.tail[i].x && head.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    }  
}

class Apple{
    constructor(){
        let isTouching
        while(true){
            isTouching = false
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            for(let i = 0; i < snake.tail.length; i++){
                if(this.x == snake.tail[i].x && this.y == snake.tail[i].y){
                    isTouching = true
                }
            }
            this.color="red"
            this.size=snake.size
            if(!isTouching){
                break
            }
        }
    }
}

let canvas = document.getElementById("canvas")

let snake = new Snake(40,40,40)
let apple = new Apple()

let canvasContext = canvas.getContext('2d')

window.onload = () => {
    show()
}

function show(){
    update()
    draw()
}

function update(){
    canvasContext.clearRect(0,0,canvas.width,canvas.height)
    snake.move()

    if (snake.checkSelfCollision()) {
        gameOver();
        return;
    }

    checkHitWall()
    eatApple()
}

function gameOver() {
    alert("Game Over! Your score: " + (snake.tail.length - 1));

    snake = new Snake(40, 40, 40);
    apple = new Apple();
}

function checkHitWall(){
    let headTail = snake.tail[snake.tail.length - 1]
    if(headTail.x == -snake.size){
        headTail.x = canvas.width - snake.size
    } else if(headTail.x == canvas.width){
        headTail.x = 0
    } else if(headTail.y == -snake.size){
        headTail.y = canvas.height - snake.size
    } else if(headTail.y == canvas.height){
        headTail.y = 0
    }
   /* console.log("head: ", headTail.x,headTail.y, "\nApple: ",apple.x,apple.y) */
}

function eatApple(){
    if(snake.tail[snake.tail.length - 1].x == apple.x && snake.tail[snake.tail.length - 1].y == apple.y){
        apple_eat.play()

        snake.tail[snake.tail.length] = {x:apple.x,y:apple.y}
        apple = new Apple()        
    }
}

function draw() {
    createRect(0, 0, canvas.width, canvas.height, '#222222');
    
    const baseColor = { r: 100, g: 255, b: 100 };
    for (let i = 0; i < snake.tail.length; i++) {
        var div = Math.max((snake.tail.length-i) / 2, 1)

        const r = Math.floor(baseColor.r / div);
        const g = Math.floor(baseColor.g / div);
        const b = Math.floor(baseColor.b / div);
        
        const segmentColor = `rgb(${r}, ${g}, ${b})`;
        createRect(
            snake.tail[i].x + 2.5,
            snake.tail[i].y + 2.5,
            snake.size - 5,
            snake.size - 5,
            segmentColor
        );
    }

    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "#989898";
    canvasContext.fillText("Score: " + (snake.tail.length - 1), 0, 18);
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
}

function createRect(x,y,width,height,color){
    canvasContext.fillStyle = color
    canvasContext.fillRect(x,y,width,height)
}

window.addEventListener("keydown",(e)=>{
    setTimeout(()=>{
        var doShow = false

        if((e.keyCode == 37 || e.keyCode == 65) && snake.rotateX != 1){
            snake.rotateX = -1
            snake.rotateY = 0

            doShow = true
        } else if((e.keyCode == 38 || e.keyCode == 87) && snake.rotateY != 1){
            snake.rotateX = 0
            snake.rotateY = -1

            doShow = true
        } else if((e.keyCode == 39 || e.keyCode == 68) && snake.rotateX != -1){
            snake.rotateX = 1
            snake.rotateY = 0

            doShow = true
        } else if((e.keyCode == 40 || e.keyCode == 83) && snake.rotateY != -1){
            snake.rotateX = 0
            snake.rotateY = 1

            doShow = true
        }
        
        if (doShow){
            show()
        }
    },1)
})