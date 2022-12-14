const standings = require('../functions/standings.js');
let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");

let draftOrder = [];
let draft= []
let draftClass = gameData.seasons[season].draft.draftClass;                                                //5* 90, 10 * 80, 15 * 70, 20 * 60, 30 * 50
if(gameData.seasons[season].draft.completed == "no"){
    /* let firstName = JSON.parse(fs.readFileSync('nameDb/firstName.json', "utf-8", function (err,data) {
      if (err) {
        return console.log(err);
      }
    }));
    let lastName = JSON.parse(fs.readFileSync('nameDb/lastName.json', "utf-8", function (err,data) {
        if (err) {
          return console.log(err);
        }
    })); */
    
    let lastYearStandings = standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "Pts");
    
    //draft order: by standings and playoff round loss
        //teams that missed the playoffs
    for(let i = lastYearStandings.length - 1; i >= 0; i--){
        if(!gameData.seasons[season].postSeasonSchedule.teamsInPlayoffs.includes(lastYearStandings[i].id)){
            draftOrder.push(lastYearStandings[i].id);
        }
    }
        //teams that lost before the finals
    for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.conference[0].length; j++){
        let roundLosers = []
        for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.conference.length; i++){
            for(let k = 0; k < gameData.seasons[season].postSeasonSchedule.conference[i][j].matchups.length; k++){
                roundLosers.push(gameData.seasons[season].postSeasonSchedule.conference[i][j].matchups[k].loser);
            }
        }
        roundLosers.sort(function(left, right){
            let indexOfLeft;
            let indexOfRight;
            for(let i = 0; i < lastYearStandings.length; i++){
                if(lastYearStandings[i].id == left){
                    indexOfLeft = i;
                }
                if(lastYearStandings[i].id == right){
                    indexOfRight = i;
                }
            }
            if(indexOfLeft > indexOfRight){
                return -1;
            }
            else{
                return 1;
            }
        })
        draftOrder = draftOrder.concat(roundLosers);
    }
        //teams that lost in the finals
    for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.finals.length; i++){
        let roundLosers = [];
        for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.finals[i].matchups.length; j++){
            roundLosers.push(gameData.seasons[season].postSeasonSchedule.finals[i].matchups[j].loser);
        }
        roundLosers.sort(function(left, right){
            if(lastYearStandings[roundLosers[left]].index() > lastYearStandings[roundLosers[right]].index){
                return -1;
            }
            else{
                return 1;
            }
        })
        draftOrder = draftOrder.concat(roundLosers);
    }
        //team that won
    draftOrder.push(gameData.seasons[season].postSeasonSchedule.finals[gameData.seasons[season].postSeasonSchedule.finals.length - 1].matchups[0].winner);
    console.log(draftOrder)
    
    for(let i = 0; i < 7; i++){
        draft.push(JSON.parse(JSON.stringify(draftOrder)));
    }
    console.log(draft)
        //change picks based on trades:
    for(let i = 0; i < 7; i++){ //i = round
        for(let l = 0; l < draftOrder.length; l++){ //l = pick
            for(let j = 0; j < lastYearStandings.length; j++){ //j = teams
                if(draft[i][l] == j){
                    draft[i][l] = gameData.teams[j].ownerOfTeamPicks[0][i]
                }
            }
        }
    }
    
    
    
    
    //joueurs disponibles dans la draft class
    /* for(let i = 0; i < 2000; i++){
        let potential = Math.ceil(Math.pow(randn_bm() + 0.155, 1.75) * 100);
        let developpmentYears = Math.floor(randn_bm() * 8);
        let randomName = firstName.data[Math.floor(Math.random() * firstName.data.length)] + " " + lastName.data[Math.floor(Math.random() * lastName.data.length)];
        draftClass.push({
            potential: potential,
            developpmentYears: developpmentYears,
            name: randomName
        });
    }
    
    draftClass.sort(function(left,right){
        if(left.potential > right.potential){
            return -1;
        }
        else if(left.potential < right.potential){
            return 1;
        }
        else{
            if(left.developpmentYears > right.developpmentYears){
                return 1;
            }
            else{
                return -1;
            }
        }
    })
    
    for(let i = 0; i < 50; i++){
        let random_player = draftClass.splice(Math.floor(Math.random() * 150), 1);
        let random_place = Math.floor(Math.random() * 150);
        draftClass.splice(random_place, 0, random_player[0]);
    } */
}
else{
    //draft order: by standings and playoff round loss
        let lastYearStandings = standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "Pts");
        //teams that missed the playoffs
        for(let i = lastYearStandings.length - 1; i >= 0; i--){
            if(!gameData.seasons[season].postSeasonSchedule.teamsInPlayoffs.includes(lastYearStandings[i].id)){
                draftOrder.push(lastYearStandings[i].id);
            }
        }
            //teams that lost before the finals
        for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.conference[0].length; j++){
            let roundLosers = []
            for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.conference.length; i++){
                for(let k = 0; k < gameData.seasons[season].postSeasonSchedule.conference[i][j].matchups.length; k++){
                    roundLosers.push(gameData.seasons[season].postSeasonSchedule.conference[i][j].matchups[k].loser);
                }
            }
            roundLosers.sort(function(left, right){
                let indexOfLeft;
                let indexOfRight;
                for(let i = 0; i < lastYearStandings.length; i++){
                    if(lastYearStandings[i].id == left){
                        indexOfLeft = i;
                    }
                    if(lastYearStandings[i].id == right){
                        indexOfRight = i;
                    }
                }
                if(indexOfLeft > indexOfRight){
                    return -1;
                }
                else{
                    return 1;
                }
            })
            draftOrder = draftOrder.concat(roundLosers);
        }
            //teams that lost in the finals
        for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.finals.length; i++){
            let roundLosers = [];
            for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.finals[i].matchups.length; j++){
                roundLosers.push(gameData.seasons[season].postSeasonSchedule.finals[i].matchups[j].loser);
            }
            roundLosers.sort(function(left, right){
                if(lastYearStandings[roundLosers[left]].index() > lastYearStandings[roundLosers[right]].index){
                    return -1;
                }
                else{
                    return 1;
                }
            })
            draftOrder = draftOrder.concat(roundLosers);
        }
            //team that won
        draftOrder.push(gameData.seasons[season].postSeasonSchedule.finals[gameData.seasons[season].postSeasonSchedule.finals.length - 1].matchups[0].winner);
    
    //draft:
    for(let i = 0; i < 7; i++){
        let newDraftOrder = []
        for(let j = 0; j < draftOrder.length; j++){
            newDraftOrder.push(gameData.seasons[season].draft.picks[draftOrder.length * i + j].team)
        }
        draft.push(newDraftOrder);
    }


}

