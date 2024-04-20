import {Renderer} from './renderer.js';
import {Circle} from './circle.js';
import {Rect} from './rect.js';
import {Input} from './input.js';
import {RigidBody} from './rigidBody.js';
import {Collisions} from './collisions.js';
import {Vec} from './vector.js';

const SMALLEST_RADIUS = 10;
const WORLD_SIZE = 5000;
const dt = 1/60;    //time per frame

const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");

export const renderer = new Renderer(canv, ctx);
const fillCol = "darkGray";
const bordCol = "black";

const col = new Collisions();

//inputs
const inp = new Input(canv, window, dt);
inp.resizeCanvas();
inp.addListeners();

const objects = [];
//ground object
addObject(
    new Rect (
        new Vec (canv.width / 2, canv.height),
        3*canv.width, 
        canv.height*0.6
    ),
    true    //it is fixed
);

let shapeBeingMade = null;

let shapeSelected = 'r';
let gravitySelected = 2;
let colMode = 2;

//button variables
const circleButton = document.getElementById("c");
const rectButton = document.getElementById("r");
circleButton.onclick = function() {
    shapeSelected = 'c';
};
rectButton.onclick = function() {
    shapeSelected = 'r';
};

//select variables
const selectGravity = document.getElementById("gravity");
selectGravity.addEventListener("change", function () {
    gravitySelected = selectGravity.value;
})
const selectCollisions = document.getElementById("collisions");
selectCollisions.addEventListener("change", function () {
    colMode = selectCollisions.value;
})

//MAIN LOOP
function updateAndDraw() {

    //make objects
    if (inp.inputs.lclick && shapeBeingMade == null) {
        //lesson 03 - make rectangles with mouse
        if (shapeSelected == 'c') {
            shapeBeingMade = new Circle(inp.inputs.mouse.position.clone(), SMALLEST_RADIUS, 0);
        } else if (shapeSelected == 'r') {
            shapeBeingMade = new Rect(inp.inputs.mouse.position.clone(), SMALLEST_RADIUS*2, SMALLEST_RADIUS*2);
        }
        
    }
    //adjust radius
    if (inp.inputs.lclick && shapeBeingMade instanceof Circle) {
        const selectedRadius = shapeBeingMade.position.clone().subtract(inp.inputs.mouse.position).magnitude();
        shapeBeingMade.radius = selectedRadius < SMALLEST_RADIUS ? shapeBeingMade.radius : selectedRadius;
    } 
    //lesson 03 - adjust rectangle
    else if (inp.inputs.lclick && shapeBeingMade instanceof Rect) {
        const selectionVector = shapeBeingMade.position.clone().subtract(inp.inputs.mouse.position).absolute();
        shapeBeingMade.width = selectionVector.x > SMALLEST_RADIUS ? selectionVector.x * 2 : SMALLEST_RADIUS * 2;
        shapeBeingMade.height = selectionVector.y > SMALLEST_RADIUS ? selectionVector.y * 2 : SMALLEST_RADIUS * 2;
    }

    //add objects - lesson 03
    if (shapeBeingMade && !inp.inputs.lclick) {
        addObject(shapeBeingMade);
        shapeBeingMade = null;
    }

    //move objects with mouse
    if(!inp.inputs.lclick && inp.inputs.rclick && !inp.inputs.mouse.movedObject) {
        const closestObject = findClosestObject(objects, inp.inputs.mouse.position);
        inp.inputs.mouse.movedObject = closestObject == null ? null : closestObject;
    }
    if(!inp.inputs.rclick || inp.inputs.lclick) {
        inp.inputs.mouse.movedObject = null;
    }
    if(inp.inputs.mouse.movedObject) {
        moveObjectWithMouse(inp.inputs.mouse.movedObject);
    }

    //set gravity
    let g = 200;
    //update g based on input
    switch (true) {
        case gravitySelected == 0: g = 0; break;
        case gravitySelected == 1: g = 20; break;
        case gravitySelected == 2: g = 200; break;
        case gravitySelected == 3: g = 2000; break;
    }

    //set object accelerations
    for(let i=1; i<objects.length; i++) {
        objects[i].acceleration.zero();
        objects[i].acceleration.y += g;
    }

    // console.time('collisions');
    //improve precision
    const iterations = 20;

    for(let i=0; i<iterations; i++) {

        for(let i=0; i<objects.length; i++) {
            objects[i].updateShape(dt / iterations);
        }

        //COLLISIONS
        if (colMode != 0) {
            col.clearCollisions();
            col.broadPhazeDetection(objects);
            col.narrowPhazeDetection(objects);  //detect all possible collisions
            if (colMode == 1) {
                col.resolveCollisionsWithPushOff();
            } else if (colMode == 2) {
                col.resolveCollisionsWithBounceOff();
            }  
        }
    }

    // console.timeEnd('collisions');

    //remove objects that are too far
    const objectsToRemove = [];
    for (let i=0; i<objects.length; i++) {
        if (objects[i].checkTooFar(WORLD_SIZE)) {
            objectsToRemove.push(objects[i]);
        }
    }
    removeObjects(objectsToRemove);

    //draw objects
    renderer.clearFrame();
    renderer.drawFrame(objects, fillCol, bordCol);
    //draw shape
    if (shapeBeingMade) {
        shapeBeingMade.draw(ctx, bordCol, null);
    }

}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);

function findClosestObject(objects, vector) {
    let closestObject = null;
    let distance;
    let lowestDistance = 30;
    for(let i=0; i<objects.length; i++) {
        distance = objects[i].shape.position.distanceTo(vector);
        if (distance < lowestDistance) {
            lowestDistance = distance;
            closestObject = objects[i];
        }
    }
    return closestObject;
}

function moveObjectWithMouse(object) {
    object.shape.position.copy(inp.inputs.mouse.position);
    object.velocity.copy(inp.inputs.mouse.velocity);
}

function addObject(shape, fixed=false) {
    const object = new RigidBody(shape, fixed);
    object.setMass();  
    objects.push(object);
} 

function removeObjects(objectsToRemove) {
    for (let i=0; i<objects.length; i++) {
        for (let j=0; j<objectsToRemove.length; j++) {
            if (objects[i] == objectsToRemove[j]) {
                objects.splice(i, 1);
            }
        }
    }
}

