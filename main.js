import {Renderer} from './renderer.js';
import {Circle} from './circle.js';
import {Rect} from './rect.js';
import {Vec} from './vector.js';
import {Input} from './input.js';
import {RigidBody} from './rigidBody.js';

//simulation constants
const SMALLEST_RADIUS = 10;
const LOWEST_DISTANCE_MOVING_OBJ = 30;
const dt = 1/60;    //based on seconds per frame

const canv = document.getElementById("canvas"); //find canvas element on web page
const ctx = canv.getContext("2d");  //used for drawing shapes on canvas

const inp = new Input(canv, window);
inp.resizeCanvas();
inp.addListeners();


const renderer = new Renderer(canv, ctx);   //object from imported class Renderer
const fillCol = "darkGray";
const bordCol = "black";

const objects = [];
let shapeBeingMade = null;
let movingShape = false;
//button variables
let shapeSelected = 'r';
const circleButton = document.getElementById("c");
const rectButton = document.getElementById("r");
circleButton.onclick = function() {
    shapeSelected = 'c';
};
rectButton.onclick = function() {
    shapeSelected = 'r';
};


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

    //add objects
    if (shapeBeingMade && !inp.inputs.lclick) { //store ready circle after releasing left click
        addObject(shapeBeingMade);   //push means add object to array
        shapeBeingMade = null;
    }

    //move the objects with the mouse
    let closestObji = null;
    let distanceMouseObj;
    let currentLowestDist = LOWEST_DISTANCE_MOVING_OBJ;
    if(inp.inputs.rclick && !inp.inputs.lclick && !movingShape) {
        for (let i = 0; i<objects.length; i++) {    //for loop - iterate over all the objects in the array
            const obj = objects[i];
            distanceMouseObj = obj.shape.position.distanceTo(inp.inputs.mouse.position);
            if (distanceMouseObj < currentLowestDist) {
                currentLowestDist = distanceMouseObj;
                closestObji = i;    //the i of the closest object to the mouse
            }
        }
    }
    if(closestObji != null) {
        movingShape = true;
        objects[closestObji].isMoved = true;
    }
    if (movingShape && !inp.inputs.rclick) {
        movingShape = false;   //stop moving objects
        for(let i=0; i<objects.length; i++) {
            objects[i].isMoved = false; //when not rclick anymore set isMoved to false
        } 
    }
    //update the positions and velocities for all moved objects
    for (let i = 0; i<objects.length; i++) {
        if(objects[i].isMoved) {
            const movedObj = objects[i];
            movedObj.shape.position.copy(inp.inputs.mouse.position); //updates the position of the moved obj
            movedObj.velocity.copy(inp.inputs.mouse.velocity);
        }
    }

    //draw objects
    renderer.clearFrame();  //first clear
    renderer.drawFrame(objects, fillCol, bordCol);
    //draw shape
    if (shapeBeingMade instanceof Circle) {
        renderer.drawCircle(shapeBeingMade, bordCol, null);
        //lesson 03 - draw rectangle shape
    } else if (shapeBeingMade instanceof Rect) {
        renderer.drawRect(shapeBeingMade, bordCol, null);
    }
}
let renderInterval = setInterval(updateAndDraw, 1000 / 60);

function addObject(shape) {
    objects.push(new RigidBody(shape));
}