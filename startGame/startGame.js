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
    button.style.display = "inline-block";
    document.body.appendChild(button);

    if(i > 18 && gameData.seasons[i].draft.completed == "yes"){
      let seeDraft = document.createElement("button");
      seeDraft.style.display = "inline-block";
      seeDraft.innerText = `See ${gameData.seasons[i].date} draft`;
      seeDraft.addEventListener("click", () => {
        sessionStorage.setItem("season", i);
        location.href = "../draft/draft.html";
      }); 
      document.body.appendChild(seeDraft);
    }

    let br = document.createElement("br");
    document.body.appendChild(br)
}

let button = document.createElement("button");
button.innerText = "New Season";
button.style.display = "none";
button.addEventListener("click", () => {
  gameData = JSON.stringify(gameData);
  sessionStorage.setItem("gameData", gameData);
  location.href = "../newSeason/newSeason.html";
});
document.body.appendChild(button);

let newDraftButton = document.createElement("button");
newDraftButton.innerHTML = `${gameData.seasons[gameData.seasons.length - 1].endDate} draft`;
newDraftButton.style.display = "none";
newDraftButton.addEventListener("click", () => {
  gameData = JSON.stringify(gameData);
  sessionStorage.setItem("gameData", gameData);
  sessionStorage.setItem("season", gameData.seasons.length - 1);
  location.href = "../draft/draft.html";
});
document.body.appendChild(newDraftButton);

//newSeason appears if the season has ended and the draft has been completed. Draft appears if the season has been completed
let lastSeason = gameData.seasons.length - 1;
if(gameData.seasons[lastSeason].postSeasonSchedule.finals[gameData.seasons[lastSeason].postSeasonSchedule.finals.length - 1].matchups[0].completed == "yes" && gameData.seasons[lastSeason].draft.completed == "no"){
  newDraftButton.style.display = "block";
}

if(gameData.seasons[lastSeason].draft.completed == "yes"){
  button.style.display = "block";
}