import { random } from "lodash";

const animClassList = [
    "animate-in top",
    "animate-in right",
    "animate-in bottom",
    "animate-in left"
];

function getAnimationClass(){
   let animClass = animClassList[random(0, animClassList.length - 1)];
   return animClass;
}

export default getAnimationClass;