const standings = require('../functions/standings.js');
const events = require("../season/events/events.js")
let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");

//events:
    //background
    let eventBackground = document.createElement("div");
    eventBackground.className = "eventBackground";
    eventBackground.addEventListener("click", () =>{
        eventDiv.style.display = "none";
        eventBackground.style.opacity = "0";
        eventBackground.style.display = "none";
    })
    eventBackground.style.display = "none"
    document.body.appendChild(eventBackground);
        //container
    let eventDiv = document.createElement("div");
    eventDiv.className = "eventContainer";
    document.body.appendChild(eventDiv);
    eventDiv.style.display = "none";

let draftOrder = [];
let draftOrderFirstRound = []
let draft= []
let draftClass = gameData.seasons[season].draft.draftClass;                                                
if(gameData.seasons[season].draft.completed == "no"){
    let lastYearStandings = standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "Pts");
    
    //draft order: by standings and playoff round loss
        //teams that missed the playoffs
    let numberOfTeamsOutOfPlayoffs = 0;
    for(let i = lastYearStandings.length - 1; i >= 0; i--){
        if(!gameData.seasons[season].postSeasonSchedule.teamsInPlayoffs.includes(lastYearStandings[i].id)){
            draftOrder.push(lastYearStandings[i].id);
            numberOfTeamsOutOfPlayoffs++;
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
    
        //lottery Pick (if lottery)
    if(gameData.seasons[season].postSeasonSchedule.rules.draftLottery == "true"){
        if(gameData.seasons[season].draft.draftLottery.length == 0){
            //odds: (each team has one more lottery "ball" than the one bellow them in the standings)
            let odds = [];
            let numberOfLotteryBalls = 0;
            for(let i = lastYearStandings.length - 1; i >= lastYearStandings.length - numberOfTeamsOutOfPlayoffs; i--){
                for(let j = 0; j < numberOfTeamsOutOfPlayoffs - numberOfLotteryBalls; j++){
                    odds.push(lastYearStandings[i].id);
                }
                numberOfLotteryBalls++
            }
            let totalNumberOfOdds = odds.length;
            console.log(odds)
            //pick the winner for each lottery spot and change them in the first round
            for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.rules.draftLotteryNumberOfSpots; i++){
                let lotteryWinner = odds[Math.floor(Math.random() * odds.length)];
                gameData.seasons[season].draft.draftLottery.push(lotteryWinner);
                console.log(lotteryWinner)
                draft[0].splice(i, 0, lotteryWinner);
                for(let j = i + 1; j < draft[0].length; j++){
                    if(draft[0][j] == lotteryWinner){
                        draft[0].splice(j, 1);
                    }
                }
                //remove the chance that winner winns again:
                let j = 0;
                while(j < odds.length){
                    if (odds[j] == lotteryWinner) {
                        odds.splice(j, 1);
                    }
                    else {
                        j++;
                    }
                }
            }
            fs.writeFile('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
                if(err){
                    return console.log(err);
                }
            });
            let gameDataJson = JSON.stringify(gameData);
            sessionStorage.setItem("gameData", gameDataJson);

            //print Event:
            let eventDescription = `The ${gameData.seasons[season].endDate} draft lottery has occurred. These were the odds:\n`;
            numberOfLotteryBalls = 0;
            for(let i = lastYearStandings.length - 1; i >= lastYearStandings.length - numberOfTeamsOutOfPlayoffs; i--){
                console.log(numberOfTeamsOutOfPlayoffs)
                console.log(numberOfLotteryBalls)
                    eventDescription += `- ${gameData.teams[lastYearStandings[i].id].name}: ${((numberOfTeamsOutOfPlayoffs - numberOfLotteryBalls) / totalNumberOfOdds * 100).toFixed(2).replace(/[.,]00$/, "")} %\n`
                
                numberOfLotteryBalls++
            }
            let eventEffects = `\n\nThe lottery picked:\n`;
            for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.rules.draftLotteryNumberOfSpots; i++){
                if(i == 0){
                    eventEffects += `1st overall: ${gameData.teams[draft[0][i]].name}\n`;
                }
                else if(i == 1){
                    eventEffects += `2nd overall: ${gameData.teams[draft[0][i]].name}\n`;
                }
                else if(i == 2){
                    eventEffects += `3rd overall: ${gameData.teams[draft[0][i]].name}\n`;
                }
                else{
                    eventEffects += `${i + 1}th overall: ${gameData.teams[draft[0][i]].name}\n`;
                }
            }
            events.events(eventDiv, eventBackground, "Draft Lottery !", eventDescription, eventEffects)
        }
        else{
            for(let i = gameData.seasons[season].draft.draftLottery.length - 1; i >= 0; i--){
                console.log(gameData.seasons[season].draft.draftLottery[i])
                let index = draft[0].indexOf(gameData.seasons[season].draft.draftLottery[i])
                draft[0].splice(index, 1);
                draft[0].unshift(gameData.seasons[season].draft.draftLottery[i]);
            }

        }
    }
    draftOrderFirstRound = JSON.parse(JSON.stringify(draft[0]));

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

    draftOrderFirstRound = JSON.parse(JSON.stringify(draftOrder))
    if(season >= 52){
        for(let i = gameData.seasons[season].draft.draftLottery.length - 1; i >= 0; i--){
            let index = draftOrderFirstRound.indexOf(gameData.seasons[season].draft.draftLottery[i])
            draftOrderFirstRound.splice(index, 0)
            draftOrderFirstRound.unshift(gameData.seasons[season].draft.draftLottery[i]);
        }
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

gameData.seasons[season].draft.currentRound = 0;



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

            if(round == 0){
                let logoOfOriginalTeam = document.createElement("img");
                logoOfOriginalTeam.className = "logo";
                logoOfOriginalTeam.id = "logo";
                logoOfOriginalTeam.src = ".." + gameData.teams[draftOrderFirstRound[i]].logo + ".png";
                originalTeam.appendChild(logoOfOriginalTeam);  
            }
            else{
                let logoOfOriginalTeam = document.createElement("img");
                logoOfOriginalTeam.className = "logo";
                logoOfOriginalTeam.id = "logo";
                logoOfOriginalTeam.src = ".." + gameData.teams[draftOrder[i]].logo + ".png";
                originalTeam.appendChild(logoOfOriginalTeam);  
            }
    
            let teamName = document.createElement("div");
            teamName.className = "draftGridSquare";
            teamName.id = "name";
            console.log(draft[round][i])
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
    let potentialVariation = Math.round(Math.random() * 20 - 10);
    let pick = {
        team: draft[currentRound][currentPick - currentRound * draftOrder.length],
        player: draftClass[currentPick].name,
        potential: draftClass[currentPick].potential + potentialVariation,
        developpmentYears: draftClass[currentPick].developpmentYears
    }
    gameData.seasons[season].draft.picks.push(pick);
    if(pick.potential >= 90){
        pick.potential *= 1.5
    }
    else if(pick.potential >= 80){
        pick.potential *= 1.25
    }
    if(pick.potential >= 50){
        gameData.teams[draft[currentRound][currentPick - currentRound * draftOrder.length]].projectedPowerNextSeasons[pick.developpmentYears] += pick.potential;
    }
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
        let drop = randn_bm() * (0.5 + gameData.teams[i].seasonsAbove1/20) - 0.10 - (0.07 * gameData.teams[i].seasonsBelow1);
        gameData.teams[i].power -= drop;
        console.log(gameData.teams[i].name + " drop " + drop);
        //push new talent
        let newTalent = gameData.teams[i].projectedPowerNextSeasons[0] / 2000;
        gameData.teams[i].power += newTalent;
        console.log(gameData.teams[i].name + " newTalent " + newTalent);
        console.log(gameData.teams[i].name + " after " + gameData.teams[i].power);
        //remove new talent from talent pool and add next year's
        gameData.teams[i].projectedPowerNextSeasons.shift();
        gameData.teams[i].projectedPowerNextSeasons.push(0);
        //change of potential in the next seasons
        for(let j = 0; j < 7; j++){
            let dropPotential = randn_bm() * 90 - 28;
            gameData.teams[i].projectedPowerNextSeasons[j] -= dropPotential;
        }
        //add minimal strength:
        if(gameData.teams[i].power < 0.25){
            gameData.teams[i].power = 0.25;
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
        console.log(gameData.seasons[season].draft.currentRound)
        draftRound(gameData.seasons[season].draft.currentRound, draftDiv);
    }
});
document.body.appendChild(nextRound);