//distribution de gauss
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}



//partie graphique:

let title = document.createElement("h2");
title.innerText = `${gameData.seasons[season].endDate} draft`;
title.style.textAlign = "center";
document.body.appendChild(title)

let draftDiv = document.createElement("div");
document.body.appendChild(draftDiv)
draftRound(0,draftDiv);



let newSeasonButton = document.createElement("button");
newSeasonButton.innerText = "New Season";
if(season != gameData.seasons.length - 1){
    newSeasonButton.style.display = "none";    
}
else if(gameData.seasons[season].draft.completed == "yes"){
    newSeasonButton.style.display = "inline-block";
}
else{
    newSeasonButton.style.display = "none";
}
newSeasonButton.addEventListener("click", () => {
    gameData = JSON.stringify(gameData);
    sessionStorage.setItem("gameData", gameData);
    location.href = "../newSeason/newSeason.html";
});
document.body.appendChild(newSeasonButton)

let nextPick = document.createElement("button");
nextPick.innerText = "Next Pick";
if(gameData.seasons[season].draft.completed == "yes"){
    nextPick.style.display = "none";
}
nextPick.addEventListener("click", () => {
    draftDiv.innerHTML = "";
    gameData.seasons[season].draft.currentRound = Math.floor(gameData.seasons[season].draft.picks.length / gameData.seasons[season].teams.allTeams.length)
    console.log(gameData.seasons[season].draft.currentRound)
    console.log(gameData.seasons[season].draft.picks.length)
    pick(gameData.seasons[season].draft.currentPick, gameData.seasons[season].draft.currentRound);
    gameData.seasons[season].draft.currentPick++;
    if(gameData.seasons[season].draft.currentPick % draftOrder.length == 0){
        draftRound(gameData.seasons[season].draft.currentRound, draftDiv);
        gameData.seasons[season].draft.currentRound++;
    }
    else{
        draftRound(gameData.seasons[season].draft.currentRound, draftDiv);
    }
    if(gameData.seasons[season].draft.currentPick == draftOrder.length * 7){
        nextPick.style.display = "none";
        endDraft();
    }
})
document.body.appendChild(nextPick);

