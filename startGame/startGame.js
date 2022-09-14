const { session } = require('electron');
let gameData = JSON.parse(sessionStorage.getItem("gameData"));


console.log(gameData);

for(let i = 0; i < gameData.seasons.length; i++){
    let button = document.createElement("button");
    button.innerText = `${gameData.seasons[i].date}`;
    button.addEventListener("click", () => {
        sessionStorage.setItem("season", i);
        location.href = "../season/season.html";
    }); 
    button.style.display = "block";
    document.body.appendChild(button);
}

let button = document.createElement("button");
button.innerText = "New Season";
button.addEventListener("click", () => {
  gameData = JSON.stringify(gameData);
  sessionStorage.setItem("gameData", gameData);
  location.href = "../newSeason/newSeason.html";
});
document.body.appendChild(button);