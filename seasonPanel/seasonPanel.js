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

if(season <= 32){
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
}
else if (season < 47){
    winProbabilitiesContainer.style.display = "grid";
    winProbabilitiesContainer.style.gridTemplateColumns = "50px 250px 90px 90px 90px 120px 120px";

    let predictions = gameData.seasons[season].predictions;
    let standings = [];
    let standingsOrdered = [];
    predictions.standings.forEach((value) => {standingsOrdered.push(value)})
    standingsOrdered.sort(function(a, b){return b-a})
    console.log(standingsOrdered)
    console.log(predictions.standings)
    for(let i = 0; i < standingsOrdered.length; i++){
        for(let j = 0; j < predictions.standings.length; j++){
            if(predictions.standings[j] == standingsOrdered[i]){
                standings.push(j);
            }
        }
    }
    for(let i = -1; i < predictions.win.length; i++){
        if(i == -1){
            let place = document.createElement("div");
            place.innerText = "Pos";
            place.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(place);

            let team = document.createElement("div")
            team.innerText = "Team";
            team.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(team);

            let winRegularSeasonProbability = document.createElement("div")
            winRegularSeasonProbability.innerText = "Regular Season odds:";
            winRegularSeasonProbability.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(winRegularSeasonProbability);

            let firstOverallOdds = document.createElement("div")
            firstOverallOdds.innerText = "1st overall odds:";
            firstOverallOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(firstOverallOdds);

            let playoffOdds = document.createElement("div")
            playoffOdds.innerText = "Playoff odds:";
            playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffOdds);

            let expectations = document.createElement("div")
            expectations.innerText = "Expectations:";
            expectations.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(expectations);

            let playoffsLastYear = document.createElement("div")
            playoffsLastYear.innerText = "Playoffs Last Year:";
            playoffsLastYear.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffsLastYear);
        }
        else{
            let place = document.createElement("div");
            place.innerText = i + 1;
            place.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(place);

            let teamName = document.createElement("div");
            teamName.className = "seasonPanel_winProbabilitiesRowSquare";
            teamName.id = "name";
            teamName.innerText = gameData.teams[standings[i]].name;
            teamName.addEventListener("click", () => { //go to team page
                let gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", standings[i]);
                location.href = "../team/team.html";
            });
            winProbabilitiesContainer.appendChild(teamName);
            //logo of team
            let logo = document.createElement("img"); 
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + gameData.teams[standings[i]].logo + ".png";
            teamName.appendChild(logo);  

            let winRegularSeasonProbability = document.createElement("div")
            winRegularSeasonProbability.innerText = predictions.win[standings[i]] / 10 + "%";
            winRegularSeasonProbability.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(winRegularSeasonProbability);

            let firstOverallOdds = document.createElement("div")
            firstOverallOdds.innerText = predictions.lose[standings[i]] / 10 + "%";
            firstOverallOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(firstOverallOdds);

            let playoffOdds = document.createElement("div")
            playoffOdds.innerText = predictions.playoffs[standings[i]] / 10 + "%";
            playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffOdds);

            let expectations = document.createElement("div")
            expectations.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(expectations);
            for(let k = 0; k < gameData.seasons[season].teams.allTeams.length; k++){
                if(gameData.seasons[season].teams.allTeams[k].id == standings[i]){
                    console.log(`${gameData.teams[standings[i]].name} / ${standings[i]}: ${gameData.seasons[season].teams.allTeams[k].power}`)
                    if(gameData.seasons[season].teams.allTeams[k].power < 0.5){
                        expectations.innerText = "Tanking";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 0.8){
                        expectations.innerText = "None";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1){
                        expectations.innerText = "Be competitive";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1.1){
                        expectations.innerText = "Playoff Team";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1.25){
                        expectations.innerText = "Dark horse"
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1.6){
                        expectations.innerText = "Contender"
                    }
                    else{
                        expectations.innerText = "Favourite";
                    }
                }
            }

            let playoffsLastYear = document.createElement("div")
            playoffsLastYear.innerText = "No";
            for(let k = 0; k < gameData.seasons[season - 1].postSeasonSchedule.teamsInPlayoffs.length; k++){
                if(gameData.seasons[season - 1].postSeasonSchedule.teamsInPlayoffs[k] == standings[i]){
                    playoffsLastYear.innerText = "Yes";
                }
            }
            playoffsLastYear.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffsLastYear);

            if(i % 2 == 0){
                place.style.backgroundColor = "lightgray";
                teamName.style.backgroundColor = "lightgray";
                winRegularSeasonProbability.style.backgroundColor = "lightgray";
                firstOverallOdds.style.backgroundColor = "lightgray";
                playoffOdds.style.backgroundColor = "lightgray";
                expectations.style.backgroundColor = "lightgray";
                playoffsLastYear.style.backgroundColor = "lightgray";
            }
        }
    }
}
else{
    winProbabilitiesContainer.style.display = "grid";
    winProbabilitiesContainer.style.gridTemplateColumns = "50px 250px 90px 90px 90px 120px 120px";

    let predictions = gameData.seasons[season].predictions[0];
    let standings = [];
    let standingsOrdered = [];
    predictions.standings.forEach((value) => {standingsOrdered.push(value)})
    standingsOrdered.sort(function(a, b){return b-a})
    console.log(standingsOrdered)
    console.log(predictions.standings)
    for(let i = 0; i < standingsOrdered.length; i++){
        for(let j = 0; j < predictions.standings.length; j++){
            if(predictions.standings[j] == standingsOrdered[i]){
                standings.push(j);
            }
        }
    }
    for(let i = -1; i < predictions.win.length; i++){
        if(i == -1){
            let place = document.createElement("div");
            place.innerText = "Pos";
            place.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(place);

            let team = document.createElement("div")
            team.innerText = "Team";
            team.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(team);

            let winRegularSeasonProbability = document.createElement("div")
            winRegularSeasonProbability.innerText = "Regular Season odds:";
            winRegularSeasonProbability.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(winRegularSeasonProbability);

            let firstOverallOdds = document.createElement("div")
            firstOverallOdds.innerText = "1st overall odds:";
            firstOverallOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(firstOverallOdds);

            let playoffOdds = document.createElement("div")
            playoffOdds.innerText = "Playoff odds:";
            playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffOdds);

            let expectations = document.createElement("div")
            expectations.innerText = "Expectations:";
            expectations.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(expectations);

            let playoffsLastYear = document.createElement("div")
            playoffsLastYear.innerText = "Playoffs Last Year:";
            playoffsLastYear.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffsLastYear);
        }
        else{
            let place = document.createElement("div");
            place.innerText = i + 1;
            place.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(place);

            let teamName = document.createElement("div");
            teamName.className = "seasonPanel_winProbabilitiesRowSquare";
            teamName.id = "name";
            teamName.innerText = gameData.teams[standings[i]].name;
            teamName.addEventListener("click", () => { //go to team page
                let gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", standings[i]);
                location.href = "../team/team.html";
            });
            winProbabilitiesContainer.appendChild(teamName);
            //logo of team
            let logo = document.createElement("img"); 
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + gameData.teams[standings[i]].logo + ".png";
            teamName.appendChild(logo);  

            let winRegularSeasonProbability = document.createElement("div")
            winRegularSeasonProbability.innerText = predictions.win[standings[i]] / 5 + "%";
            winRegularSeasonProbability.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(winRegularSeasonProbability);

            let firstOverallOdds = document.createElement("div")
            firstOverallOdds.innerText = predictions.lose[standings[i]] / 5 + "%";
            firstOverallOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(firstOverallOdds);

            let playoffOdds = document.createElement("div")
            playoffOdds.innerText = predictions.playoffs[standings[i]] / 5 + "%";
            playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffOdds);

            let expectations = document.createElement("div")
            expectations.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(expectations);
            for(let k = 0; k < gameData.seasons[season].teams.allTeams.length; k++){
                if(gameData.seasons[season].teams.allTeams[k].id == standings[i]){
                    console.log(`${gameData.teams[standings[i]].name} / ${standings[i]}: ${gameData.seasons[season].teams.allTeams[k].power}`)
                    if(gameData.seasons[season].teams.allTeams[k].power < 0.5){
                        expectations.innerText = "Tanking";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 0.8){
                        expectations.innerText = "None";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1){
                        expectations.innerText = "Be competitive";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1.1){
                        expectations.innerText = "Playoff Team";
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1.25){
                        expectations.innerText = "Dark horse"
                    }
                    else if(gameData.seasons[season].teams.allTeams[k].power < 1.6){
                        expectations.innerText = "Contender"
                    }
                    else{
                        expectations.innerText = "Favourite";
                    }
                }
            }

            let playoffsLastYear = document.createElement("div")
            playoffsLastYear.innerText = "No";
            for(let k = 0; k < gameData.seasons[season - 1].postSeasonSchedule.teamsInPlayoffs.length; k++){
                if(gameData.seasons[season - 1].postSeasonSchedule.teamsInPlayoffs[k] == standings[i]){
                    playoffsLastYear.innerText = "Yes";
                }
            }
            playoffsLastYear.className = "seasonPanel_winProbabilitiesRowSquare";
            winProbabilitiesContainer.appendChild(playoffsLastYear);

            if(i % 2 == 0){
                place.style.backgroundColor = "lightgray";
                teamName.style.backgroundColor = "lightgray";
                winRegularSeasonProbability.style.backgroundColor = "lightgray";
                firstOverallOdds.style.backgroundColor = "lightgray";
                playoffOdds.style.backgroundColor = "lightgray";
                expectations.style.backgroundColor = "lightgray";
                playoffsLastYear.style.backgroundColor = "lightgray";
            }
        }
    }
}




//button play season
let buttonPlaySeason = document.createElement("button");
buttonPlaySeason.innerText = "Play Season";
document.body.appendChild(buttonPlaySeason)
buttonPlaySeason.addEventListener("click", () => {
    location.href = "../season/season.html";
});

