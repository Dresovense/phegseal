const { match } = require('assert');
const fs = require('fs');

let gameData = JSON.parse(sessionStorage.getItem("gameData"));

let startDate = gameData.seasons[gameData.seasons.length - 1].endDate;
let endDate = parseInt(gameData.seasons[gameData.seasons.length - 1].endDate) + 1;
let seasonTitle = document.createElement("h3");
seasonTitle.innerText = startDate + "-" + endDate + " season configuration";
document.body.appendChild(seasonTitle);

//chose teams
let teamList = [];

let divTeams = document.createElement("div");
document.body.appendChild(divTeams);
divTeams.className = "teamChoice";
divTeams.style.display = "inline-block";
for(let i = 0; i < gameData.teams.length; i++){
    let team = document.createElement("div");
    team.innerText = gameData.teams[i].name;
    if(teamList.includes(i)){
        team.style.backgroundColor = "lightblue";
    }
    team.addEventListener("click", () => {
        if(!teamList.includes(i)){
            teamList.push(i);
            team.style.backgroundColor = "lightblue";
        }
        else{
            const index = teamList.indexOf(i);
            if (index > -1){
                teamList.splice(index, 1);
                team.style.backgroundColor = "white";
            }
        }
    });
    divTeams.appendChild(team);
}

let selectAllButton = document.createElement("button");
selectAllButton.innerText = "Select All";
selectAllButton.className = "teamChoice";
selectAllButton.addEventListener("click", () => {
    teamList = [];
    let teams = document.querySelectorAll("div")
    for(let i = 0; i < gameData.teams.length; i++){
        teamList.push(i);
        teams[i + 2].style.backgroundColor = "lightblue";
    }
});
document.body.appendChild(selectAllButton);

let confirmChoicebutton = document.createElement("button");
confirmChoicebutton.innerText = "Confirm Choice";
confirmChoicebutton.className = "teamChoice";
confirmChoicebutton.addEventListener("click", () => {
    let divsTeam = document.getElementsByClassName("teamChoice");
    for(let i = 0; i < divsTeam.length; i++){
        divsTeam[i].style.display = "none";
    }
    let divsSchedule = document.getElementsByClassName("scheduleChoice");
    for(let i = 0; i < divsSchedule.length; i++){
        divsSchedule[i].style.display = "block";
    }
});
document.body.appendChild(confirmChoicebutton);

//choose type of schedule: - rounds; - conferences? post-season

let numberRounds = 0;
let postSeasonRounds = 0;

let divRoundsChoice = document.createElement("div");
divRoundsChoice.style.display = "none";
divRoundsChoice.className = "scheduleChoice";
divRoundsChoice.innerText = "Number of Rounds:";
document.body.appendChild(divRoundsChoice);
let roundsChoice = document.createElement("input");
roundsChoice.style.display = "none";
roundsChoice.type = "number";
roundsChoice.className = "scheduleChoice";
document.body.appendChild(roundsChoice);

let divPostSeasonRoundsChoice = document.createElement("div");
divPostSeasonRoundsChoice.style.display = "none";
divPostSeasonRoundsChoice.className = "scheduleChoice";
divPostSeasonRoundsChoice.innerText = "Number of Post-Season Rounds:";
document.body.appendChild(divPostSeasonRoundsChoice);
let postSeasonRoundsChoice = document.createElement("input");
postSeasonRoundsChoice.style.display = "none";
postSeasonRoundsChoice.type = "number";
postSeasonRoundsChoice.className = "scheduleChoice";
document.body.appendChild(postSeasonRoundsChoice);

let roundsChoiceButton = document.createElement("button");
roundsChoiceButton.style.display = "none";
roundsChoiceButton.className = "scheduleChoice";
roundsChoiceButton.innerText = "Confirm settings";
roundsChoiceButton.addEventListener("click", () => {
    if(roundsChoice.value <= 0 || postSeasonRoundsChoice.value <= 0){
        window.alert("Invalid number");
    }
    else{
        numberRounds = roundsChoice.value;
        postSeasonRounds = postSeasonRoundsChoice.value;
        let divsSchedule = document.getElementsByClassName("scheduleChoice");
        for(let i = 0; i < divsSchedule.length; i++){
            divsSchedule[i].style.display = "none";
        }
        normalSchedule(teamList, numberRounds, postSeasonRounds);
        gameData.seasons.push(newSeason);
        //save data + go to season
        fs.writeFile('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
            if(err){
                return console.log(err);
            }
        });
        sessionStorage.setItem("season", gameData.seasons.length - 1);
        gameData = JSON.stringify(gameData);
        sessionStorage.setItem("gameData", gameData);
        location.href = "../season/season.html";
    }
});
document.body.appendChild(roundsChoiceButton);

let goBackButton = document.createElement("button");
goBackButton.style.display = "none";
goBackButton.className = "scheduleChoice";
goBackButton.innerText = "Go Back";
goBackButton.addEventListener("click", () =>{
    let divsSchedule = document.getElementsByClassName("scheduleChoice");
    for(let i = 0; i < divsSchedule.length; i++){
        divsSchedule[i].style.display = "none";
    }
    let divsTeam = document.getElementsByClassName("teamChoice");
    for(let i = 0; i < divsTeam.length; i++){
        divsTeam[i].style.display = "inline-block";
    }
});
document.body.appendChild(goBackButton);

