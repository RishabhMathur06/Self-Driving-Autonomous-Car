// Defining the car Canvas where we'll create the car stuff.
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

//Defining the network canvas which would display the NN.
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Create the road
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

// Defining the number of parallel AI Cars present on the road.
const N = 1;
const cars = generateCars(N);
let bestCar=cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i=0; i<cars.length; i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

/* Starting animation */
animate();

// Save locally the best of the cars.
function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Discarding the car from storage
function discard(){
    localStorage.removeItem("bestBrain");
}

// Writing a function that takes number of cars,
// that would run parallely.
function generateCars(N){
    const cars = [];

    for(let i=0; i<=N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

/* Defining animation function*/
function animate(time) {

    // Adding traffic
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }

    //  Updating car position and speed
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar =cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    // Resize the canvas so that it gets cleared.
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // Taking a snapshot of how things are
    // before changes.
    carCtx.save();

    // Moving entire canvas including it's contents,
    // in y-direction and not x-direction.

    // i.e: moving only vertically
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);   // for only 1 car, cars[0]

    //Draw the road.
    road.draw(carCtx);

    //  Draw all cars on the road.
    for(let i=0; i<traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha=0.2;
    // Draw the car.
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue", true);

    // Restores to the state previously saved by context.
    carCtx.restore();

    // Visualizing the forward prop effect on NN Canvas.
    networkCtx.lineDashOffset=-time/50;

    Visualizer.drawNetwork(networkCtx, bestCar.brain); // Printing the brain of only 1 car, cars[0]

    // Start animation.
    requestAnimationFrame(animate);
}
