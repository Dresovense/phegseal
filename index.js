const fs = require('fs');
let gameData = JSON.parse(fs.readFileSync('saves/data.json', "utf-8", function (err,data) {
  if (err) {
    return console.log(err);
  }
}));

let button = document.querySelector("button");
button.addEventListener("click", () =>{
    gameData = JSON.stringify(gameData);
    sessionStorage.setItem("gameData", gameData);
    location.href = "startGame/startGame.html";
});