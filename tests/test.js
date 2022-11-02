const dice = require("../season/dice.js");


let matches = [];
for(let i = 0; i < 200; i++){

    matches.push(dice.diceTest(1.5,0.5));
}

let victories = 0;
let defeats = 0;
let ties = 0;
for(let i = 0; i < 200; i++){
    console.log(matches[i]);
    if(matches[i][0] > matches [i][1]){
        victories++;
    }
    else if(matches[i][0] < matches [i][1]){
        defeats++;
    }
    else{
        ties++;
    }
}
console.log(victories);
console.log(defeats);
console.log(ties);