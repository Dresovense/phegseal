let gameData = JSON.parse(sessionStorage.getItem("gameData"));
const recordsFunctions = require("./recordsFunctions.js");

let records = gameData.records;

let currentRecordShown = "points";

let divTitle = document.createElement("h3");
divTitle.innerText = `All Time Records`;
document.body.appendChild(divTitle);

//create buttons for records
let buttonList = document.createElement("div");
buttonList.className = "buttonListRecords";
document.body.appendChild(buttonList);

let buttonPoints = document.createElement("button");
buttonPoints.innerText = "Points";
buttonPoints.addEventListener("click", () => {
    currentRecordShown = "points";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonPoints);

let buttonPointsPer = document.createElement("button");
buttonPointsPer.innerText = "Points%";
buttonPointsPer.addEventListener("click", () => {
    currentRecordShown = "points%";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonPointsPer);

let buttonVictories = document.createElement("button");
buttonVictories.innerText = "Victories";
buttonVictories.addEventListener("click", () => {
    currentRecordShown = "victories";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonVictories);

let buttonDefeats = document.createElement("button");
buttonDefeats.innerText = "Defeats";
buttonDefeats.addEventListener("click", () => {
    currentRecordShown = "defeats";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonDefeats);

let buttonTies = document.createElement("button");
buttonTies.innerText = "Ties";
buttonTies.addEventListener("click", () => {
    currentRecordShown = "ties";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonTies);

let buttonGoalsScored = document.createElement("button");
buttonGoalsScored.innerText = "Goals Scored";
buttonGoalsScored.addEventListener("click", () => {
    currentRecordShown = "goalsScored";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonGoalsScored);

let buttonGoalsAgainst = document.createElement("button");
buttonGoalsAgainst.innerText = "Goals Against";
buttonGoalsAgainst.addEventListener("click", () => {
    currentRecordShown = "goalsAgainst";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonGoalsAgainst);

let buttonGoalDifferential = document.createElement("button");
buttonGoalDifferential.innerText = "Goal Differential";
buttonGoalDifferential.addEventListener("click", () => {
    currentRecordShown = "goalDifferential";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonGoalDifferential);

let buttonShutouts = document.createElement("button");
buttonShutouts.innerText = "Shutouts";
buttonShutouts.addEventListener("click", () => {
    currentRecordShown = "shutouts";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonShutouts);

let buttonPlayOffs = document.createElement("button");
buttonPlayOffs.innerText = "Playoffs";
buttonPlayOffs.addEventListener("click", () => {
    currentRecordShown = "playoffs";
    printRecordsSeason(currentRecordShown);
});
buttonList.appendChild(buttonPlayOffs);

function printRecordsSeason(recordType){
    recordsFlex.innerHTML = "";
    if(recordType == "points"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.points.mostPoints, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.points.lessPoints, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.points.mostPointsNoFirst, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.points.lessPointsFirst, false, recordsFlex);
    }
    if(recordType == "points%"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.pointsPer.mostPoints, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.pointsPer.lessPoints, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.pointsPer.mostPointsNoFirst, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.pointsPer.lessPointsFirst, false, recordsFlex);
    }
    else if(recordType == "victories"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.mostVictories, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.mostVictoriesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.mostVictoriesAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.lessVictories, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.lessVictoriesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.lessVictoriesAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.mostConsecutiveVictories, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.mostConsecutiveVictoriesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.mostConsecutiveVictoriesAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.consecutiveNoLoseMatches, false, recordsFlex);
    }
    else if(recordType == "defeats"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.mostDefeats, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.mostDefeatsHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.mostDefeatsAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.lessDefeats, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.lessDefeatsHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.lessDefeatsAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.mostConsecutiveDefeats, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.mostConsecutiveDefeatsHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.defeats.mostConsecutiveDefeatsAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.victories.consecutiveNoWinMatches, false, recordsFlex);
    }
    else if(recordType == "ties"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.mostTies, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.mostTiesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.mostTiesAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.lessTies, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.lessTiesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.lessTiesAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.mostConsecutiveTies, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.mostConsecutiveTiesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.ties.mostConsecutiveTiesAway, false, recordsFlex);
    }
    else if(recordType == "goalsScored"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostGoalsScored, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostGoalsScoredHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostGoalsScoredAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessGoalsScored, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessGoalsScoredHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessGoalsScoredAway, false, recordsFlex);
    }
    else if(recordType == "goalsAgainst"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostGoalsAgainst, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostGoalsAgainstHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostGoalsAgainstAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessGoalsAgainst, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessGoalsAgainstHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessGoalsAgainstAway, false, recordsFlex);
    }
    else if(recordType == "goalDifferential"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.bestGoalDifference, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.bestGoalDifferenceHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.bestGoalDifferenceAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.worstGoalDifference, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.worstGoalDifferenceHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.worstGoalDifferenceAway, false, recordsFlex);
    }
    else if(recordType == "shutouts"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostShutouts, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostShutoutsHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.mostShutoutsAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessShutouts, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessShutoutsHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.regularSeason.goals.lessShutoutsAway, false, recordsFlex);
    }
    else if(recordType == "playoffs"){
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.victories.mostPlayoffVictories, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.victories.mostPlayoffVictoriesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.victories.mostPlayoffVictoriesAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.victories.mostAddTimeVictories, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.victories.mostAddTimeVictoriesHome, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.victories.mostAddTimeVictoriesAway, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.goals.mostGoalsScoredInPlayoffs, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.goals.mostGoalsScoredHomeInPlayoffs, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.goals.mostGoalsScoredAwayInPlayoffs, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.goals.mostShutoutsInPlayoffs, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.goals.mostShutoutsHomeInPlayoffs, false, recordsFlex);
        recordsFunctions.makeRecordUIAllTime(gameData, records.postSeason.goals.mostShutoutsAwayInPlayoffs, false, recordsFlex);
    }
}

//records Flex
let recordsFlex = document.createElement("div");
recordsFlex.className = "recordsFlex";
document.body.appendChild(recordsFlex);
