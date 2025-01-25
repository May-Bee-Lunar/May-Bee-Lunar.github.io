import {tau} from "./mathFunctions.js";
export function drawCircle(position, radius, context) {
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, tau);
    context.fill();
}