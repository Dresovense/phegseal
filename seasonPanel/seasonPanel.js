let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");

//season Date
let seasonDate = document.createElement("h1");
seasonDate.innerText = gameData.seasons[season].date;
seasonDate.className = "seasonPanel_seasonDate";
document.body.appendChild(seasonDate);


//Win Probabilities
let winProbabilitiesContainer = document.createElement("div");
winProbabilitiesContainer.className = "seasonPanel_winProbabilitiesContainer";
document.body.appendChild(winProbabilitiesContainer);
let winProbabilitiesList = [];
for(let i = 0; i < gameData.seasons[season].teams.allTeams.length; i++){
    let teamId = gameData.seasons[season].teams.allTeams[i];
    winProbabilitiesList.push(teamId);
}
winProbabilitiesList.sort((a,b) => {
    if(a.power > b.power){
        return -1
    }
    else{
        return 1
    }
});
for(let i = 0; i < winProbabilitiesList.length; i++){
    let winProbabilitiesRow = document.createElement("div");
    winProbabilitiesRow.className = "seasonPanel_winProbabilitiesRow";
    winProbabilitiesContainer.appendChild(winProbabilitiesRow);

    let teamName = document.createElement("div");
    teamName.className = "seasonPanel_winProbabilitiesRowSquare";
    teamName.id = "name";
    teamName.innerText = gameData.teams[winProbabilitiesList[i].id].name;
    winProbabilitiesRow.appendChild(teamName);
    //logo of team
    let logo = document.createElement("img");
    logo.className = "logo";
    logo.id = "logo";
    logo.src = ".." + gameData.teams[winProbabilitiesList[i].id].logo + ".png";
    teamName.appendChild(logo);  
}




//button play season
let buttonPlaySeason = document.createElement("button");
buttonPlaySeason.innerText = "Play Season";
document.body.appendChild(buttonPlaySeason)
buttonPlaySeason.addEventListener("click", () => {
    gameData.seasons[season].postSeasonSchedule.rules.numberOfGamesPerTeam = numberOfGamesPerTeam();
    location.href = "../season/season.html";
});

function numberOfGamesPerTeam(){
    let teamId = gameData.seasons[season].schedule[0].games[0].team1Id;
    let numberOfMatches = 0
    for(let i = 0; i < gameData.seasons[season].schedule.length; i++){
        for(let j = 0; j < gameData.seasons[season].schedule[i].games.length; j++){
            if(gameData.seasons[season].schedule[i].games[j].team1Id == teamId || gameData.seasons[season].schedule[i].games[j].team2Id == teamId){
                numberOfMatches++;
            }
        }
    }
    console.log(numberOfMatches)
    return numberOfMatches
}