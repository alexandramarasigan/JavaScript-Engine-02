import {Vec} from './vector.js';

export class Calc {
    constructor () {
        this.verySmallAmount = 0.05;
    }

    checkNearlyEqual (a, b) {
       return Math.abs(a - b) < this.verySmallAmount;   //returns true or false based on difference
    }

    averageVector (vectors) {
        const n = vectors.length;
        const average = new Vec (0, 0);
        for (let i=0; i<n; i++) {
            average.add(vectors[i]);
        }
        return average.divide(n);
    }
}