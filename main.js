import {Renderer} from './renderer.js';
import {Circle} from './circle.js';
import {Rect} from './rect.js';
import {Input} from './input.js';
import {RigidBody} from './rigidBody.js';
import {Collisions} from './collisions.js';
import {Vec} from './vector.js';

const SMALLEST_RADIUS = 10;
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
let shapeBeingMade = null;
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

    //Lesson 03 - update object positions with velocity
    for(let i=0; i<objects.length; i++) {
        objects[i].updateShape(dt);
    }

    //COLLISIONS
    col.clearCollisions();
    col.broadPhazeDetection(objects);
    col.narrowPhazeDetection(objects);  //detect all possible collisions
    col.resolveCollisions();    //push off

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

function addObject(shape) {
    objects.push(new RigidBody(shape));
}
    const object = new RigidBody(shape);  
    objects.push(object);


//creating objects
const gradesObject = {
    math: 99,
    bio: 95,
    chem: 96,
    english: 98,
    bestGrade: "math",

    setBioGrade: function (grade) {
        this.bio = grade;
    },

    setGrade: function(grade, subject) {
        this[subject] = grade;
    }
};
//accessing object properties
// console.log(gradesObject.bestGrade);
console.log(gradesObject["bestGrade"]);

gradesObject.bio = 100;
// console.log(gradesObject);

//object methods
gradesObject.setBioGrade(90);
gradesObject.setGrade(91, "math");
gradesObject.setGrade(94, "chem");
console.log(gradesObject);

class GradesClass {
    constructor(mathGrade, bio, chem, engl, bestGr) {   //constructor method creates the object
        this.math = mathGrade;
        this.bio = bio;
        this.chem = chem;
        this.english = engl;
        this.bestGrade = bestGr;
    }
    //other object methods
    addBio(score) {
        this.bio += score;
    }

}

const myGrades = new GradesClass(99, 90, 91, 89, "math");   //new keyword calls constructor
const seikohGrades = new GradesClass(91, 95, 92, 93, "bio");
// console.log(myGrades);
// console.log(seikohGrades);
seikohGrades.addBio(2);
// console.log(seikohGrades);