//print schedule
let newSeason = {
    "date": startDate + "-" + endDate,
    "endDate": endDate,
    "teams": [],
    "schedule": [],
    "postSeasonSchedule": [],
    "records": {
        "a completer": "..."
    }
};

function normalSchedule (teamList, numberRounds, postSeasonRounds){
    //make schedule + JSON object
    let firstPartOfRound = [];
    for(let i = 0; i < numberRounds; i++){
        if(i % 2 == 0){
            firstPartOfRound = createFirstPartOfRound(shuffleArray(teamList));
        }
        else{
            firstPartOfRound = swapHomeAway(firstPartOfRound);
        }
        for(let j = 0; j < firstPartOfRound.length; j++){
            newSeason.schedule.push(firstPartOfRound[j]);
        }
    }
    for(let i = 0; i < teamList.length; i++){
        if(teamList[i] != -1){
            let team = {
                "id": `${teamList[i]}`
            }
            newSeason.teams.push(team);
        }
    }
    let postSeasonSchedule = [];
    for(let i = 0; i < postSeasonRounds; i++){
        let matchups = {
            "matchups": [],
            "completed": "no",
            "seeds": []
        };
        for(let j = 0; j < Math.pow(2, postSeasonRounds - 1 - i); j++){
            let games = {
                "games": [],
                "winner": "",
                "loser": "",
                "completed": "no"
            }
            for(let k = 0; k < 3; k++){
                let matches = {
                    "team1Id": "",
                    "team2Id": "",
                    "team1Goals": "",
                    "team2Goals": "",
                    "team1GoalsAddTime": "",
                    "team2GoalsAddTime": ""
                }
                games.games.push(matches);
            }
            matchups.matchups.push(games);
        }
        postSeasonSchedule.push(matchups);
    }
    newSeason.postSeasonSchedule = postSeasonSchedule;
}

function createFirstPartOfRound(teamList){
    if(teamList.length % 2 == 0){ //if number of teams is odd we add a dummy team
        let firstPartOfRound = []; //schedule
        for(let i = 0; i < teamList.length - 1; i++){
            let fixtures = {    //schedule objects
                "games": [],
                "completed": "no"
            }
            for(let j = 0; j < teamList.length / 2; j++){
                if(i % 2 == 0){ //change Home-Away every match
                    let match = {
                        "team1Id": `${teamList[j]}`,
                        "team2Id": `${teamList[teamList.length - 1 - j]}`,
                        "team1Goals": "",
                        "team2Goals": ""
                    }
                    fixtures.games.push(match);
                }
                else{
                    let match = {
                        "team1Id": `${teamList[teamList.length - 1 - j]}`,
                        "team2Id": `${teamList[j]}`,
                        "team1Goals": "",
                        "team2Goals": ""
                    }    
                    fixtures.games.push(match);
                }
                console.log(fixtures)
                fixtures.games = shuffleArray(fixtures.games);
            }
            firstPartOfRound.push(fixtures);
            //team rotation
            let pivot = teamList[teamList.length - 1];  
            for(let j = 0; j < teamList.length - 1; j++){
                teamList[teamList.length - 1 - j] = teamList [teamList.length - j - 2];
            }
            teamList[1] = pivot;
        }
        return firstPartOfRound;
    } 
    else{
        teamList.push(-1);
        let firstPartOfRound = []; //schedule
        for(let i = 0; i < teamList.length - 1; i++){
            let fixtures = {    //schedule objects
                "games": [],
                "completed": "no"
            }
            for(let j = 0; j < teamList.length / 2; j++){
                if(i % 2 == 0){ //change Home-Away every match
                    if(teamList[teamList.length - 1 - j] != -1 && teamList[j] != -1){
                        let match = {
                            "team1Id": `${teamList[j]}`,
                            "team2Id": `${teamList[teamList.length - 1 - j]}`,
                            "team1Goals": "",
                            "team2Goals": ""
                        }
                        fixtures.games.push(match);
                    }
                }
                else{
                    if(teamList[teamList.length - 1 - j] != -1 && teamList[j] != -1){
                        let match = {
                            "team1Id": `${teamList[teamList.length - 1 - j]}`,
                            "team2Id": `${teamList[j]}`,
                            "team1Goals": "",
                            "team2Goals": ""
                        }    
                        fixtures.games.push(match);
                    }
                }
            }
            firstPartOfRound.push(fixtures);
            //team rotation
            let pivot = teamList[teamList.length - 1];  
            for(let j = 0; j < teamList.length - 1; j++){
                teamList[teamList.length - 1 - j] = teamList [teamList.length - j - 2];

            }
            teamList[1] = pivot;
        }
        
        return firstPartOfRound;
    }
}

function swapHomeAway(firstPartOfRound){
    let secondPartOfRound = [];
    for(let i = 0; i < firstPartOfRound.length; i++){
        let fixtures = {
            "games": [],
            "completed": "no"
        };
        for(let j = 0; j < firstPartOfRound[i].games.length; j++){
            let match = {
                "team1Id": `${firstPartOfRound[i].games[j].team2Id}`,
                "team2Id": `${firstPartOfRound[i].games[j].team1Id}`,
                "team1Goals": "",
                "team2Goals": ""
            }    
            console.log(match);
            fixtures.games.push(match);
        }
        secondPartOfRound.push(fixtures);
    }
    return secondPartOfRound;
}

function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }