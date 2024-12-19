let gameData = JSON.parse(sessionStorage.getItem("gameData"));
const recordsFunctions = require("./recordsFunctions.js");
const locationFunctions = require("../functions/location.js");

let recordsFlex = document.createElement("div");
recordsFlex.className = "recordsFlex";
document.body.appendChild(recordsFlex);

/* overall presentation:

-Past winners
-Teams with most titles
-One random record

-button to see records per season
-button to see records per team
-button to see all records (per victory/defeat, ...?)

*/

//pastWinners:
let pastWinnersArray = [];
for(let i = 0; i < gameData.seasons.length; i++){
    if(i <= 11){
        pastWinnersArray.push([gameData.seasons[i].postSeasonSchedule[1].matchups[0].winner, gameData.seasons[i].postSeasonSchedule[1].matchups[0].loser]);
    }
    else{
        if(gameData.seasons[i].postSeasonSchedule.finals[gameData.seasons[i].postSeasonSchedule.finals.length - 1].matchups[0].winner){
            pastWinnersArray.push([gameData.seasons[i].postSeasonSchedule.finals[gameData.seasons[i].postSeasonSchedule.finals.length - 1].matchups[0].winner, gameData.seasons[i].postSeasonSchedule.finals[gameData.seasons[i].postSeasonSchedule.finals.length - 1].matchups[0].loser]);
        }
    }
}
let pastWinnersNode = document.createElement("div");
pastWinnersNode.style.marginRight = "20px";
pastWinnersNode.style.paddingLeft = "10px";
recordsFlex.appendChild(pastWinnersNode)
let namePSW = document.createElement("div");
namePSW.innerText = "Season Winners";
namePSW.style.width = "250px";
namePSW.style.textAlign = "center";
pastWinnersNode.appendChild(namePSW)
recordsFunctions.pastWinners(gameData, pastWinnersArray, pastWinnersNode);

//teams with most titles:

recordsFunctions.makeRecordUI(gameData, gameData.records.postSeason.titles.mostTitles, false, recordsFlex);

/* //playoffDrought
let titleDraughtArray = [];
for(let i = 0; i < gameData.teams.length; i++){
    for(let i = 0; i < gameData.records.postSeason.titles.mostTitles.teams.length; i++){
        if(gameData.records.postSeason.titles.mostTitles.teams[i].teamId == team){
            lastSeason = gameData.records.postSeason.titles.mostTitles.teams[i].seasonsId[gameData.records.postSeason.titles.mostTitles.teams[i].seasonsId.length - 1];
        }
    }
    titleDraughtArray.push({teamId: i, seasons: gameData.seasons.length - 1 - gameData.teams[team].date});
}

let titleDraughtNode = document.createElement("div");
titleDraughtNode.style.marginRight = "20px";
titleDraughtNode.style.paddingLeft = "10px";
recordsFlex.appendChild(titleDraughtNode)
let nameTitleDraught = document.createElement("div");
nameTitleDraught.innerText = "Title Draught";
nameTitleDraught.style.width = "250px";
nameTitleDraught.style.textAlign = "center";
titleDraughtNode.appendChild(nameTitleDraught)
recordsFunctions.pastWinners(gameData, titleDraughtArray, titleDraughtNode); */


//choose records for season:
let selectionDiv = document.createElement("div");
document.body.appendChild(selectionDiv);
let select = document.createElement("select");
selectionDiv.appendChild(select);

for(let i = 0; i < gameData.seasons.length; i++){
    let option = document.createElement("option");
    option.innerText = `${gameData.seasons[i].date}`;
    option.value = i;
    select.appendChild(option);
}

let recordsSeasonButton = document.createElement("button");
recordsSeasonButton.innerText = "Season Records"
recordsSeasonButton.addEventListener("click", () => {
    sessionStorage.setItem("season", select.value);
    location.href = "./recordsSeason.html";
});
selectionDiv.appendChild(recordsSeasonButton);

let recordsAllTimeButton = document.createElement("button");
recordsAllTimeButton.innerText = "All Time Records"
recordsAllTimeButton.addEventListener("click", () => {
    location.href = "./recordsAllTime.html";
});
selectionDiv.appendChild(recordsAllTimeButton);

