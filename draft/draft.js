const standings = require('../functions/standings.js');
let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");


let firstName = JSON.parse(fs.readFileSync('nameDb/firstName.json', "utf-8", function (err,data) {
  if (err) {
    return console.log(err);
  }
}));
let lastName = JSON.parse(fs.readFileSync('nameDb/lastName.json', "utf-8", function (err,data) {
    if (err) {
      return console.log(err);
    }
}));

let lastYearStandings = standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "Pts");

//draft order: by standings and playoff round loss
let draftOrder = [];
    //teams that missed the playoffs
for(let i = lastYearStandings.length - 1; i >= 0; i--){
    console.log(lastYearStandings[i].id)
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
    console.log(roundLosers)
    console.log(lastYearStandings)
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
    console.log(roundLosers)
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
    console.log(roundLosers)
    draftOrder = draftOrder.concat(roundLosers);
}
    //team that won
draftOrder.push(gameData.seasons[season].postSeasonSchedule.finals[gameData.seasons[season].postSeasonSchedule.finals.length - 1].matchups[0].winner);
console.log(draftOrder)




//joueurs disponibles dans la draft class
let draftClass = [];                                                //5* 90, 10 * 80, 15 * 70, 20 * 60, 30 * 50
for(let i = 0; i < 1000; i++){
    let potential = Math.ceil(Math.pow(randn_bm() + 0.155, 1.75) * 100);
    let developpmentYears = Math.floor(randn_bm() * 6);
    let randomName = firstName.data[Math.floor(Math.random() * firstName.data.length)] + " " + lastName.data[Math.floor(Math.random() * lastName.data.length)];
    draftClass.push({
        potential: potential,
        developpmentYears: developpmentYears,
        name: randomName
    });
}
console.log(draftClass)

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
title.innerText = `${gameData.seasons[gameData.seasons.length - 1].endDate} draft`;
title.style.textAlign = "center";
document.body.appendChild(title)

let draftDiv = document.createElement("div");
document.body.appendChild(draftDiv)
draftRound(0,draftDiv);

let currentRound = 0;
let currentPick = 0;


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
    pick(currentPick, currentRound);
    currentPick++;
    if(currentPick % draftOrder.length == 0){
        draftRound(currentRound, draftDiv);
        currentRound++;
    }
    else{
        draftRound(currentRound, draftDiv);
    }
    if(currentPick == draftOrder.length * 7){
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
    
            let teamName = document.createElement("div");
            teamName.className = "draftGridSquare";
            teamName.id = "name";
            teamName.innerText = gameData.teams[draftOrder[i]].name;
            draftGrid.appendChild(teamName);
            //logo of team
            let logo = document.createElement("img");
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + gameData.teams[draftOrder[i]].logo + ".png";
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
            }
        }                                                                                                               
    }

    //create button for whole round + next place in draft
}

function pick(currentPick, currentRound){
    let pick = {
        team: draftOrder[currentPick - currentRound * draftOrder.length],
        player: draftClass[currentPick].name,
        potential: draftClass[currentPick].potential,
        developpmentYears: draftClass[currentPick].developpmentYears
    }
    gameData.seasons[season].draft.picks.push(pick);
    gameData.teams[draftOrder[currentPick - currentRound * draftOrder.length]].projectedPowerNextSeasons[pick.developpmentYears] += pick.potential;
}

function endDraft(){
    for(let i = 0; i < gameData.teams.length; i++){
        //redo years above/under 1:
        if(gameData.teams[i].power >= 1){
            console.log("here");
            gameData.teams[i].seasonsAbove1++;
            gameData.teams[i].seasonsBelow1 = 0;
        }
        else{
            console.log("here2")
            gameData.teams[i].seasonsBelow1++;
            gameData.teams[i].seasonsAbove1 = 0;
        }
        //reduce current talent (-0.1 to 0.3 drop, gauss drop)
        console.log(gameData.teams[i].name + " before " + gameData.teams[i].power);
        let drop = randn_bm() * (0.5 + gameData.teams[i].seasonsAbove1/35) - 0.1 - (0.05 * gameData.teams[i].seasonsBelow1);
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
        for(let j = 0; j < 5; j++){
            let dropPotential = randn_bm() * 80 - 30;
            gameData.teams[i].projectedPowerNextSeasons[j] -= dropPotential;
        }
    }
    gameData.seasons[season].draft.completed = "yes";

    newSeasonButton.style.display = "inline-block";
}

//previous Round
let previousRound = document.createElement("button");
previousRound.innerText = "Previous Round";
previousRound.addEventListener("click", () => {
    if(currentRound != 0){
        draftDiv.innerHTML = "";
        currentRound--;
        draftRound(currentRound, draftDiv);
    }
});
document.body.appendChild(previousRound);

//next Round
let nextRound = document.createElement("button");
nextRound.innerText = "Next Round";
nextRound.addEventListener("click", () => {
    if(currentRound != 6){
        draftDiv.innerHTML = "";
        currentRound++;
        draftRound(currentRound, draftDiv);
    }
});
document.body.appendChild(nextRound);