//pour chaque round
function draftRound(round, container){
    let roundIndicator = document.createElement("div");
    roundIndicator.innerText = `Round ${round + 1}`;
    container.appendChild(roundIndicator);
    
    let draftRoundDiv = document.createElement("div");
    draftRoundDiv.className = "draftRoundRow";
    container.appendChild(draftRoundDiv);

    for(let i = 0; i < draftOrder.length; i++){
        let draftRoundSquare = document.createElement("div");
        draftRoundSquare.className = "draftRoundSquare";
        let logo = document.createElement("img");
        logo.src = ".." + gameData.teams[draftOrder[i]].logo + ".png";
        logo.style.maxWidth = "48px";
        logo.style.maxHeight = "48px"
        draftRoundSquare.appendChild(logo)
        draftRoundDiv.appendChild(draftRoundSquare);
        if(i % 2 == 0){
            draftRoundSquare.style.backgroundColor = "lightgray";
        }
    }

    //create draft-grid for players
    let draftGrid = document.createElement("div");
    draftGrid.className = "draftGrid";
    container.appendChild(draftGrid);

    for(let i = -1; i < draftOrder.length; i++){
        if(i == -1){
            let draftNumber = document.createElement("div");
            draftNumber.className = "draftGridSquare";
            draftNumber.innerText = `Ovr`;
            draftGrid.appendChild(draftNumber);

            let originalTeam = document.createElement("div");
            originalTeam.innerText = "Original Team";
            originalTeam.className = "draftGridSquare";
            draftGrid.appendChild(originalTeam);
    
            let teamName = document.createElement("div");
            teamName.className = "draftGridSquare";
            teamName.id = "name";
            teamName.innerText = "Team";
            draftGrid.appendChild(teamName);
    
            let player = document.createElement("div");
            player.className = "draftGridSquare";
            player.innerText = "Player Name"
            draftGrid.appendChild(player);
    
            let potential = document.createElement("div");
            potential.className = "draftGridSquare";
            potential.innerText = "Pot"
            draftGrid.appendChild(potential);
        }
        else{
            let draftNumber = document.createElement("div");
            draftNumber.className = "draftGridSquare";
            draftNumber.innerText = `${i + 1 + (round) * draftOrder.length}`;
            draftGrid.appendChild(draftNumber);

            let originalTeam = document.createElement("div");
            originalTeam.className = "draftGridSquare";
            draftGrid.appendChild(originalTeam);

            let logoOfOriginalTeam = document.createElement("img");
            logoOfOriginalTeam.className = "logo";
            logoOfOriginalTeam.id = "logo";
            logoOfOriginalTeam.src = ".." + gameData.teams[draftOrder[i]].logo + ".png";
            originalTeam.appendChild(logoOfOriginalTeam);  
    
            let teamName = document.createElement("div");
            teamName.className = "draftGridSquare";
            teamName.id = "name";
            teamName.innerText = gameData.teams[draft[round][i]].name;
            draftGrid.appendChild(teamName);
            //logo of team
            let logo = document.createElement("img");
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + gameData.teams[draft[round][i]].logo + ".png";
            teamName.appendChild(logo);  
    
            let player = document.createElement("div");
            player.className = "draftGridSquare";
            if(gameData.seasons[season].draft.picks[i + (round) * draftOrder.length] != undefined){
                player.innerText = gameData.seasons[season].draft.picks[i + (round) * draftOrder.length].player;
            }
            draftGrid.appendChild(player);
    
            let potential = document.createElement("div");
            potential.className = "draftGridSquare";
            if(gameData.seasons[season].draft.picks[i + (round) * draftOrder.length] != undefined){
                potential.innerText = gameData.seasons[season].draft.picks[i + (round) * draftOrder.length].potential;
            }
            draftGrid.appendChild(potential);

            
            if(i % 2 == 0){
                draftNumber.style.backgroundColor = "lightgray";
                teamName.style.backgroundColor = "lightgray";
                player.style.backgroundColor = "lightgray";
                potential.style.backgroundColor = "lightgray";
                originalTeam.style.backgroundColor = "lightgray";
            }
        }                                                                                                               
    }

    //create button for whole round + next place in draft
}

