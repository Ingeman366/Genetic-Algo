var myTimer;
var defaultRotatValue = 30;
var defaultSpeedIncriment = 0.1;
var defaultSpeedStart = 0;
var timeCount = 0;
var car = { x: 60, y: 70};
//var car = { x: 30, y: 70};
var lineLength = 30;
var angle = 0;
var c ;
var ctx;
var Bane = new Image();
var aktuelColor = "black";
var currentCarIndex = 0;

//----------------------------------------
var speed = defaultSpeedStart;
var distantFront;
var distantLeft;
var distantRight;

function startAll()
{
    document.body.addEventListener('keydown', doKeyDown);
    hentBilledeAfBanen();
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");    
}

function hentBilledeAfBanen() {
    Bane.src = 'bane.png';
    Bane.onload = function ()
    {
       // myTimer = setInterval(Timer, 20);
        drawEveryThing();
    }
}
/*
function Timer() {
    population.forEach((individual) => {
        if (!individual.car.isCrashed) {
            forward(individual.car);
            rotateCar(individual.car, calculateRotation(individual.chromosome));
            speedChange(individual.car, calculateSpeedChange(individual.chromosome));
            checkCrash(individual.car);
        }
    });

    drawEveryThing();

    // Check if all cars are crashed
    if (population.every(individual => individual.car.isCrashed)) {
        clearInterval(myTimer);
        GA_CreateNewPopulation();
    }
} */


function Timer() {
    
    forward();

    drawEveryThing();
    
    timeCount++;

    //----------Genetic Algorithm is Driving the car har--------------
    GA_DriveCar_One_Time_Step();
}
/*
function newGame() {
    document.getElementById('startNewGameButton').style.visibility = 'hidden';    
    car = { x: 130, y: 65 };
    timeCount = 0;
    angle = 0;
    speed = defaultSpeedStart;
    clearInterval(myTimer);
    myTimer = setInterval(Timer, 20);

    //----------Genetic Algorithm Create New Population her---------------

    GA_CreateNewPopulation();
} */

function newGame() {
    
    if (currentCarIndex >= population.length -1){

        GA_CreateNewPopulation();
        currentCarIndex = 0;
    } else {

        currentCarIndex++;
    }
    
    resetGameState();
    
}

function resetGameState() {
    car = { x: 60, y: 70 };
    //car = { x: 30, y: 70 };
    timeCount = 0;
    angle = 0;
    speed = defaultSpeedStart;
    clearInterval(myTimer);
    myTimer = setInterval(Timer, 1);
    document.getElementById('startNewGameButton').style.visibility = 'hidden';
}


function getRandomNumber(decimalPlaces, size) {
    return ((Math.random() - 0.5) * size).toFixed(decimalPlaces);
    //getRandomNumber(2,1); giver -0.50 til 0.50
    //getRandomNumber(2,10); giver -5.00 til 5.00
    //getRandomNumber(0,100); giver -50 til 50
}
function SpeedUp() {
    speed += defaultSpeedIncriment;
}
function SpeedDown() {
    speed -= defaultSpeedIncriment;
}
function doKeyDown(e) {
    if (e.keyCode == 87) //W = forward
    {
        SpeedUp();
    }
    if (e.keyCode == 83) //S = backward
    {
        SpeedDown();
    }
    if (e.keyCode == 65) //A = left
    {
        rotateCar(-defaultRotatValue);
    }
    if (e.keyCode == 68) //D = right
    {
        rotateCar(defaultRotatValue);
    }
}
function forward() {
    

    var nyPos = lineToAngle(ctx, car.x, car.y, speed, angle);
    car.x = nyPos.x;
    car.y = nyPos.y;
}
function backward() {
    var nyPos = lineToAngle(ctx, car.x, car.y, -1, angle);
    car.x = nyPos.x;
    car.y = nyPos.y;
}
//Genetic Algorithm output function
function rotateCar(leftRigth) {
    angle = angle + leftRigth/10;
    if (angle > 360)
        angle = 0;
}  
//Genetic Algorithm output function
function speedChange(speedIn) {
    speed += speedIn/1000 ;
}
function lineToAngle(ctx, x1, y1, length, angle) {
    angle *= Math.PI / 180;

    var x2 = x1 + length * Math.cos(angle),
        y2 = y1 + length * Math.sin(angle);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    return { x: x2, y: y2 };
}
//Used for drawing the distance, so that the
//start point is not center but further in front, so that
//the check for out of the lane is not checking this line also.
function justInfrontfarwardDistance() {
    var length = 10;
    var x2, y2;

    var curentAngel = (Math.PI / 180) * angle;
    x2 = car.x + length * Math.cos(curentAngel);
    y2 = car.y + length * Math.sin(curentAngel);

    return { x: x2, y: y2 };
}

function farwardDistance() {
    var length = 5;
    var x2, y2;
    for (var i = 0; i < 200; i++) {
        var curentAngel = (Math.PI / 180) * angle;
        x2 = car.x + length * Math.cos(curentAngel);
        y2 = car.y + length * Math.sin(curentAngel);
        
        if (!isFinite(x2) || !isFinite(y2)) {
    
            break;
        }

        var imgData = ctx.getImageData(x2, y2, 10, 10);
        var red = imgData.data[0];
        var green = imgData.data[1];
        var blue = imgData.data[2];
        var alpha = imgData.data[3];
        length += 5;
        //alert(red + " " + green + " " + blue + " " + alpha);
        if (green < 200) {
            break;
        }
    }
    return { x: x2, y: y2 };
}

function leftDistance() {
    var length = 5;
    var x2, y2;
    for (var i = 0; i < 200; i++) {

        var curentAngel = (Math.PI / 180) * angle - 70;

        x2 = car.x + length * Math.cos(curentAngel);
        y2 = car.y + length * Math.sin(curentAngel);

        var imgData = ctx.getImageData(x2, y2, 10, 10);
        var red = imgData.data[0];
        var green = imgData.data[1];
        var blue = imgData.data[2];
        var alpha = imgData.data[3];
        length += 5;
        //alert(red + " " + green + " " + blue + " " + alpha);
        if (green < 200) {
            break;
        }
    }
    return { x: x2, y: y2 };
}
function rightDistance() {
    var length = 5;
    var x2, y2;
    for (var i = 0; i < 200; i++) {

        var curentAngel = (Math.PI / 180) * angle + 70;

        x2 = car.x + length * Math.cos(curentAngel);
        y2 = car.y + length * Math.sin(curentAngel);

        var imgData = ctx.getImageData(x2, y2, 10, 10);
        var red = imgData.data[0];
        var green = imgData.data[1];
        var blue = imgData.data[2];
        var alpha = imgData.data[3];
        length += 5;
        //alert(red + " " + green + " " + blue + " " + alpha);
        if (green < 200) {
            break;
        }
    }
    return { x: x2, y: y2 };
}
function dist(x1, y1, x2, y2) {
    var deltaX = diff(x1, x2);
    var deltaY = diff(y1, y2);
    var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    return (dist);
};
function diff(num1, num2) {
    if (num1 > num2) {
        return (num1 - num2);
    } else {
        return (num2 - num1);
    }
};
function drawEveryThing() {
    // ctx.clearRect(0, 0, 800, 400);
    ctx.drawImage(Bane, 0, 0, 800, 400);

    //Calculating the first Corner
    var angle1 = angle + 240;
    if (angle1 > 360)
        angle1 = angle - 120;
    var newPos1 = lineToAngle(ctx, car.x, car.y, lineLength - 15, angle1);

    //Calculating the second Corner
    var angle2 = angle;
    var newPos2 = lineToAngle(ctx, car.x, car.y, lineLength - 10, angle2);

    //Calculating the third Corner
    var angle3 = angle + 120;
    if (angle3 > 360)
        angle3 = angle - 240;
    var newPos3 = lineToAngle(ctx, car.x, car.y, lineLength - 15, angle3);

    //Drawing the distance front
    var distFarward = farwardDistance();
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "lightBlue";
    var justInFront = justInfrontfarwardDistance();
    ctx.moveTo(justInFront.x, justInFront.y);
    ctx.lineTo(distFarward.x, distFarward.y);
    ctx.stroke();
    ctx.strokeStyle = aktuelColor;

    //Drawing the distance left
    var distLeft = leftDistance();
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "lightGreen";
    ctx.moveTo(justInFront.x, justInFront.y);
    ctx.lineTo(distLeft.x, distLeft.y);
    ctx.stroke();
    ctx.strokeStyle = aktuelColor;


    //Drawing the distance right
    var distRight = rightDistance();
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "red";
    ctx.moveTo(justInFront.x, justInFront.y);
    ctx.lineTo(distRight.x, distRight.y);
    ctx.stroke();
    ctx.strokeStyle = aktuelColor;


    //Drawing the Car
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = aktuelColor;
    ctx.moveTo(newPos1.x, newPos1.y);
    ctx.lineTo(newPos2.x, newPos2.y);
    ctx.lineTo(newPos3.x, newPos3.y);
    ctx.lineTo(newPos1.x, newPos1.y);
    ctx.stroke();

    // Draw Text Draw Text Draw Text Draw Text Draw Text Draw Text Draw Text
    ctx.strokeStyle = "black";
    ctx.font = "15px Arial";
    var xpos = 350;
    var ypos = 60;
    //ctx.fillText("Left='a' Right='d' Fast='w' Slow='s'", xpos - 40, 20);
    ctx.fillText("", xpos, 40);

    distantFront = dist(distFarward.x, distFarward.y, justInFront.x, justInFront.y);
    distantLeft = dist(distLeft.x, distLeft.y, justInFront.x, justInFront.y);
    distantRight = dist(distRight.x, distRight.y, justInFront.x, justInFront.y);
    ctx.fillText("Car x = " + car.x.toFixed(0) + " Car y = " + car.y.toFixed(0), xpos, ypos-40 );
    ctx.fillText("Distance front = " + Math.ceil(distantFront), xpos, ypos - 25);
    ctx.fillText("Distance left = " + Math.ceil(distantLeft), xpos-70, ypos + 110);
    ctx.fillText("Distance right = " + Math.ceil(distantRight), xpos + 70, ypos + 110);
    ctx.fillText("Time = " + timeCount, xpos, ypos + 125);
    ctx.fillText("Speed = " + speed.toFixed(2), xpos, ypos + 140);

    //Collision control - Collision control - Collision control - Collision control
    //Collision control - Collision control - Collision control - Collision control
    var imgData = ctx.getImageData(car.x, car.y, 10, 10);
    var red = imgData.data[0];
    var green = imgData.data[1];
    var blue = imgData.data[2];
    var alpha = imgData.data[3];
    if (green + red + blue < 600) {
        aktuelColor = "red";
        clearInterval(myTimer);
        carCrashed();
        document.getElementById('startNewGameButton').style.visibility = 'visible';
    }
    else
    {
        aktuelColor = "black";
    }
}


/* NEW STUFF */




function calculateRotation(chromosome) {
    // Example rotation calculation based on chromosome
    return (distantLeft * Number(chromosome[0])) +
           (distantRight * Number(chromosome[1])) +
           (distantLeft * Number(chromosome[2])) +
           (distantRight * Number(chromosome[3]));
}

function calculateSpeedChange(chromosome) {
    // Example speed change calculation based on chromosome
    return (speed * Number(chromosome[4])) +
    (distantFront * Number(chromosome[5])) +
    (speed * Number(chromosome[6])) +
    (distantFront * Number(chromosome[7]));
}

function checkCrash(car) {
    // Example crash conditions: check if the car hits boundaries or other criteria
    var imgData = ctx.getImageData(car.x, car.y, 10, 10);
    var green = imgData.data[1];
    if (green < 200) { // Assuming green value below 200 indicates off-track
        car.isCrashed = true;
    }
}