function pick(currentPick, currentRound){
    let pick = {
        team: draft[currentRound][currentPick - currentRound * draftOrder.length],
        player: draftClass[currentPick].name,
        potential: draftClass[currentPick].potential,
        developpmentYears: draftClass[currentPick].developpmentYears
    }
    gameData.seasons[season].draft.picks.push(pick);
    gameData.teams[draft[currentRound][currentPick - currentRound * draftOrder.length]].projectedPowerNextSeasons[pick.developpmentYears] += pick.potential;
}

function endDraft(){
    for(let i = 0; i < gameData.teams.length; i++){
        //redo years above/under 1:
        if(gameData.teams[i].power >= 1){
            gameData.teams[i].seasonsAbove1++;
            gameData.teams[i].seasonsBelow1 = 0;
        }
        else{
            if(gameData.teams[i].seasonsAbove1 > 0){
                let number_of_years_to_remove = Math.ceil(Math.random() * 5) + 1;
                gameData.teams[i].seasonsAbove1 -= number_of_years_to_remove;

                if(gameData.teams[i].seasonsAbove1 <= 0){
                    gameData.teams[i].seasonsAbove1 = 0;
                    gameData.teams[i].seasonsBelow1 = 1;
                }
            }
            else{
                gameData.teams[i].seasonsBelow1++;
            }
        }


        //reduce current talent (-0.1 to 0.3 drop, gauss drop)
        console.log(gameData.teams[i].name + " before " + gameData.teams[i].power);
        let drop = randn_bm() * (0.535 + gameData.teams[i].seasonsAbove1/23) - 0.12 - (0.05 * gameData.teams[i].seasonsBelow1);
        gameData.teams[i].power -= drop;
        console.log(gameData.teams[i].name + " drop " + drop);
        //push new talent
        let newTalent = gameData.teams[i].projectedPowerNextSeasons[0] / 1800;
        gameData.teams[i].power += newTalent;
        console.log(gameData.teams[i].name + " newTalent " + newTalent);
        console.log(gameData.teams[i].name + " after " + gameData.teams[i].power);
        //remove new talent from talent pool and add next year's
        gameData.teams[i].projectedPowerNextSeasons.shift();
        gameData.teams[i].projectedPowerNextSeasons.push(0);
        //change of potential in the next seasons
        for(let j = 0; j < 7; j++){
            let dropPotential = randn_bm() * 80 - 28;
            gameData.teams[i].projectedPowerNextSeasons[j] -= dropPotential;
        }
    }
    //add picks for next Season and remove picks from this season:
    for(let i = 0; i < gameData.teams.length; i++){
        gameData.teams[i].ownerOfTeamPicks.shift();
        gameData.teams[i].ownerOfTeamPicks.push([i,i,i,i,i,i,i])
    }


    gameData.seasons[season].draft.completed = "yes";

    newSeasonButton.style.display = "inline-block";
}

//previous Round
let previousRound = document.createElement("button");
previousRound.innerText = "Previous Round";
previousRound.addEventListener("click", () => {
    if(gameData.seasons[season].draft.currentRound != 0){
        draftDiv.innerHTML = "";
        gameData.seasons[season].draft.currentRound--;
        draftRound(gameData.seasons[season].draft.currentRound, draftDiv);
    }
});
document.body.appendChild(previousRound);

//next Round
let nextRound = document.createElement("button");
nextRound.innerText = "Next Round";
nextRound.addEventListener("click", () => {
    if(gameData.seasons[season].draft.currentRound != 6){
        draftDiv.innerHTML = "";
        gameData.seasons[season].draft.currentRound++;
        draftRound(gameData.seasons[season].draft.currentRound, draftDiv);
    }
});
document.body.appendChild(nextRound);