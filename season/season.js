
const dice = require("./dice.js");
const recordsPostSeason = require("./recordsPostSeason.js");
const recordsSeason = require("./recordsSeason.js");
const events = require("./events/events.js")
const standingsFunctions = require("../functions/standings.js");
const { testAllTimeRecords } = require("./recordsAllTime.js");
let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");

let gameContents = document.createElement("div");
gameContents.className = "season_gameContents";
document.body.appendChild(gameContents);

let seasonContainer = document.createElement("div");
seasonContainer.className = "season_seasonContainer";
gameContents.appendChild(seasonContainer);  

let homeAwayFactor = "All";
let endDate = gameData.seasons[season].endDate;
let startDate = parseInt(gameData.seasons[season].endDate) - 1;
let seasonTitle = document.createElement("h3");
seasonTitle.innerText = `${startDate}-${endDate} Season (${season})`
seasonContainer.appendChild(seasonTitle);

let standingsContainerContainer = document.createElement("div");
let standingsContainer = document.createElement("div");
let boolTradeLog = false;
let boolPowerRankings = false;
let boolPredictions = false;
let boolStandings = true;

 
const conferenceNumber = gameData.seasons[season].teams.conference.length;
const divisionNumber = gameData.seasons[season].teams.conference[0].divisions.length;


let previousTrades = document.createElement("div");
previousTrades.className = "season_leftSideContainers"

let lastYearWinner
if(season <= 12 && season != 0){
    lastYearWinner = gameData.seasons[season - 1].postSeasonSchedule[1].matchups[0].winner;
}
else if(season > 11){
    lastYearWinner = gameData.seasons[season - 1].postSeasonSchedule.finals[gameData.seasons[season - 1].postSeasonSchedule.finals.length - 1].matchups[0].winner;
}
let lastYearPlayoffs
if(season > 11){
    lastYearPlayoffs = gameData.seasons[season - 1].postSeasonSchedule.teamsInPlayoffs
}

let sortingType = "Pts";

function count(gameData, season, round, teamId, countType){
    let victoriesHome = 0;
    let victoriesAway = 0;
    let defeatsHome = 0;
    let defeatsAway = 0;
    let tiesHome = 0;
    let tiesAway = 0;
    let goalsScoredHome = 0;
    let goalsScoredAway = 0;
    let goalsAgainstHome = 0;
    let goalsAgainstAway = 0;
    let shutoutsHome = 0;
    let shutoutsAway = 0;
    let schedule = gameData.seasons[season].schedule;
    for(let i = 0; i <= round; i++){
        for(let j = 0; j < schedule[i].games.length; j++){
            if(schedule[i].games[j].team1Id == teamId && schedule[i].games[j].team1Goals != ""){
                if(Number(schedule[i].games[j].team1Goals) > Number(schedule[i].games[j].team2Goals)){
                    victoriesHome++;
                }
                else if(Number(schedule[i].games[j].team1Goals) == Number(schedule[i].games[j].team2Goals)){
                    tiesHome++;
                }
                else if(Number(schedule[i].games[j].team1Goals) < Number(schedule[i].games[j].team2Goals)){
                    defeatsHome++;
                }
                goalsScoredHome += parseInt(schedule[i].games[j].team1Goals);
                goalsAgainstHome += parseInt(schedule[i].games[j].team2Goals);
                if(Number(schedule[i].games[j].team2Goals) == 0){
                    shutoutsHome++;
                }
            }
            else if(schedule[i].games[j].team2Id == teamId && schedule[i].games[j].team1Goals != ""){
                if(Number(schedule[i].games[j].team1Goals) > Number(schedule[i].games[j].team2Goals)){
                    defeatsAway++;
                }
                else if(Number(schedule[i].games[j].team1Goals) == Number(schedule[i].games[j].team2Goals)){
                    tiesAway++;
                }
                else if(Number(schedule[i].games[j].team1Goals) < Number(schedule[i].games[j].team2Goals)){
                    victoriesAway++;
                }
                goalsScoredAway += parseInt(schedule[i].games[j].team2Goals);
                goalsAgainstAway += parseInt(schedule[i].games[j].team1Goals);
                if(Number(schedule[i].games[j].team1Goals) == 0){
                    shutoutsAway++;
                }
            }
        }
    }
    switch(countType){
        case "victoriesHome": return victoriesHome; 
        case "victoriesAway": return victoriesAway;
        case "defeatsHome": return defeatsHome;
        case "defeatsAway": return defeatsAway;
        case "tiesHome": return tiesHome;
        case "tiesAway": return tiesAway;
        case "goalsScoredHome": return goalsScoredHome;
        case "goalsScoredAway": return goalsScoredAway;
        case "goalsAgaistHome": return goalsAgainstHome;
        case "goalsAgaistAway": return goalsAgainstAway;
        case "shutoutsHome": return shutoutsHome;
        case "shutoutsAway": return shutoutsAway;
    }
}

function standings (gameData, teamChoice, season, round, sortingType){
    let teams = [];
    for(let i = 0; i < teamChoice.length; i++){
        teamId = teamChoice[i].id;
        const teamData = {
            id : teamId, //par rapport à l'id des équipes en jeu cette saison la
            name : gameData.teams[teamId].name,
            logo : gameData.teams[teamId].logo,
            color : gameData.teams[teamId].color,
            victoriesHome : count(gameData, season, round, teamId, "victoriesHome"),
            victoriesAway : count(gameData, season, round, teamId, "victoriesAway"),
            defeatsHome : count(gameData, season, round, teamId, "defeatsHome"),
            defeatsAway : count(gameData, season, round, teamId, "defeatsAway"),
            tiesHome : count(gameData, season, round, teamId, "tiesHome"),
            tiesAway : count(gameData, season, round, teamId, "tiesAway"),
            goalsScoredHome : count(gameData, season, round, teamId, "goalsScoredHome"),
            goalsScoredAway : count(gameData, season, round, teamId, "goalsScoredAway"),
            goalsAgainstHome : count(gameData, season, round, teamId, "goalsAgaistHome"),
            goalsAgainstAway : count(gameData, season, round, teamId, "goalsAgaistAway"),
            shutoutsHome : count(gameData, season, round, teamId, "shutoutsHome"),
            shutoutsAway : count(gameData, season, round, teamId, "shutoutsAway"),
            victories : function() {return this.victoriesAway + this.victoriesHome},
            defeats :  function() {return this.defeatsHome + this.defeatsAway},
            ties : function() {return this.tiesHome + this.tiesAway},
            goalsScored : function() {return this.goalsScoredHome + this.goalsScoredAway},
            goalsAgainst : function() {return this.goalsAgainstHome + this.goalsAgainstAway},
            shutouts : function() {return this.shutoutsHome + this.shutoutsAway},
            points : function() {return this.victories() * 3 + this.ties()},
            pointsHome : function() {return this.victoriesHome * 3 + this.tiesHome},
            pointsAway : function() {return this.victoriesAway * 3 + this.tiesAway},
            goalDifferential : function() {return this.goalsScored() - this.goalsAgainst()},
            goalDifferentialHome : function() {return this.goalsScoredHome - this.goalsAgainstHome},
            goalDifferentialAway : function() {return this.goalsScoredAway - this.goalsAgainstAway},
            gamesPlayedHome: function() {return this.victoriesHome + this.tiesHome + this.defeatsHome},
            gamesPlayedAway: function() {return this.victoriesAway + this.tiesAway + this.defeatsAway},
            gamesPlayed: function() {return this.gamesPlayedHome() + this.gamesPlayedAway()}
        }
        teams.push(teamData);
    }

    if(sortingType == "Pts"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.points() > right.points()){
                return -1;
            }
            else if (left.points() < right.points()){
                return 1;
            }
            else{
                if(left.goalDifferential() > right.goalDifferential()){
                    return -1;
                }
                else if(left.goalDifferential() < right.goalDifferential()){
                    return 1;
                }
                else{
                    if(left.goalsScored() > right.goalsScored()){
                        return -1;
                    }
                    else if(left.goalsScored() < right.goalsScored()){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "Pts%"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if((left.points() / left.gamesPlayed()) > (right.points() / right.gamesPlayed())){
                return -1;
            }
            else if ((left.points() / left.gamesPlayed()) < (right.points() / right.gamesPlayed())){
                return 1;
            }
            else{
                if(left.goalDifferential() > right.goalDifferential()){
                    return -1;
                }
                else if(left.goalDifferential() < right.goalDifferential()){
                    return 1;
                }
                else{
                    if(left.goalsScored() > right.goalsScored()){
                        return -1;
                    }
                    else if(left.goalsScored() < right.goalsScored()){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "V"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victories() > right.victories()){
                return -1;
            }
            else if (left.victories() < right.victories()){
                return 1;
            }
        });
    }
    else if(sortingType == "D"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.ties() > right.ties()){
                return -1;
            }
            else if (left.ties() < right.ties()){
                return 1;
            }
        });
    }
    else if(sortingType == "L"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.defeats() > right.defeats()){
                return -1;
            }
            else if (left.defeats() < right.defeats()){
                return 1;
            }
        });
    }
    else if(sortingType == "GD"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalDifferential() > right.goalDifferential()){
                return -1;
            }
            else if (left.goalDifferential() < right.goalDifferential()){
                return 1;
            }
        });
    }
    else if(sortingType == "GP"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.gamesPlayed() > right.gamesPlayed()){
                return -1;
            }
            else if (left.gamesPlayed() < right.gamesPlayed()){
                return 1;
            }
        });
    }
    else if(sortingType == "GF"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScored() > right.goalsScored()){
                return -1;
            }
            else if(left.goalsScored() < right.goalsScored()){
                return 1;
            }
        });
    }
    else if(sortingType == "GA"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsAgainst() > right.goalsAgainst()){
                return -1;
            }
            else if (left.goalsAgainst() < right.goalsAgainst()){
                return 1;
            }
        });
    }
    else if(sortingType == "CS"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutouts() > right.shutouts()){
                return -1;
            }
            else if (left.shutouts() < right.shutouts()){
                return 1;
            }
        });
    }
    else if(sortingType == "Team1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.name > right.name){
                return -1;
            }
            else if (left.name < right.name){
                return 1;
            }
        });
    }
    else if(sortingType == "Pts1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.points() < right.points()){
                return -1;
            }
            else if (left.points() > right.points()){
                return 1;
            }
            else{
                if(left.goalDifferential() < right.goalDifferential()){
                    return -1;
                }
                else if(left.goalDifferential() > right.goalDifferential()){
                    return 1;
                }
                else{
                    if(left.goalsScored() < right.goalsScored()){
                        return -1;
                    }
                    else if(left.goalsScored() > right.goalsScored()){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "Pts%1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if((left.points() / left.gamesPlayed()) < (right.points() / right.gamesPlayed())){
                return -1;
            }
            else if ((left.points() / left.gamesPlayed()) > (right.points() / right.gamesPlayed())){
                return 1;
            }
            else{
                if(left.goalDifferential() < right.goalDifferential()){
                    return -1;
                }
                else if(left.goalDifferential() > right.goalDifferential()){
                    return 1;
                }
                else{
                    if(left.goalsScored() < right.goalsScored()){
                        return -1;
                    }
                    else if(left.goalsScored() > right.goalsScored()){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "V1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victories() < right.victories()){
                return -1;
            }
            else if (left.victories() > right.victories()){
                return 1;
            }
        });
    }
    else if(sortingType == "D1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.ties() < right.ties()){
                return -1;
            }
            else if (left.ties() > right.ties()){
                return 1;
            }
        });
    }
    else if(sortingType == "L1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.defeats() < right.defeats()){
                return -1;
            }
            else if (left.defeats() > right.defeats()){
                return 1;
            }
        });
    }
    else if(sortingType == "GD1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalDifferential() < right.goalDifferential()){
                return -1;
            }
            else if (left.goalDifferential() > right.goalDifferential()){
                return 1;
            }
        });
    }
    else if(sortingType == "GP1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.gamesPlayed() < right.gamesPlayed()){
                return -1;
            }
            else if (left.gamesPlayed() > right.gamesPlayed()){
                return 1;
            }
        });
    }
    else if(sortingType == "GF1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScored() < right.goalsScored()){
                return -1;
            }
            else if(left.goalsScored() > right.goalsScored()){
                return 1;
            }
        });
    }
    else if(sortingType == "GA1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsAgainst() < right.goalsAgainst()){
                return -1;
            }
            else if (left.goalsAgainst() > right.goalsAgainst()){
                return 1;
            }
        });
    }
    else if(sortingType == "SO1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutouts() < right.shutouts()){
                return -1;
            }
            else if (left.shutouts() > right.shutouts()){
                return 1;
            }
        });
    }
    else if(sortingType == "Team"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.name < right.name){
                return -1;
            }
            else if (left.name > right.name){
                return 1;
            }
        });
    }

    return teams;
}

function standingsHome (gameData, teamChoice, season, round, sortingType){
    let teams = [];
    for(let i = 0; i < teamChoice.length; i++){
        teamId = teamChoice[i].id;
        const teamData = {
            id : teamId, //par rapport à l'id des équipes en jeu cette saison la
            name : gameData.teams[teamId].name,
            logo : gameData.teams[teamId].logo,
            color : gameData.teams[teamId].color,
            victoriesHome : count(gameData, season, round, teamId, "victoriesHome"),
            victoriesAway : count(gameData, season, round, teamId, "victoriesAway"),
            defeatsHome : count(gameData, season, round, teamId, "defeatsHome"),
            defeatsAway : count(gameData, season, round, teamId, "defeatsAway"),
            tiesHome : count(gameData, season, round, teamId, "tiesHome"),
            tiesAway : count(gameData, season, round, teamId, "tiesAway"),
            goalsScoredHome : count(gameData, season, round, teamId, "goalsScoredHome"),
            goalsScoredAway : count(gameData, season, round, teamId, "goalsScoredAway"),
            goalsAgainstHome : count(gameData, season, round, teamId, "goalsAgaistHome"),
            goalsAgainstAway : count(gameData, season, round, teamId, "goalsAgaistAway"),
            shutoutsHome : count(gameData, season, round, teamId, "shutoutsHome"),
            shutoutsAway : count(gameData, season, round, teamId, "shutoutsAway"),
            victories : function() {return this.victoriesAway + this.victoriesHome},
            defeats :  function() {return this.defeatsHome + this.defeatsAway},
            ties : function() {return this.tiesHome + this.tiesAway},
            goalsScored : function() {return this.goalsScoredHome + this.goalsScoredAway},
            goalsAgainst : function() {return this.goalsAgainstHome + this.goalsAgainstAway},
            shutouts : function() {return this.shutoutsHome + this.shutoutsAway},
            points : function() {return this.victories() * 3 + this.ties()},
            pointsHome : function() {return this.victoriesHome * 3 + this.tiesHome},
            pointsAway : function() {return this.victoriesAway * 3 + this.tiesAway},
            goalDifferential : function() {return this.goalsScored() - this.goalsAgainst()},
            goalDifferentialHome : function() {return this.goalsScoredHome - this.goalsAgainstHome},
            goalDifferentialAway : function() {return this.goalsScoredAway - this.goalsAgainstAway},
            gamesPlayedHome: function() {return this.victoriesHome + this.tiesHome + this.defeatsHome},
            gamesPlayedAway: function() {return this.victoriesAway + this.tiesAway + this.defeatsAway},
            gamesPlayed: function() {return this.gamesPlayedHome() + this.gamesPlayedAway()}
        }
        teams.push(teamData);
    }

    if(sortingType == "Pts"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.pointsHome() > right.pointsHome()){
                return -1;
            }
            else if (left.pointsHome() < right.pointsHome()){
                return 1;
            }
            else{
                if(left.goalDifferentialHome() > right.goalDifferentialHome()){
                    return -1;
                }
                else if(left.goalDifferentialHome() < right.goalDifferentialHome()){
                    return 1;
                }
                else{
                    if(left.goalsScoredHome > right.goalsScoredHome){
                        return -1;
                    }
                    else if(left.goalsScoredHome < right.goalsScoredHome){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "Pts%"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if((left.pointsHome() / left.gamesPlayedHome()) > (right.pointsHome() / right.gamesPlayedHome())){
                return -1;
            }
            else if ((left.pointsHome() / left.gamesPlayedHome()) < (right.pointsHome() / right.gamesPlayedHome())){
                return 1;
            }
            else{
                if(left.goalDifferentialHome() > right.goalDifferentialHome()){
                    return -1;
                }
                else if(left.goalDifferentialHome() < right.goalDifferentialHome()){
                    return 1;
                }
                else{
                    if(left.goalsScoredHome > right.goalsScoredHome){
                        return -1;
                    }
                    else if(left.goalsScoredHome < right.goalsScoredHome){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "V"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesHome > right.victoriesHome){
                return -1;
            }
            else if (left.victoriesHome < right.victoriesHome){
                return 1;
            }
        });
    }
    else if(sortingType == "D"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.tiesHome > right.tiesHome){
                return -1;
            }
            else if (left.tiesHome < right.tiesHome){
                return 1;
            }
        });
    }
    else if(sortingType == "L"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.defeatsHome > right.defeatsHome){
                return -1;
            }
            else if (left.defeatsHome < right.defeatsHome){
                return 1;
            }
        });
    }
    else if(sortingType == "GD"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalDifferentialHome() > right.goalDifferentialHome()){
                return -1;
            }
            else if (left.goalDifferentialHome() < right.goalDifferentialHome()){
                return 1;
            }
        });
    }
    else if(sortingType == "GP"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.gamesPlayedHome() > right.gamesPlayedHome()){
                return -1;
            }
            else if (left.gamesPlayedHome() < right.gamesPlayedHome()){
                return 1;
            }
        });
    }
    else if(sortingType == "GF"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScoredHome > right.goalsScoredHome){
                return -1;
            }
            else if(left.goalsScoredHome < right.goalsScoredHome){
                return 1;
            }
        });
    }
    else if(sortingType == "GA"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsAgainstHome > right.goalsAgainstHome){
                return -1;
            }
            else if (left.goalsAgainstHome < right.goalsAgainstHome){
                return 1;
            }
        });
    }
    else if(sortingType == "CS"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutoutsHome > right.shutoutsHome){
                return -1;
            }
            else if (left.shutoutsHome < right.shutoutsHome){
                return 1;
            }
        });
    }
    else if(sortingType == "Team"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.name > right.name){
                return -1;
            }
            else if (left.name < right.name){
                return 1;
            }
        });
    }
    else if(sortingType == "Pts1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.pointsHome() < right.pointsHome()){
                return -1;
            }
            else if (left.pointsHome() > right.pointsHome()){
                return 1;
            }
            else{
                if(left.goalDifferentialHome() < right.goalDifferentialHome()){
                    return -1;
                }
                else if(left.goalDifferentialHome() > right.goalDifferentialHome()){
                    return 1;
                }
                else{
                    if(left.goalsScoredHome < right.goalsScoredHome){
                        return -1;
                    }
                    else if(left.goalsScoredHome > right.goalsScoredHome){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "Pts%1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if((left.pointsHome() / left.gamesPlayedHome()) < (right.pointsHome() / right.gamesPlayedHome())){
                return -1;
            }
            else if ((left.pointsHome() / left.gamesPlayedHome()) > (right.pointsHome() / right.gamesPlayedHome())){
                return 1;
            }
            else{
                if(left.goalDifferentialHome() < right.goalDifferentialHome()){
                    return -1;
                }
                else if(left.goalDifferentialHome() > right.goalDifferentialHome()){
                    return 1;
                }
                else{
                    if(left.goalsScoredHome < right.goalsScoredHome){
                        return -1;
                    }
                    else if(left.goalsScoredHome > right.goalsScoredHome){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "V1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesHome < right.victoriesHome){
                return -1;
            }
            else if (left.victoriesHome > right.victoriesHome){
                return 1;
            }
        });
    }
    else if(sortingType == "D1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.tiesHome < right.tiesHome){
                return -1;
            }
            else if (left.tiesHome > right.tiesHome){
                return 1;
            }
        });
    }
    else if(sortingType == "L1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.defeatsHome < right.defeatsHome){
                return -1;
            }
            else if (left.defeatsHome > right.defeatsHome){
                return 1;
            }
        });
    }
    else if(sortingType == "GD1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalDifferentialHome() < right.goalDifferentialHome()){
                return -1;
            }
            else if (left.goalDifferentialHome() > right.goalDifferentialHome()){
                return 1;
            }
        });
    }
    else if(sortingType == "GP1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.gamesPlayedHome() < right.gamesPlayedHome()){
                return -1;
            }
            else if (left.gamesPlayedHome() > right.gamesPlayedHome()){
                return 1;
            }
        });
    }
    else if(sortingType == "GF1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScoredHome < right.goalsScoredHome){
                return -1;
            }
            else if(left.goalsScoredHome > right.goalsScoredHome){
                return 1;
            }
        });
    }
    else if(sortingType == "GA1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsAgaistHome < right.goalsAgaistHome){
                return -1;
            }
            else if (left.goalsAgaistHome > right.goalsAgaistHome){
                return 1;
            }
        });
    }
    else if(sortingType == "SO1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutoutsHome < right.shutoutsHome){
                return -1;
            }
            else if (left.shutoutsHome > right.shutoutsHome){
                return 1;
            }
        });
    }
    else if(sortingType == "Team1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.name < right.name){
                return -1;
            }
            else if (left.name > right.name){
                return 1;
            }
        });
    }

    return teams;
}

function standingsAway (gameData, teamChoice, season, round, sortingType){
    let teams = [];
    for(let i = 0; i < teamChoice.length; i++){
        teamId = teamChoice[i].id;
        const teamData = {
            id : teamId, //par rapport à l'id des équipes en jeu cette saison la
            name : gameData.teams[teamId].name,
            logo : gameData.teams[teamId].logo,
            color : gameData.teams[teamId].color,
            victoriesHome : count(gameData, season, round, teamId, "victoriesHome"),
            victoriesAway : count(gameData, season, round, teamId, "victoriesAway"),
            defeatsHome : count(gameData, season, round, teamId, "defeatsHome"),
            defeatsAway : count(gameData, season, round, teamId, "defeatsAway"),
            tiesHome : count(gameData, season, round, teamId, "tiesHome"),
            tiesAway : count(gameData, season, round, teamId, "tiesAway"),
            goalsScoredHome : count(gameData, season, round, teamId, "goalsScoredHome"),
            goalsScoredAway : count(gameData, season, round, teamId, "goalsScoredAway"),
            goalsAgainstHome : count(gameData, season, round, teamId, "goalsAgaistHome"),
            goalsAgainstAway : count(gameData, season, round, teamId, "goalsAgaistAway"),
            shutoutsHome : count(gameData, season, round, teamId, "shutoutsHome"),
            shutoutsAway : count(gameData, season, round, teamId, "shutoutsAway"),
            victories : function() {return this.victoriesAway + this.victoriesHome},
            defeats :  function() {return this.defeatsHome + this.defeatsAway},
            ties : function() {return this.tiesHome + this.tiesAway},
            goalsScored : function() {return this.goalsScoredHome + this.goalsScoredAway},
            goalsAgainst : function() {return this.goalsAgainstHome + this.goalsAgainstAway},
            shutouts : function() {return this.shutoutsHome + this.shutoutsAway},
            points : function() {return this.victories() * 3 + this.ties()},
            pointsHome : function() {return this.victoriesHome * 3 + this.tiesHome},
            pointsAway : function() {return this.victoriesAway * 3 + this.tiesAway},
            goalDifferential : function() {return this.goalsScored() - this.goalsAgainst()},
            goalDifferentialHome : function() {return this.goalsScoredHome - this.goalsAgainstHome},
            goalDifferentialAway : function() {return this.goalsScoredAway - this.goalsAgainstAway},
            gamesPlayedHome: function() {return this.victoriesHome + this.tiesHome + this.defeatsHome},
            gamesPlayedAway: function() {return this.victoriesAway + this.tiesAway + this.defeatsAway},
            gamesPlayed: function() {return this.gamesPlayedHome() + this.gamesPlayedAway()}
        }
        teams.push(teamData);
    }

    if(sortingType == "Pts"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.pointsAway() > right.pointsAway()){
                return -1;
            }
            else if (left.pointsAway() < right.pointsAway()){
                return 1;
            }
            else{
                if(left.goalDifferentialAway() > right.goalDifferentialAway()){
                    return -1;
                }
                else if(left.goalDifferentialAway() < right.goalDifferentialAway()){
                    return 1;
                }
                else{
                    if(left.goalsScoredAway > right.goalsScoredAway){
                        return -1;
                    }
                    else if(left.goalsScoredAway < right.goalsScoredAway){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "Pts%"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if((left.pointsAway() / left.gamesPlayedAway()) > (right.pointsAway() / right.gamesPlayedAway())){
                return -1;
            }
            else if ((left.pointsAway() / left.gamesPlayedAway()) < (right.pointsAway() / right.gamesPlayedAway())){
                return 1;
            }
            else{
                if(left.goalDifferentialAway() > right.goalDifferentialAway()){
                    return -1;
                }
                else if(left.goalDifferentialAway() < right.goalDifferentialAway()){
                    return 1;
                }
                else{
                    if(left.goalsScoredAway > right.goalsScoredAway){
                        return -1;
                    }
                    else if(left.goalsScoredAway < right.goalsScoredAway){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "V"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesAway > right.victoriesAway){
                return -1;
            }
            else if (left.victoriesAway < right.victoriesAway){
                return 1;
            }
        });
    }
    else if(sortingType == "D"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.tiesAway > right.tiesAway){
                return -1;
            }
            else if (left.tiesAway < right.tiesAway){
                return 1;
            }
        });
    }
    else if(sortingType == "L"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.defeatsAway > right.defeatsAway){
                return -1;
            }
            else if (left.defeatsAway < right.defeatsAway){
                return 1;
            }
        });
    }
    else if(sortingType == "GD"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalDifferentialAway() > right.goalDifferentialAway()){
                return -1;
            }
            else if (left.goalDifferentialAway() < right.goalDifferentialAway()){
                return 1;
            }
        });
    }
    else if(sortingType == "GP"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.gamesPlayedAway() > right.gamesPlayedAway()){
                return -1;
            }
            else if (left.gamesPlayedAway() < right.gamesPlayedAway()){
                return 1;
            }
        });
    }
    else if(sortingType == "GF"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScoredAway > right.goalsScoredAway){
                return -1;
            }
            else if(left.goalsScoredAway < right.goalsScoredAway){
                return 1;
            }
        });
    }
    else if(sortingType == "GA"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsAgainstAway > right.goalsAgainstAway){
                return -1;
            }
            else if (left.goalsAgainstAway < right.goalsAgainstAway){
                return 1;
            }
        });
    }
    else if(sortingType == "CS"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutoutsAway > right.shutoutsAway){
                return -1;
            }
            else if (left.shutoutsAway < right.shutoutsAway){
                return 1;
            }
        });
    }
    else if(sortingType == "Team1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.name > right.name){
                return -1;
            }
            else if (left.name < right.name){
                return 1;
            }
        });
    }
    else if(sortingType == "Pts1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.pointsAway() < right.pointsAway()){
                return -1;
            }
            else if (left.pointsAway() > right.pointsAway()){
                return 1;
            }
            else{
                if(left.goalDifferentialAway() < right.goalDifferentialAway()){
                    return -1;
                }
                else if(left.goalDifferentialAway() > right.goalDifferentialAway()){
                    return 1;
                }
                else{
                    if(left.goalsScoredAway < right.goalsScoredAway){
                        return -1;
                    }
                    else if(left.goalsScoredAway > right.goalsScoredAway){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "Pts%1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if((left.pointsAway() / left.gamesPlayedAway()) < (right.pointsAway() / right.gamesPlayedAway())){
                return -1;
            }
            else if ((left.pointsAway() / left.gamesPlayedAway()) > (right.pointsAway() / right.gamesPlayedAway())){
                return 1;
            }
            else{
                if(left.goalDifferentialAway() < right.goalDifferentialAway()){
                    return -1;
                }
                else if(left.goalDifferentialAway() > right.goalDifferentialAway()){
                    return 1;
                }
                else{
                    if(left.goalsScoredAway < right.goalsScoredAway){
                        return -1;
                    }
                    else if(left.goalsScoredAway > right.goalsScoredAway){
                        return 1;
                    }
                    else{
                        return -1; //à approfondir éventuellement
                    }
                }
            }
        });
    }
    else if(sortingType == "V1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesAway < right.victoriesAway){
                return -1;
            }
            else if (left.victoriesAway > right.victoriesAway){
                return 1;
            }
        });
    }
    else if(sortingType == "D1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.tiesAway < right.tiesAway){
                return -1;
            }
            else if (left.tiesAway > right.tiesAway){
                return 1;
            }
        });
    }
    else if(sortingType == "L1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.defeatsAway < right.defeatsAway){
                return -1;
            }
            else if (left.defeatsAway > right.defeatsAway){
                return 1;
            }
        });
    }
    else if(sortingType == "GD1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalDifferentialAway() < right.goalDifferentialAway()){
                return -1;
            }
            else if (left.goalDifferentialAway() > right.goalDifferentialAway()){
                return 1;
            }
        });
    }
    else if(sortingType == "GP1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.gamesPlayedAway() < right.gamesPlayedAway()){
                return -1;
            }
            else if (left.gamesPlayedAway() > right.gamesPlayedAway()){
                return 1;
            }
        });
    }
    else if(sortingType == "GF1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScoredAway < right.goalsScoredAway){
                return -1;
            }
            else if(left.goalsScoredAway > right.goalsScoredAway){
                return 1;
            }
        });
    }
    else if(sortingType == "GA1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsAgaistAway < right.goalsAgaistAway){
                return -1;
            }
            else if (left.goalsAgaistAway > right.goalsAgaistAway){
                return 1;
            }
        });
    }
    else if(sortingType == "SO1"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutoutsAway < right.shutoutsAway){
                return -1;
            }
            else if (left.shutoutsAway > right.shutoutsAway){
                return 1;
            }
        });
    }
    else if(sortingType == "Team"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.name < right.name){
                return -1;
            }
            else if (left.name > right.name){
                return 1;
            }
        });
    }

    return teams;
}

function outOfPlayOffs(gameData, season, round){
    if(season < 12){
        let teamsOutOfPlayoffs = [];
        let numberOfTeamsInPlayOffs = 4;
        let numberOfMatches = gameData.seasons[season].schedule.length - (gameData.seasons[season].teams.allTeams.length % 2) * (gameData.seasons[season].schedule.length / gameData.seasons[season].teams.allTeams.length)
        
        for(let i = numberOfTeamsInPlayOffs; i < gameData.seasons[season].teams.conference[0].teamsInConference.length; i++){ 
            let teamChoice = gameData.seasons[season].teams.conference[0].teamsInConference;
            let teams = standings(gameData, teamChoice, season, round, "Pts");
            if(teams[numberOfTeamsInPlayOffs - 1].points() > (teams[i].points() + 3 * (numberOfMatches - teams[i].gamesPlayed())) || numberOfMatches - teams[i].gamesPlayed() == 0){
                teamsOutOfPlayoffs.push(teams[i].id);
            }
        }
        return teamsOutOfPlayoffs;
    }
    else{
        let teamsOutOfPlayoffs = [];
        let numberOfTeamsInPlayOffs = gameData.seasons[season].postSeasonSchedule.rules.postSeasonTeams;
        let numberOfMatches = gameData.seasons[season].schedule.length - (gameData.seasons[season].teams.allTeams.length % 2) * (gameData.seasons[season].schedule.length / gameData.seasons[season].teams.allTeams.length)
        let numberOfMatchesPerTeam = numberOfMatches
        if(gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam){
            numberOfMatchesPerTeam = gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam;
        }
        if(gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam){
            numberOfMatchesPerTeam = gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam;
        }
        for(let j = 0; j < conferenceNumber; j++){      //!!CHANGE!! for how many wild cards and how playoff works
            for(let i = numberOfTeamsInPlayOffs / conferenceNumber; i < gameData.seasons[season].teams.conference[j].teamsInConference.length; i++){ 
                let teamChoice = gameData.seasons[season].teams.conference[j].teamsInConference;
                let teams = standings(gameData, teamChoice, season, round, "Pts");
                if(teams[numberOfTeamsInPlayOffs / conferenceNumber - 1].points() > (teams[i].points() + 3 * (numberOfMatchesPerTeam - teams[i].gamesPlayed())) || numberOfMatchesPerTeam - teams[i].gamesPlayed() == 0){
                    teamsOutOfPlayoffs.push(teams[i].id);
                }
            }
        }
        return teamsOutOfPlayoffs;
    }
}

function teamsPlayOffBound (gameData, season, round){
    let teamListPlayOffBound = [];
    if(season <= 11 && gameData.seasons[0].endDate != 1){
        let numberOfTeamsInPlayOffs = gameData.seasons[season].postSeasonSchedule[0].matchups.length * 2;
        let playOfTeamsPerDivision = numberOfTeamsInPlayOffs / (conferenceNumber * divisionNumber);
        for(let i = 0; i < playOfTeamsPerDivision; i++){
            for(let j = 0; j < conferenceNumber; j++){
                for(let k = 0; k < divisionNumber; k++){
                    let teamChoice = gameData.seasons[season].teams.conference[j].divisions[k].teams;
                    let teams = standings(gameData, teamChoice, season, round, "Pts");
                    teamListPlayOffBound.push(teams[i].id);
                }
            }
        }
        return teamListPlayOffBound;
    }
    else{
        let teamsQualifiedPerDivision = gameData.seasons[season].postSeasonSchedule.rules.teamsQualifiedPerDivision;
        let wildCardsPerConference = gameData.seasons[season].postSeasonSchedule.rules.wildCardsPerConference;
        for(let i = 0; i < teamsQualifiedPerDivision; i++){
            for(let j = 0; j < conferenceNumber; j++){
                for(let k = 0; k < divisionNumber; k++){
                    let teamChoice = gameData.seasons[season].teams.conference[j].divisions[k].teams;
                    let teams = standings(gameData, teamChoice, season, round, "Pts");
                    teamListPlayOffBound.push(teams[i].id);
                }
            }
        }
        for(let j = 0; j < conferenceNumber; j++){
            let teamList = 0;
            for(let i = 0; i < wildCardsPerConference; i++){
                let teamChoice = gameData.seasons[season].teams.conference[j].teamsInConference;
                let teams = standings(gameData, teamChoice, season, round, "Pts");
                let teamAdded = false;
                while(teamAdded == false){
                    if(teamListPlayOffBound.includes(teams[teamList].id)){
                        teamList++;
                    }
                    else{
                        teamListPlayOffBound.push(teams[teamList].id);
                        teamAdded = true;
                    }
                }
            }
        }
        
        return teamListPlayOffBound;
    }
}

function teamsPlayOffBoundStandings (gameData, season, round){
    let teamListPlayOffBound = [];
    if(season <= 11 && gameData.seasons[0].endDate != 1){
        let numberOfTeamsInPlayOffs = gameData.seasons[season].postSeasonSchedule[0].matchups.length * 2;
        let playOfTeamsPerDivision = numberOfTeamsInPlayOffs / (conferenceNumber * divisionNumber);
        for(let i = 0; i < playOfTeamsPerDivision; i++){
            for(let j = 0; j < conferenceNumber; j++){
                for(let k = 0; k < divisionNumber; k++){
                    let teamChoice = gameData.seasons[season].teams.conference[j].divisions[k].teams;
                    let teams = standings(gameData, teamChoice, season, round, "Pts");
                    teamListPlayOffBound.push(teams[i].id);
                }
            }
        }
        return teamListPlayOffBound;
    }
    else{
        let teamsQualifiedPerDivision = gameData.seasons[season].postSeasonSchedule.rules.teamsQualifiedPerDivision;
        let wildCardsPerConference = gameData.seasons[season].postSeasonSchedule.rules.wildCardsPerConference;
        
        //see if team is already qualified
        let numberOfTeamsInPlayOffs = teamListPlayOffBound.length;
        let numberOfMatches = gameData.seasons[season].schedule.length - (gameData.seasons[season].teams.allTeams.length % 2) * (gameData.seasons[season].schedule.length / gameData.seasons[season].teams.allTeams.length)
        let numberOfConferences = gameData.seasons[season].teams.conference.length;
        let numberOfDivisions = gameData.seasons[season].teams.conference[0].divisions.length;
        
        let numberOfMatchesPerTeam = numberOfMatches
        if(gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam){
            numberOfMatchesPerTeam = gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam;
        }

        for(let i = 0; i < numberOfConferences; i++){
            for(let j = 0; j < numberOfDivisions; j++){
                for(let k = 0; k < teamsQualifiedPerDivision; k++){
                    let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                    let teams = standings(gameData, teamChoice, season, round, "Pts");
                    let teamQualified = true;
                    for(let m = teamsQualifiedPerDivision; m < teams.length; m++){
                        if(teams[k].points() <= (teams[m].points() + 3 * (numberOfMatchesPerTeam - teams[m].gamesPlayed())) && numberOfMatchesPerTeam - teams[m].gamesPlayed() != 0){
                            teamQualified = false;
                        }
                    }
                    if(teamQualified){
                        teamListPlayOffBound.push(teams[k].id);
                    }
                }
            }
        }
        
        return teamListPlayOffBound;
    }
}

function printStandings(teams, placeTeams){
    let playOffTeams = teamsPlayOffBound(gameData, season, round);
    let playOffTeamsQualified = teamsPlayOffBoundStandings(gameData, season, round);
    let nonPlayOffTeams = outOfPlayOffs(gameData, season, round);
    //let playOffPlaces = gameData.seasons[season].postSeasonSchedule[0].matchups.length * 2;
    for(let i = -1; i < teams.length; i++){
        if(i == -1){
            let standingsRow = document.createElement("div");
            standingsRow.className = "gridRow";
            standingsRow.id = "row" + i;
            standingsContainer.appendChild(standingsRow);
            //place changement
            let placeChangement = document.createElement("div");
            placeChangement.className = "gridsquare";
            placeChangement.id = "placeChangement";
            placeChangement.innerText = "Chg";
            standingsRow.appendChild(placeChangement);
            //place of team
            let place = document.createElement("div");
            place.className = "gridsquare";
            place.id = "place";
            place.addEventListener("click", () => {
                if(sortingType == "Pts"){
                    sortingType = "Pts1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "Pts";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            place.innerText = "Pos";
            place.style.backgroundColor = "lightgray";
            standingsRow.appendChild(place);  
            //name of team
            let name = document.createElement("div");
            name.className = "gridsquare";
            name.id = "name";
            name.addEventListener("click", () => {
                if(sortingType == "Team"){
                    sortingType = "Team1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "Team";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            name.innerText = "Team";
            standingsRow.appendChild(name);
            //games of team
            let games = document.createElement("div");
            games.className = "gridsquare";
            games.id = "games";
            games.addEventListener("click", () => {
                if(sortingType == "GP"){
                    sortingType = "GP1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "GP";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            games.innerText = "GP";
            games.style.backgroundColor = "lightgray";
            standingsRow.appendChild(games); 
            //victories of team
            let victories = document.createElement("div");
            victories.className = "gridsquare";
            victories.id = "victories";
            victories.addEventListener("click", () => {
                if(sortingType == "V"){
                    sortingType = "V1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "V";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            victories.innerText = "V";
            standingsRow.appendChild(victories);
            //ties of team
            let ties = document.createElement("div");
            ties.className = "gridsquare";
            ties.id = "ties";
            ties.addEventListener("click", () => {
                if(sortingType == "D"){
                    sortingType = "D1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "D";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            ties.innerText = "D";
            ties.style.backgroundColor = "lightgray";
            standingsRow.appendChild(ties);
            //defeats of team
            let defeats = document.createElement("div");
            defeats.className = "gridsquare";
            defeats.id = "defeats";
            defeats.addEventListener("click", () => {
                if(sortingType == "L"){
                    sortingType = "L1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "L";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            defeats.innerText = "L";
            standingsRow.appendChild(defeats);
            //goalDifferential of team
            let goalDifferential = document.createElement("div");
            goalDifferential.className = "gridsquare";
            goalDifferential.id = "goalDifferential";
            goalDifferential.innerText = "GD";
            goalDifferential.addEventListener("click", () => {
                if(sortingType == "GD"){
                    sortingType = "GD1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "GD";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            goalDifferential.style.backgroundColor = "lightgray";
            standingsRow.appendChild(goalDifferential);
            //goalsScored of team
            let goalsScored = document.createElement("div");
            goalsScored.className = "gridsquare";
            goalsScored.id = "goalsScored";
            goalsScored.addEventListener("click", () => {
                if(sortingType == "GF"){
                    sortingType = "GF1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "GF";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            goalsScored.innerText = "GF";
            standingsRow.appendChild(goalsScored);
            //goalsAgainst of team
            let goalsAgainst = document.createElement("div");
            goalsAgainst.className = "gridsquare";
            goalsAgainst.id = "goalsAgainst";
            goalsAgainst.innerText = "GA";
            goalsAgainst.addEventListener("click", () => {
                if(sortingType == "GA"){
                    sortingType = "GA1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "GA";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            goalsAgainst.style.backgroundColor = "lightgray";
            standingsRow.appendChild(goalsAgainst);      
            //shutouts of team
            let shutouts = document.createElement("div");
            shutouts.className = "gridsquare";
            shutouts.id = "shutouts";
            shutouts.addEventListener("click", () => {
                if(sortingType == "CS"){
                    sortingType = "SO1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "CS";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            shutouts.innerText = "CS";
            standingsRow.appendChild(shutouts); 
            //pace of team
            let pace = document.createElement("div");
            pace.className = "gridsquare";
            pace.id = "pace";
            pace.addEventListener("click", () => {
                if(sortingType == "Pts%"){
                    sortingType = "Pts%1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "Pts%";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            pace.innerText = "Pace";
            pace.style.backgroundColor = "lightgray";
            standingsRow.appendChild(pace);
            //pointPercentage of team
            let pointPercentage = document.createElement("div");
            pointPercentage.className = "gridsquare";
            pointPercentage.id = "pointPercentage";
            pointPercentage.addEventListener("click", () => {
                if(sortingType == "Pts%"){
                    sortingType = "Pts%1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "Pts%";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            pointPercentage.innerText = "Pts%";
            standingsRow.appendChild(pointPercentage);
            //points of team
            let points = document.createElement("div");
            points.className = "gridsquare";
            points.id = "points";
            points.addEventListener("click", () => {
                if(sortingType == "Pts"){
                    sortingType = "Pts1";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
                else{
                    sortingType = "Pts";
                    eventDispatched = true;
                    button.dispatchEvent(new Event("click"));
                }
            })
            points.innerText = "Pts";
            points.style.backgroundColor = "lightgray";
            standingsRow.appendChild(points);

            
        }
        else{
            let standingsRow = document.createElement("div");
            standingsRow.className = "gridRow";
            standingsRow.id = "row" + i;
            standingsContainer.appendChild(standingsRow);
            //place changement
            let placeChangement = document.createElement("div");
            placeChangement.className = "gridsquare";
            placeChangement.id = "placeChangement";
            let numberOfPlaces = 0;
            if(round != 0){
                let standingsRound = standings(gameData, teams, season, round, sortingType);
                let standingsPreviousRound = standings(gameData, teams, season, round - 1, sortingType);
                let indexOfRound = 0;
                let indexOfPreviousRound = 0;
                for(let j = 0; j < standingsRound.length; j++){
                    if(standingsRound[j].id == teams[i].id){
                        indexOfRound = j;
                    }
                    if(standingsPreviousRound[j].id == teams[i].id){
                        indexOfPreviousRound = j;
                    }
                }
                numberOfPlaces = indexOfRound - indexOfPreviousRound;
            }
            if(numberOfPlaces > 0){
                placeChangement.style.backgroundColor = "red";
                placeChangement.innerText = numberOfPlaces;
            }
            else if(numberOfPlaces < 0){
                placeChangement.style.backgroundColor = "green";
                placeChangement.innerText = - numberOfPlaces;
            }
            else{
                placeChangement.innerHTML = "&nbsp";
            }
            standingsRow.appendChild(placeChangement);
            //place of team
            let place = document.createElement("div");
            place.className = "gridsquare";
            place.id = "place";
            place.style.backgroundColor = "lightgray";
            for(let j = 0; j < placeTeams.length; j++){
                if(placeTeams[j].id == teams[i].id){
                    place.innerText = j + 1;
                }
            }
            standingsRow.appendChild(place);
            //name of team
            let name = document.createElement("div");
            name.className = "gridsquare";
            name.id = "name";
            name.innerText = teams[i].name;
            if(playOffTeams.includes(teams[i].id)){
                name.style.backgroundColor = "lightgreen";
            }
            if(playOffTeamsQualified.includes(teams[i].id)){
                name.style.backgroundColor = "rgb(0, 204, 0)";
            }
            if(nonPlayOffTeams.includes(teams[i].id)){
                name.style.backgroundColor = "rgb(255, 153, 153)";
            }
            name.addEventListener("click", () => { //go to team page
                gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", teams[i].id);
                location.href = "../team/team.html";
            });
            standingsRow.appendChild(name);
            //logo of team
            let logo = document.createElement("img");
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + teams[i].logo + ".png";
            name.appendChild(logo);  
            if(teams[i].id == lastYearWinner){
                //last year winner logo
                let lastYearWinnerLogo = document.createElement("img");
                lastYearWinnerLogo.className = "logo";
                lastYearWinnerLogo.id = "logo";
                lastYearWinnerLogo.src = "../graphics/trophy/trophy.png";
                name.appendChild(lastYearWinnerLogo);  
            }
            if(lastYearPlayoffs.includes(teams[i].id)){
                let lastYearPlayoffsDiv = document.createElement("div");
                lastYearPlayoffsDiv.innerText = "P";
                lastYearPlayoffsDiv.style.font = "bold"
                name.appendChild(lastYearPlayoffsDiv); 
            }
            //games of team
            let games = document.createElement("div");
            games.className = "gridsquare";
            games.id = "games";
            games.style.backgroundColor = "lightgray";
            games.innerText = teams[i].gamesPlayed();
            standingsRow.appendChild(games); 
            //victories of team
            let victories = document.createElement("div");
            victories.className = "gridsquare";
            victories.id = "victories";
            victories.innerText = teams[i].victories();
            standingsRow.appendChild(victories);
            //ties of team
            let ties = document.createElement("div");
            ties.className = "gridsquare";
            ties.id = "ties";
            ties.style.backgroundColor = "lightgray";
            ties.innerText = teams[i].ties();
            standingsRow.appendChild(ties);
            //defeats of team
            let defeats = document.createElement("div");
            defeats.className = "gridsquare";
            defeats.id = "defeats";
            defeats.innerText = teams[i].defeats();
            standingsRow.appendChild(defeats);
            //goalDifferential of team
            let goalDifferential = document.createElement("div");
            goalDifferential.className = "gridsquare";
            goalDifferential.id = "goalDifferential";
            goalDifferential.style.backgroundColor = "lightgray";
            goalDifferential.innerText = teams[i].goalDifferential();
            standingsRow.appendChild(goalDifferential);
            //goalsScored of team
            let goalsScored = document.createElement("div");
            goalsScored.className = "gridsquare";
            goalsScored.id = "goalsScored";
            goalsScored.innerText = teams[i].goalsScored();
            standingsRow.appendChild(goalsScored);
            //goalsAgainst of team
            let goalsAgainst = document.createElement("div");
            goalsAgainst.className = "gridsquare";
            goalsAgainst.id = "goalsAgainst";
            goalsAgainst.style.backgroundColor = "lightgray";
            goalsAgainst.innerText = teams[i].goalsAgainst();
            standingsRow.appendChild(goalsAgainst);      
            //shutouts of team
            let shutouts = document.createElement("div");
            shutouts.className = "gridsquare";
            shutouts.id = "shutouts";
            shutouts.innerText = teams[i].shutouts();
            standingsRow.appendChild(shutouts); 
            //if(season >= 12){
                //pace of team
                let numberOfMatches = gameData.seasons[season].schedule.length - (gameData.seasons[season].teams.allTeams.length % 2) * (gameData.seasons[season].schedule.length / gameData.seasons[season].teams.allTeams.length)
                let numberOfMatchesPerTeam = numberOfMatches
                if(gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam){
                    numberOfMatchesPerTeam = gameData.seasons[season].postSeasonSchedule.rules.numberOfMatchesPerTeam;
                }
                let pace = document.createElement("div");
                pace.className = "gridsquare";
                pace.style.backgroundColor = "lightgray";
                pace.id = "pace";
                pace.innerText = (teams[i].points() / (teams[i].gamesPlayed()) * numberOfMatchesPerTeam).toFixed(0);
                standingsRow.appendChild(pace); 
            //}
            //pointPercentage of team
            let pointPercentage = document.createElement("div");
            pointPercentage.className = "gridsquare";
            pointPercentage.id = "pointPercentage";
            pointPercentage.innerText = (teams[i].points() / (teams[i].gamesPlayed() * 3)).toFixed(3);
            standingsRow.appendChild(pointPercentage); 
            //points of team
            let points = document.createElement("div");
            points.className = "gridsquare";
            points.id = "points";
            points.style.backgroundColor = "lightgray";
            points.innerText = teams[i].points();
            standingsRow.appendChild(points);
        }
    }
}

function printStandingsHome(teams){
    let playOffTeams = teamsPlayOffBound(gameData, season, round);
    let playOffTeamsQualified = teamsPlayOffBoundStandings(gameData, season, round);
    let nonPlayOffTeams = outOfPlayOffs(gameData, season, round);
    for(let i = -1; i < teams.length; i++){
        if(i == -1){
            let standingsRow = document.createElement("div");
            standingsRow.className = "gridRow";
            standingsRow.id = "row" + i;
            standingsContainer.appendChild(standingsRow);
            //place changement
            let placeChangement = document.createElement("div");
            placeChangement.className = "gridsquare";
            placeChangement.id = "placeChangement";
            placeChangement.innerText = "Chg";
            standingsRow.appendChild(placeChangement);
            //place of team
            let place = document.createElement("div");
            place.className = "gridsquare";
            place.id = "place";
            place.innerText = "Pos";
            place.style.backgroundColor = "lightgray";
            standingsRow.appendChild(place);  
            //name of team
            let name = document.createElement("div");
            name.className = "gridsquare";
            name.id = "name";
            name.innerText = "Team";
            standingsRow.appendChild(name);
            //games of team
            let games = document.createElement("div");
            games.className = "gridsquare";
            games.id = "games";
            games.innerText = "GP";
            games.style.backgroundColor = "lightgray";
            standingsRow.appendChild(games); 
            //victories of team
            let victories = document.createElement("div");
            victories.className = "gridsquare";
            victories.id = "victories";
            victories.innerText = "V";
            standingsRow.appendChild(victories);
            //ties of team
            let ties = document.createElement("div");
            ties.className = "gridsquare";
            ties.id = "ties";
            ties.innerText = "D";
            ties.style.backgroundColor = "lightgray";
            standingsRow.appendChild(ties);
            //defeats of team
            let defeats = document.createElement("div");
            defeats.className = "gridsquare";
            defeats.id = "defeats";
            defeats.innerText = "L";
            standingsRow.appendChild(defeats);
            //goalDifferential of team
            let goalDifferential = document.createElement("div");
            goalDifferential.className = "gridsquare";
            goalDifferential.id = "goalDifferential";
            goalDifferential.innerText = "GD";
            goalDifferential.style.backgroundColor = "lightgray";
            standingsRow.appendChild(goalDifferential);
            //goalsScored of team
            let goalsScored = document.createElement("div");
            goalsScored.className = "gridsquare";
            goalsScored.id = "goalsScored";
            goalsScored.innerText = "GF";
            standingsRow.appendChild(goalsScored);
            //goalsAgainst of team
            let goalsAgainst = document.createElement("div");
            goalsAgainst.className = "gridsquare";
            goalsAgainst.id = "goalsAgainst";
            goalsAgainst.innerText = "GA";
            goalsAgainst.style.backgroundColor = "lightgray";
            standingsRow.appendChild(goalsAgainst);      
            //shutouts of team
            let shutouts = document.createElement("div");
            shutouts.className = "gridsquare";
            shutouts.id = "shutouts";
            shutouts.innerText = "CS";
            standingsRow.appendChild(shutouts); 
            //points of team
            let points = document.createElement("div");
            points.className = "gridsquare";
            points.id = "points";
            points.innerText = "Pts";
            points.style.backgroundColor = "lightgray";
            standingsRow.appendChild(points);
            //pointPercentage of team
            let pointPercentage = document.createElement("div");
            pointPercentage.className = "gridsquare";
            pointPercentage.id = "pointPercentage";
            pointPercentage.innerText = "Pts%";
            standingsRow.appendChild(pointPercentage);
        }
        else{
            let standingsRow = document.createElement("div");
            standingsRow.className = "gridRow";
            standingsRow.id = "row" + i;
            standingsContainer.appendChild(standingsRow);
            //place changement
            let placeChangement = document.createElement("div");
            placeChangement.className = "gridsquare";
            placeChangement.id = "placeChangement";
            let numberOfPlaces = 0;
            if(round != 0){
                let standingsRound = standingsHome(gameData, teams, season, round, "Pts%");
                let standingsPreviousRound = standingsHome(gameData, teams, season, round - 1, "Pts%");
                let indexOfRound = 0;
                let indexOfPreviousRound = 0;
                for(let j = 0; j < standingsRound.length; j++){
                    if(standingsRound[j].id == teams[i].id){
                        indexOfRound = j;
                    }
                    if(standingsPreviousRound[j].id == teams[i].id){
                        indexOfPreviousRound = j;
                    }
                }
                numberOfPlaces = indexOfRound - indexOfPreviousRound;
            }
            if(numberOfPlaces > 0){
                placeChangement.style.backgroundColor = "red";
                placeChangement.innerText = numberOfPlaces;
            }
            else if(numberOfPlaces < 0){
                placeChangement.style.backgroundColor = "green";
                placeChangement.innerText = - numberOfPlaces;
            }
            else{
                placeChangement.innerHTML = "&nbsp";
            }
            standingsRow.appendChild(placeChangement);
            //place of team
            let place = document.createElement("div");
            place.className = "gridsquare";
            place.id = "place";
            place.style.backgroundColor = "lightgray";
            place.innerText = i + 1;
            standingsRow.appendChild(place);
            //name of team
            let name = document.createElement("div");
            name.className = "gridsquare";
            name.id = "name";
            name.innerText = teams[i].name;
            if(playOffTeams.includes(teams[i].id)){
                name.style.backgroundColor = "lightgreen";
            }
            if(playOffTeamsQualified.includes(teams[i].id)){
                name.style.backgroundColor = "rgb(0, 204, 0)";
            }
            if(nonPlayOffTeams.includes(teams[i].id)){
                name.style.backgroundColor = "rgb(255, 153, 153)";
            }
            standingsRow.appendChild(name);
            //logo of team
            let logo = document.createElement("img");
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + teams[i].logo + ".png";
            name.appendChild(logo);  
            if(teams[i].id == lastYearWinner){
                //last year winner logo
                let lastYearWinnerLogo = document.createElement("img");
                lastYearWinnerLogo.className = "logo";
                lastYearWinnerLogo.id = "logo";
                lastYearWinnerLogo.src = "../graphics/trophy/trophy.png";
                name.appendChild(lastYearWinnerLogo);  
            }
            if(lastYearPlayoffs.includes(teams[i].id)){
                let lastYearPlayoffsDiv = document.createElement("div");
                lastYearPlayoffsDiv.innerText = "P";
                lastYearPlayoffsDiv.style.font = "bold"
                name.appendChild(lastYearPlayoffsDiv); 
            }
            //games of team
            let games = document.createElement("div");
            games.className = "gridsquare";
            games.id = "games";
            games.style.backgroundColor = "lightgray";
            games.innerText = teams[i].gamesPlayedHome();
            standingsRow.appendChild(games); 
            //victories of team
            let victories = document.createElement("div");
            victories.className = "gridsquare";
            victories.id = "victories";
            victories.innerText = teams[i].victoriesHome;
            standingsRow.appendChild(victories);
            //ties of team
            let ties = document.createElement("div");
            ties.className = "gridsquare";
            ties.id = "ties";
            ties.style.backgroundColor = "lightgray";
            ties.innerText = teams[i].tiesHome;
            standingsRow.appendChild(ties);
            //defeats of team
            let defeats = document.createElement("div");
            defeats.className = "gridsquare";
            defeats.id = "defeats";
            defeats.innerText = teams[i].defeatsHome;
            standingsRow.appendChild(defeats);
            //goalDifferential of team
            let goalDifferential = document.createElement("div");
            goalDifferential.className = "gridsquare";
            goalDifferential.id = "goalDifferential";
            goalDifferential.style.backgroundColor = "lightgray";
            goalDifferential.innerText = teams[i].goalDifferentialHome();
            standingsRow.appendChild(goalDifferential);
            //goalsScored of team
            let goalsScored = document.createElement("div");
            goalsScored.className = "gridsquare";
            goalsScored.id = "goalsScored";
            goalsScored.innerText = teams[i].goalsScoredHome;
            standingsRow.appendChild(goalsScored);
            //goalsAgainst of team
            let goalsAgainst = document.createElement("div");
            goalsAgainst.className = "gridsquare";
            goalsAgainst.id = "goalsAgainst";
            goalsAgainst.style.backgroundColor = "lightgray";
            goalsAgainst.innerText = teams[i].goalsAgainstHome;
            standingsRow.appendChild(goalsAgainst);      
            //shutouts of team
            let shutouts = document.createElement("div");
            shutouts.className = "gridsquare";
            shutouts.id = "shutouts";
            shutouts.innerText = teams[i].shutoutsHome;
            standingsRow.appendChild(shutouts); 
            //points of team
            let points = document.createElement("div");
            points.className = "gridsquare";
            points.id = "points";
            points.style.backgroundColor = "lightgray";
            points.innerText = teams[i].pointsHome();
            standingsRow.appendChild(points);
            //pointPercentage of team
            let pointPercentage = document.createElement("div");
            pointPercentage.className = "gridsquare";
            pointPercentage.id = "pointPercentage";
            pointPercentage.innerText = (teams[i].pointsHome() / (teams[i].gamesPlayedHome() * 3)).toFixed(3);
            standingsRow.appendChild(pointPercentage); 
        }
    }
}

function printStandingsAway(teams){
    let playOffTeams = teamsPlayOffBound(gameData, season, round);
    let playOffTeamsQualified = teamsPlayOffBoundStandings(gameData, season, round);
    let nonPlayOffTeams = outOfPlayOffs(gameData, season, round);
    for(let i = -1; i < teams.length; i++){
        if(i == -1){
            let standingsRow = document.createElement("div");
            standingsRow.className = "gridRow";
            standingsRow.id = "row" + i;
            standingsContainer.appendChild(standingsRow);
            //place changement
            let placeChangement = document.createElement("div");
            placeChangement.className = "gridsquare";
            placeChangement.id = "placeChangement";
            placeChangement.innerText = "Chg";
            standingsRow.appendChild(placeChangement);
            //place of team
            let place = document.createElement("div");
            place.className = "gridsquare";
            place.id = "place";
            place.innerText = "Pos";
            place.style.backgroundColor = "lightgray";
            standingsRow.appendChild(place);  
            //name of team
            let name = document.createElement("div");
            name.className = "gridsquare";
            name.id = "name";
            name.innerText = "Team";
            standingsRow.appendChild(name);
            //games of team
            let games = document.createElement("div");
            games.className = "gridsquare";
            games.id = "games";
            games.innerText = "GP";
            games.style.backgroundColor = "lightgray";
            standingsRow.appendChild(games); 
            //victories of team
            let victories = document.createElement("div");
            victories.className = "gridsquare";
            victories.id = "victories";
            victories.innerText = "V";
            standingsRow.appendChild(victories);
            //ties of team
            let ties = document.createElement("div");
            ties.className = "gridsquare";
            ties.id = "ties";
            ties.innerText = "D";
            ties.style.backgroundColor = "lightgray";
            standingsRow.appendChild(ties);
            //defeats of team
            let defeats = document.createElement("div");
            defeats.className = "gridsquare";
            defeats.id = "defeats";
            defeats.innerText = "L";
            standingsRow.appendChild(defeats);
            //goalDifferential of team
            let goalDifferential = document.createElement("div");
            goalDifferential.className = "gridsquare";
            goalDifferential.id = "goalDifferential";
            goalDifferential.innerText = "GD";
            goalDifferential.style.backgroundColor = "lightgray";
            standingsRow.appendChild(goalDifferential);
            //goalsScored of team
            let goalsScored = document.createElement("div");
            goalsScored.className = "gridsquare";
            goalsScored.id = "goalsScored";
            goalsScored.innerText = "GF";
            standingsRow.appendChild(goalsScored);
            //goalsAgainst of team
            let goalsAgainst = document.createElement("div");
            goalsAgainst.className = "gridsquare";
            goalsAgainst.id = "goalsAgainst";
            goalsAgainst.innerText = "GA";
            goalsAgainst.style.backgroundColor = "lightgray";
            standingsRow.appendChild(goalsAgainst);      
            //shutouts of team
            let shutouts = document.createElement("div");
            shutouts.className = "gridsquare";
            shutouts.id = "shutouts";
            shutouts.innerText = "CS";
            standingsRow.appendChild(shutouts); 
            //points of team
            let points = document.createElement("div");
            points.className = "gridsquare";
            points.id = "points";
            points.innerText = "Pts";
            points.style.backgroundColor = "lightgray";
            standingsRow.appendChild(points);
            //pointPercentage of team
            let pointPercentage = document.createElement("div");
            pointPercentage.className = "gridsquare";
            pointPercentage.id = "pointPercentage";
            pointPercentage.innerText = "Pts%";
            standingsRow.appendChild(pointPercentage);
        }
        else{
            let standingsRow = document.createElement("div");
            standingsRow.className = "gridRow";
            standingsRow.id = "row" + i;
            standingsContainer.appendChild(standingsRow);
            //place changement
            let placeChangement = document.createElement("div");
            placeChangement.className = "gridsquare";
            placeChangement.id = "placeChangement";
            let numberOfPlaces = 0;
            if(round != 0){
                let standingsRound = standingsAway(gameData, teams, season, round, "Pts%");
                let standingsPreviousRound = standingsAway(gameData, teams, season, round - 1, "Pts%");
                let indexOfRound = 0;
                let indexOfPreviousRound = 0;
                for(let j = 0; j < standingsRound.length; j++){
                    if(standingsRound[j].id == teams[i].id){
                        indexOfRound = j;
                    }
                    if(standingsPreviousRound[j].id == teams[i].id){
                        indexOfPreviousRound = j;
                    }
                }
                numberOfPlaces = indexOfRound - indexOfPreviousRound;
            }
            if(numberOfPlaces > 0){
                placeChangement.style.backgroundColor = "red";
                placeChangement.innerText = numberOfPlaces;
            }
            else if(numberOfPlaces < 0){
                placeChangement.style.backgroundColor = "green";
                placeChangement.innerText = - numberOfPlaces;
            }
            else{
                placeChangement.innerHTML = "&nbsp";
            }
            standingsRow.appendChild(placeChangement);
            //place of team
            let place = document.createElement("div");
            place.className = "gridsquare";
            place.id = "place";
            place.style.backgroundColor = "lightgray";
            place.innerText = i + 1;
            standingsRow.appendChild(place);
            //name of team
            let name = document.createElement("div");
            name.className = "gridsquare";
            name.id = "name";
            name.innerText = teams[i].name;
            if(playOffTeams.includes(teams[i].id)){
                name.style.backgroundColor = "lightgreen";
            }
            if(playOffTeamsQualified.includes(teams[i].id)){
                name.style.backgroundColor = "rgb(0, 204, 0)";
            }
            if(nonPlayOffTeams.includes(teams[i].id)){
                name.style.backgroundColor = "rgb(255, 153, 153)";
            }
            standingsRow.appendChild(name);
            //logo of team
            let logo = document.createElement("img");
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + teams[i].logo + ".png";
            name.appendChild(logo);  
            if(teams[i].id == lastYearWinner){
                //last year winner logo
                let lastYearWinnerLogo = document.createElement("img");
                lastYearWinnerLogo.className = "logo";
                lastYearWinnerLogo.id = "logo";
                lastYearWinnerLogo.src = "../graphics/trophy/trophy.png";
                name.appendChild(lastYearWinnerLogo);  
            }
            if(lastYearPlayoffs.includes(teams[i].id)){
                let lastYearPlayoffsDiv = document.createElement("div");
                lastYearPlayoffsDiv.innerText = "P";
                lastYearPlayoffsDiv.style.font = "bold"
                name.appendChild(lastYearPlayoffsDiv); 
            }
            //games of team
            let games = document.createElement("div");
            games.className = "gridsquare";
            games.id = "games";
            games.style.backgroundColor = "lightgray";
            games.innerText = teams[i].gamesPlayedAway();
            standingsRow.appendChild(games); 
            //victories of team
            let victories = document.createElement("div");
            victories.className = "gridsquare";
            victories.id = "victories";
            victories.innerText = teams[i].victoriesAway;
            standingsRow.appendChild(victories);
            //ties of team
            let ties = document.createElement("div");
            ties.className = "gridsquare";
            ties.id = "ties";
            ties.style.backgroundColor = "lightgray";
            ties.innerText = teams[i].tiesAway;
            standingsRow.appendChild(ties);
            //defeats of team
            let defeats = document.createElement("div");
            defeats.className = "gridsquare";
            defeats.id = "defeats";
            defeats.innerText = teams[i].defeatsAway;
            standingsRow.appendChild(defeats);
            //goalDifferential of team
            let goalDifferential = document.createElement("div");
            goalDifferential.className = "gridsquare";
            goalDifferential.id = "goalDifferential";
            goalDifferential.style.backgroundColor = "lightgray";
            goalDifferential.innerText = teams[i].goalDifferentialAway();
            standingsRow.appendChild(goalDifferential);
            //goalsScored of team
            let goalsScored = document.createElement("div");
            goalsScored.className = "gridsquare";
            goalsScored.id = "goalsScored";
            goalsScored.innerText = teams[i].goalsScoredAway;
            standingsRow.appendChild(goalsScored);
            //goalsAgainst of team
            let goalsAgainst = document.createElement("div");
            goalsAgainst.className = "gridsquare";
            goalsAgainst.id = "goalsAgainst";
            goalsAgainst.style.backgroundColor = "lightgray";
            goalsAgainst.innerText = teams[i].goalsAgainstAway;
            standingsRow.appendChild(goalsAgainst);      
            //shutouts of team
            let shutouts = document.createElement("div");
            shutouts.className = "gridsquare";
            shutouts.id = "shutouts";
            shutouts.innerText = teams[i].shutoutsAway;
            standingsRow.appendChild(shutouts); 
            //points of team
            let points = document.createElement("div");
            points.className = "gridsquare";
            points.id = "points";
            points.style.backgroundColor = "lightgray";
            points.innerText = teams[i].pointsAway();
            standingsRow.appendChild(points);
            //pointPercentage of team
            let pointPercentage = document.createElement("div");
            pointPercentage.className = "gridsquare";
            pointPercentage.id = "pointPercentage";
            pointPercentage.innerText = (teams[i].pointsAway() / (teams[i].gamesPlayedAway() * 3)).toFixed(3);
            standingsRow.appendChild(pointPercentage); 
        }
    }
}

function layOutPostSeason(gameData, season){
    //seeding
    let teamsPlayOffBound2 = teamsPlayOffBound(gameData, season, gameData.seasons[season].schedule.length - 1);
    gameData.seasons[season].postSeasonSchedule.seeds = teamsPlayOffBound2;
    let teamChoice = [];
    for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.seeds.length; i++){
        let team = {
            id: `${gameData.seasons[season].postSeasonSchedule.seeds[i]}`
        }
        teamChoice.push(team);
    }
    let standingsSeason = standings(gameData, teamChoice, season, gameData.seasons[season].schedule.length - 1, sortingType);
    gameData.seasons[season].postSeasonSchedule.seeds.sort(function(left, right){
        let standingsId = [];
        for(let i = 0; i < standingsSeason.length; i++){
            standingsId.push(standingsSeason[i].id);
        }
        if(standingsId.indexOf(left) > standingsId.indexOf(right)){
            return 1;
        }
        else if (standingsId.indexOf(left) < standingsId.indexOf(right)){
            return -1;
        }
    });
    gameData.seasons[season].postSeasonSchedule.teamsInPlayoffs = JSON.parse(JSON.stringify(gameData.seasons[season].postSeasonSchedule.seeds)); 

    let playOffOrganisation = gameData.seasons[season].postSeasonSchedule.rules.playOffOrganisation;
    let postSeasonTeams = gameData.seasons[season].postSeasonSchedule.rules.postSeasonTeams;
    let teamsQualifiedPerDivision = gameData.seasons[season].postSeasonSchedule.rules.teamsQualifiedPerDivision;
    let wildCardsPerConference = gameData.seasons[season].postSeasonSchedule.rules.wildCardsPerConference;

    if(playOffOrganisation == "divisionalPlayoff"){
        //2nd in division vs 3rd in division, 1st against wild card     (like nhl)
        for(let i = 0; i < conferenceNumber; i++){
            for(j = 0; j < divisionNumber; j++){

            }
        }
    }   
    else if(playOffOrganisation = "conferencePlayoff"){
        //1st in conference vs 4th in conference, 2nd vs 3rd (seeding of the conference)
        let teamsInPlayoffsPerConference = postSeasonTeams / conferenceNumber;
        for(let i = 0; i < conferenceNumber; i++){
            let seedingConference = [];
            for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.seeds.length; j++){
                for(let k = 0; k < gameData.seasons[season].teams.conference[i].teamsInConference.length; k++){
                    if(gameData.seasons[season].teams.conference[i].teamsInConference[k].id == gameData.seasons[season].postSeasonSchedule.seeds[j]){
                        seedingConference.push(gameData.seasons[season].postSeasonSchedule.seeds[j]);
                    }
                }
            }
            for(let j = 0; j < teamsInPlayoffsPerConference / 2; j++){
                for(let k = 0; k < gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches; k++){
                    if(k % 2 == 0){
                        gameData.seasons[season].postSeasonSchedule.conference[i][0].matchups[j].games[k].team1Id = seedingConference[j];
                        gameData.seasons[season].postSeasonSchedule.conference[i][0].matchups[j].games[k].team2Id = seedingConference[teamsInPlayoffsPerConference - 1 -j];
                    }
                    else{
                        gameData.seasons[season].postSeasonSchedule.conference[i][0].matchups[j].games[k].team2Id = seedingConference[j];
                        gameData.seasons[season].postSeasonSchedule.conference[i][0].matchups[j].games[k].team1Id = seedingConference[teamsInPlayoffsPerConference - 1 -j];
                    }
                }
            }
        }
    }    

    //create Records:
    for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.seeds.length; i++){
        let records = gameData.seasons[season].records.postSeason;
        let team = {
            teamId: `${gameData.seasons[season].postSeasonSchedule.seeds[i]}`,
            record: 0
        }
        records.victories.mostPlayoffVictories.teams.push(team);
        records.victories.mostPlayoffVictoriesHome.teams.push(team);
        records.victories.mostPlayoffVictoriesAway.teams.push(team);
        records.victories.mostAddTimeVictories.teams.push(team);
        records.victories.mostAddTimeVictoriesHome.teams.push(team);
        records.victories.mostAddTimeVictoriesAway.teams.push(team);
        records.goals.mostGoalsScoredInPlayoffs.teams.push(team);
        records.goals.mostGoalsScoredHomeInPlayoffs.teams.push(team);
        records.goals.mostGoalsScoredAwayInPlayoffs.teams.push(team);
        records.goals.mostShutoutsInPlayoffs.teams.push(team);
        records.goals.mostShutoutsHomeInPlayoffs.teams.push(team);
        records.goals.mostShutoutsAwayInPlayoffs.teams.push(team);
    }
}

function gamesRound (gameData, season, round){   
    let matches = gameData.seasons[season].schedule[round].games;
    let teams = gameData.teams;

    for(let i = 0; i < matches.length; i++){
        if(matches[i].team1Goals == ""){
            let divMatch = document.createElement("div");
            divMatch.id = "divMatch";
            gamesDiv.appendChild(divMatch);
            
            let team1LogoContainer = document.createElement("div");
            team1LogoContainer.className = "teamLogoContainer";
            divMatch.appendChild(team1LogoContainer);
            
            let TeamLogoImg1 = document.createElement("img");
            TeamLogoImg1.src = ".." + teams[matches[i].team1Id].logo + ".png";
            TeamLogoImg1.className = "teamLogo";
            team1LogoContainer.appendChild(TeamLogoImg1);
            
            let divTeam1 = document.createElement("span");
            divTeam1.className = "teamName";
            divTeam1.innerText = " " + teams[matches[i].team1Id].name + " ";
            divTeam1.addEventListener("click", () => { //go to team page
                gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", matches[i].team1Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam1);
            
            //form
            let formTeam1 = document.createElement("div");
            divTeam1.appendChild(formTeam1);
            formTeam1.className = "form"; //!!CHANGER!!
            if(round == 0){
                formTeam1.innerHTML = "&nbsp;"
            }
            else if(round < 5){
                for(let j = round; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k] != undefined){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            else{
                for(let j = 5; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k] != undefined){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            if(divTeam1.children[0].innerHTML == ""){
                formTeam1.innerHTML = "&nbsp;"
            }

            let inputGoalsTeam1 = document.createElement("input");
            inputGoalsTeam1.min = "0";
            inputGoalsTeam1.className = "goalInput";
            inputGoalsTeam1.type = "number";
            divMatch.appendChild(inputGoalsTeam1);

            let buttonVS = document.createElement("button");
            buttonVS.innerText = "VS";
            buttonVS.addEventListener("click", () => {
                if(events.trade(eventDiv, eventBackground, gameData, round)){
                    let result = dice.diceRoll(teams[matches[i].team1Id].power + teams[matches[i].team1Id].tradePower, teams[matches[i].team2Id].power + teams[matches[i].team2Id].tradePower);
                    inputGoalsTeam1.value = result[0];
                    inputGoalsTeam2.value = result[1];
                    gameButton.dispatchEvent(new Event("click"))
                }
                if(boolTradeLog == true){
                    tradeLog(select.value)
                }
                let gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
            })
            divMatch.appendChild(buttonVS);
            
            for(let j = 0; j < teams[matches[i].team1Id].rivalries.length; j++){
                if(matches[i].team2Id == teams[matches[i].team1Id].rivalries[j].teamId && teams[matches[i].team1Id].rivalries[j].rivalType == "Sporting"){
                    buttonVS.style.border = "2px solid red";
                    buttonVS.style.borderRadius = "2px";
                }
                else if(matches[i].team2Id == teams[matches[i].team1Id].rivalries[j].teamId && teams[matches[i].team1Id].rivalries[j].rivalType == "Derby"){
                    buttonVS.style.border = "2px solid blue";
                    buttonVS.style.borderRadius = "2px";
                }
            }

            let inputGoalsTeam2 = document.createElement("input");
            inputGoalsTeam2.min = "0";
            inputGoalsTeam2.className = "goalInput";
            inputGoalsTeam2.type = "number";
            divMatch.appendChild(inputGoalsTeam2);

            let divTeam2 = document.createElement("span");
            divTeam2.className = "teamName";
            divTeam2.innerText = " " + teams[matches[i].team2Id].name + " ";
            divTeam2.addEventListener("click", () => { //go to team page
                gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", matches[i].team2Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam2);

            //form
            let formTeam2 = document.createElement("div");
            divTeam2.appendChild(formTeam2);
            formTeam2.className = "form"; //!!CHANGER!!
            if(round == 0){
                formTeam2.innerHTML = "&nbsp;"
            }
            else if(round < 5){
                for(let j = round; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k] != undefined){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            else{
                for(let j = 5; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k] != undefined){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            if(divTeam2.children[0].innerHTML == ""){
                formTeam2.innerHTML = "&nbsp;"
            }

            let team2LogoContainer = document.createElement("div");
            team2LogoContainer.className = "teamLogoContainer";
            divMatch.appendChild(team2LogoContainer);
            
            let TeamLogoImg2 = document.createElement("img");
            TeamLogoImg2.src = ".." + teams[matches[i].team2Id].logo + ".png";
            TeamLogoImg2.className = "teamLogo";
            team2LogoContainer.appendChild(TeamLogoImg2);

            let gameButton = document.createElement("button");
            gameButton.innerText = "Confirm match";
            gameButton.style.display = "none";
            gameButton.addEventListener("click", function(){
                matches[i].team1Goals = inputGoalsTeam1.value;
                matches[i].team2Goals = inputGoalsTeam2.value;
                //test records
                recordsSeason.testSeasonRecords(gameData, season, round, matches[i].team1Id, matches[i].team2Id);
                let matchEnded = 0;
                for(let j = 0; j < matches.length; j++){
                    if(matches[j].team1Goals != ""){
                        matchEnded++
                    }
                }
                button.dispatchEvent(new Event("click"));
                if(matchEnded == matches.length){
                    gameData.seasons[season].schedule[round].completed = "yes";
                    selectionOptions(gameData, season);
                    select.options[select.options.length - 2].selected = true;
                }
                //lay-out post season       
                if(gameData.seasons[season].schedule[gameData.seasons[season].schedule.length - 1].completed == "yes"){
                    layOutPostSeason(gameData, season);
                }
                if(boolTradeLog == true){
                    tradeLog(select.value);
                }
                gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
            });
            divMatch.appendChild(gameButton);
        }
        else{
            let divMatch = document.createElement("div");
            divMatch.id = "divMatch";
            gamesDiv.appendChild(divMatch);

            let team1LogoContainer = document.createElement("div");
            team1LogoContainer.className = "teamLogoContainer";
            divMatch.appendChild(team1LogoContainer);
            
            let TeamLogoImg1 = document.createElement("img");
            TeamLogoImg1.src = ".." + teams[matches[i].team1Id].logo + ".png";
            TeamLogoImg1.className = "teamLogo";
            team1LogoContainer.appendChild(TeamLogoImg1);

            let divTeam1 = document.createElement("span");
            divTeam1.className = "teamName";
            divTeam1.innerText = teams[matches[i].team1Id].name;
            divTeam1.addEventListener("click", () => { //go to team page
                gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", matches[i].team1Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam1);

            //form
            let formTeam1 = document.createElement("div");
            divTeam1.appendChild(formTeam1);
            formTeam1.className = "form"; //!!CHANGER!!
            if(round == 0){
                formTeam1.innerHTML = "&nbsp;"
            }
            else if(round < 5){
                for(let j = round; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k] != undefined){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            else{
                for(let j = 5; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k] != undefined){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team1Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam1.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam1.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            if(divTeam1.children[0].innerHTML == ""){
                formTeam1.innerHTML = "&nbsp;"
            }

            let inputGoalsTeam1 = document.createElement("span");
            inputGoalsTeam1.className = "goalInput";
            inputGoalsTeam1.style.width = "34px";
            inputGoalsTeam1.innerText = matches[i].team1Goals;
            divMatch.appendChild(inputGoalsTeam1);

            let spanVS = document.createElement("span");
            spanVS.innerText = " VS ";
            spanVS.id = "spanVS";
            divMatch.appendChild(spanVS);

            for(let j = 0; j < teams[matches[i].team1Id].rivalries.length; j++){
                if(matches[i].team2Id == teams[matches[i].team1Id].rivalries[j].teamId && teams[matches[i].team1Id].rivalries[j].rivalType == "Sporting"){
                    spanVS.style.border = "2px solid red";
                    spanVS.style.borderRadius = "2px";
                }
                else if(matches[i].team2Id == teams[matches[i].team1Id].rivalries[j].teamId && teams[matches[i].team1Id].rivalries[j].rivalType == "Derby"){
                    spanVS.style.border = "2px solid blue";
                    spanVS.style.borderRadius = "2px";
                }
            }

            let inputGoalsTeam2 = document.createElement("span");
            inputGoalsTeam2.className = "goalInput";
            inputGoalsTeam2.style.width = "34px";
            inputGoalsTeam2.innerText = matches[i].team2Goals;
            divMatch.appendChild(inputGoalsTeam2);

            let divTeam2 = document.createElement("span");
            divTeam2.className = "teamName";
            divTeam2.innerText = teams[matches[i].team2Id].name;
            divTeam2.addEventListener("click", () => { //go to team page
                gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", matches[i].team2Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam2);

            //form
            let formTeam2 = document.createElement("div");
            divTeam2.appendChild(formTeam2);
            formTeam2.className = "form"; //!!CHANGER!!
            if(round == 0){
                formTeam2.innerHTML = "&nbsp;"
            }
            else if(round < 5){
                for(let j = round; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k] != undefined){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            else{
                for(let j = 5; j > 0; j--){
                    let game = document.createElement("div");
                    game.className = "formGame";
                    for(let k = 0; k < Math.floor(gameData.seasons[season].teams.allTeams.length / 2); k++){
                        if(gameData.seasons[season].schedule[round - j].games[k]){
                            if(gameData.seasons[season].schedule[round - j].games[k].team1Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                            else if(gameData.seasons[season].schedule[round - j].games[k].team2Id == matches[i].team2Id){
                                if(gameData.seasons[season].schedule[round - j].games[k].team1Goals < gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "V";
                                    game.style.backgroundColor = "lightgreen";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals == gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "D";
                                    game.style.backgroundColor = "orange";
                                    formTeam2.appendChild(game);
                                }
                                else if(gameData.seasons[season].schedule[round - j].games[k].team1Goals > gameData.seasons[season].schedule[round - j].games[k].team2Goals){
                                    game.innerText = "L";
                                    game.style.backgroundColor = "red";
                                    formTeam2.appendChild(game);
                                }
                            }
                        }
                    }
                }
            }
            if(divTeam2.children[0].innerHTML == ""){
                formTeam2.innerHTML = "&nbsp;"
            }
            
            let team2LogoContainer = document.createElement("div");
            team2LogoContainer.className = "teamLogoContainer";
            divMatch.appendChild(team2LogoContainer);
            
            let TeamLogoImg2 = document.createElement("img");
            TeamLogoImg2.src = ".." + teams[matches[i].team2Id].logo + ".png";
            TeamLogoImg2.className = "teamLogo";
            team2LogoContainer.appendChild(TeamLogoImg2);

            if(Number(matches[i].team1Goals) > Number(matches[i].team2Goals)){
                divTeam1.style.fontWeight = "bold";
                divTeam2.style.fontStyle = "italic";
            }
            else if (Number(matches[i].team1Goals) < Number(matches[i].team2Goals)){
                divTeam2.style.fontWeight = "bold";
                divTeam1.style.fontStyle = "italic";
            }

        }
        let br = document.createElement("br");
        
        br.id ="2";
        gamesDiv.appendChild(br);
    }
}

function gamesPostSeason (gameData, season, round){    
    if(season <= 11 && gameData.seasons[0].endDate != 1){
        let matchups = gameData.seasons[season].postSeasonSchedule[round].matchups;
        let teams = gameData.teams;
    
        for(let i = 0; i < matchups.length; i++){
            let matchupdiv = document.createElement("div");
            gamesDiv.appendChild(matchupdiv);
            for(let j = 0; j < matchups[i].games.length; j++){
                if(matchups[i].games[j].team1Goals == ""){  // si match pas joué
                    if(matchups[i].completed == "no"){
                        let divMatch = document.createElement("div");
                        divMatch.id = "divMatch";
                        gamesDiv.appendChild(divMatch);
        
                        let team1LogoContainer = document.createElement("div");
                        team1LogoContainer.className = "teamLogoContainer";
                        divMatch.appendChild(team1LogoContainer);
                        
                        let TeamLogoImg1 = document.createElement("img");
                        TeamLogoImg1.src = ".." + teams[matchups[i].games[j].team1Id].logo + ".png";
                        TeamLogoImg1.className = "teamLogo";
                        team1LogoContainer.appendChild(TeamLogoImg1);
        
                        let divTeam1 = document.createElement("span");
                        divTeam1.className = "teamNamePS";
                        divTeam1.innerText = " " + teams[matchups[i].games[j].team1Id].name + " ";
                        divTeam1.addEventListener("click", () => { //go to team page
                            gameDataJson = JSON.stringify(gameData);
                            sessionStorage.setItem("gameData", gameDataJson);
                            sessionStorage.setItem("team", matchups[i].games[j].team1Id);
                            location.href = "../team/team.html";
                        });
                        divMatch.appendChild(divTeam1);
        
                        let inputGoalsTeam1 = document.createElement("input");
                        inputGoalsTeam1.min = "0";
                        inputGoalsTeam1.className = "goalInput";
                        inputGoalsTeam1.type = "number";
                        divMatch.appendChild(inputGoalsTeam1);
        
                        let inputGoalsAddTimeTeam1 = document.createElement("input");
                        inputGoalsAddTimeTeam1.min = "0";
                        inputGoalsAddTimeTeam1.className = "goalInput";
                        inputGoalsAddTimeTeam1.type = "number";
                        inputGoalsAddTimeTeam1.style.fontSize = "12px";
                        //inputGoalsAddTimeTeam1.style.width = "25px";
                        inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                        divMatch.appendChild(inputGoalsAddTimeTeam1);
        
                        let spanVS = document.createElement("span");
                        spanVS.innerText = "VS";
                        spanVS.id = "spanVS";
                        divMatch.appendChild(spanVS);
        
                        let inputGoalsAddTimeTeam2 = document.createElement("input");
                        inputGoalsAddTimeTeam2.min = "0";
                        inputGoalsAddTimeTeam2.className = "goalInput";
                        inputGoalsAddTimeTeam2.type = "number";
                        inputGoalsAddTimeTeam2.style.fontSize = "12px";
                        //inputGoalsAddTimeTeam2.style.width = "25px";
                        inputGoalsAddTimeTeam2.style.marginRight = "1px";
                        divMatch.appendChild(inputGoalsAddTimeTeam2);
        
                        let inputGoalsTeam2 = document.createElement("input");
                        inputGoalsTeam2.min = "0";
                        inputGoalsTeam2.className = "goalInput";
                        inputGoalsTeam2.type = "number";
                        divMatch.appendChild(inputGoalsTeam2);
        
                        let divTeam2 = document.createElement("span");
                        divTeam2.className = "teamNamePS";
                        divTeam2.innerText = " " + teams[matchups[i].games[j].team2Id].name + " ";
                        divTeam2.addEventListener("click", () => { //go to team page
                            gameDataJson = JSON.stringify(gameData);
                            sessionStorage.setItem("gameData", gameDataJson);
                            sessionStorage.setItem("team", matchups[i].games[j].team2Id);
                            location.href = "../team/team.html";
                        });
                        divMatch.appendChild(divTeam2);
        
                        let team2LogoContainer = document.createElement("div");
                        team2LogoContainer.className = "teamLogoContainer";
                        divMatch.appendChild(team2LogoContainer);
                        
                        let TeamLogoImg2 = document.createElement("img");
                        TeamLogoImg2.src = ".." + teams[matchups[i].games[j].team2Id].logo + ".png";
                        TeamLogoImg2.className = "teamLogo";
                        team2LogoContainer.appendChild(TeamLogoImg2);
            
                        let gameButton = document.createElement("button");
                        gameButton.innerText = "Confirm match";
                        gameButton.style.display = "none";
                        gameButton.style.marginLeft = "3px";
                        gameButton.addEventListener("click", function(){
                            if(inputGoalsTeam1.value == "" || inputGoalsTeam2.value == ""){
                                window.alert("The fields are empty");
                            }
                            else if(inputGoalsTeam1.value != inputGoalsTeam2.value && (inputGoalsAddTimeTeam1.value != "" || inputGoalsAddTimeTeam2.value != "")){
                                window.alert("The match has to be tied for add time");
                            }
                            else if(inputGoalsTeam1.value == inputGoalsTeam2.value && (inputGoalsAddTimeTeam1.value == "" || inputGoalsAddTimeTeam2.value == "" || inputGoalsAddTimeTeam1.value == inputGoalsAddTimeTeam2.value)){
                                window.alert("This match can't finished tied")
                            }
                            else{
                                matchups[i].games[j].team1Goals = inputGoalsTeam1.value;
                                matchups[i].games[j].team2Goals = inputGoalsTeam2.value;
                                matchups[i].games[j].team1GoalsAddTime = inputGoalsAddTimeTeam1.value;
                                matchups[i].games[j].team2GoalsAddTime = inputGoalsAddTimeTeam2.value;
                                //confirm who won and check if the matchup has ended
                                let team1Wins = 0;
                                let team2Wins = 0;
                                for(let k = 0; k < 3; k++){
                                    if(k % 2 == 0){
                                        if(Number(matchups[i].games[k].team1Goals) > Number(matchups[i].games[k].team2Goals)){
                                            team1Wins++;
                                        }
                                        else if(Number(matchups[i].games[k].team1Goals) < Number(matchups[i].games[k].team2Goals)){
                                            team2Wins++;
                                        }
                                        else{
                                            if(matchups[i].games[k].team1GoalsAddTime > matchups[i].games[k].team2GoalsAddTime){
                                                team1Wins++;
                                            }
                                            else if(matchups[i].games[k].team1GoalsAddTime < matchups[i].games[k].team2GoalsAddTime){
                                                team2Wins++;
                                            }
                                        }
                                    }
                                    else{
                                        if(Number(matchups[i].games[k].team1Goals) > Number(matchups[i].games[k].team2Goals)){
                                            team2Wins++;
                                        }
                                        else if(Number(matchups[i].games[k].team1Goals) < Number(matchups[i].games[k].team2Goals)){
                                            team1Wins++;
                                        }
                                        else{
                                            if(matchups[i].games[k].team1GoalsAddTime > matchups[i].games[k].team2GoalsAddTime){
                                                team2Wins++;
                                            }
                                            else if(matchups[i].games[k].team1GoalsAddTime < matchups[i].games[k].team2GoalsAddTime){
                                                team1Wins++;
                                            }
                                        }
                                    }
                                }
                                if(team1Wins >= 2){
                                    matchups[i].completed = "yes";
                                    matchups[i].loser = `${matchups[i].games[0].team2Id}`;
                                    matchups[i].winner = `${matchups[i].games[0].team1Id}`;
                                    if(round != gameData.seasons[season].postSeasonSchedule.length - 1){
                                        // add team to next round (seeds)
                                        gameData.seasons[season].postSeasonSchedule[round + 1].seeds[gameData.seasons[season].postSeasonSchedule[round].seeds.indexOf(matchups[i].winner)] = matchups[i].winner;
                                    }
                                }
                                else if(team2Wins >= 2){
                                    matchups[i].completed = "yes";
                                    matchups[i].loser = `${matchups[i].games[0].team1Id}`;
                                    matchups[i].winner = `${matchups[i].games[0].team2Id}`;
                                    if(round != gameData.seasons[season].postSeasonSchedule.length - 1){
                                        // add team to next round (seeds)
                                        gameData.seasons[season].postSeasonSchedule[round + 1].seeds[gameData.seasons[season].postSeasonSchedule[round].seeds.indexOf(matchups[i].winner)] = (matchups[i].winner);
                                    }
                                }
                                //check if all rounds are finished
                                let allRoundsFinished = 0
                                for(let k = 0; k < matchups.length; k++){
                                    if(matchups[k].completed == "yes"){
                                        allRoundsFinished++;
                                    }
                                }
                                button.dispatchEvent(new Event("click"));
                                if(allRoundsFinished == matchups.length){
                                    if(round != gameData.seasons[season].postSeasonSchedule.length - 1){
                                        //lay-out next round
                                        let teamSeeds = gameData.seasons[season].postSeasonSchedule[round + 1].seeds.filter(n => n);
                                        for(let i = 0; i < gameData.seasons[season].postSeasonSchedule[round + 1].matchups.length; i++){
                                            for(let j = 0; j < 3; j++){
                                                if(j != 1){
                                                    gameData.seasons[season].postSeasonSchedule[round + 1].matchups[i].games[j].team1Id = teamSeeds[i];
                                                    gameData.seasons[season].postSeasonSchedule[round + 1].matchups[i].games[j].team2Id = teamSeeds[teamSeeds.length - 1 - i];
                                                }
                                                else{
                                                    gameData.seasons[season].postSeasonSchedule[round + 1].matchups[i].games[j].team2Id = teamSeeds[i];
                                                    gameData.seasons[season].postSeasonSchedule[round + 1].matchups[i].games[j].team1Id = teamSeeds[teamSeeds.length - 1 - i];
                                                }
                                            }
                                        }
                                    }
                                    gameData.seasons[season].postSeasonSchedule[round].completed = "yes";
                                    selectionOptions(gameData, season); 
                                    select.options[select.options.length - 2].selected = true;
                                }
                            }
                        });
                        divMatch.appendChild(gameButton);
                    }
                }
                else{           //si match joué
                    let divMatch = document.createElement("div");
                    divMatch.id = "divMatch";
                    gamesDiv.appendChild(divMatch);
    
                    let team1LogoContainer = document.createElement("div");
                    team1LogoContainer.className = "teamLogoContainer";
                    divMatch.appendChild(team1LogoContainer);
                    
                    let TeamLogoImg1 = document.createElement("img");
                    TeamLogoImg1.src = ".." + teams[matchups[i].games[j].team1Id].logo + ".png";
                    TeamLogoImg1.className = "teamLogo";
                    team1LogoContainer.appendChild(TeamLogoImg1);
    
                    let divTeam1 = document.createElement("span");
                    divTeam1.className = "teamNamePS";
                    divTeam1.innerText = teams[matchups[i].games[j].team1Id].name;
                    divTeam1.addEventListener("click", () => { //go to team page
                        gameDataJson = JSON.stringify(gameData);
                        sessionStorage.setItem("gameData", gameDataJson);
                        sessionStorage.setItem("team", matchups[i].games[j].team1Id);
                        location.href = "../team/team.html";
                    });
                    divMatch.appendChild(divTeam1);
    
                    let inputGoalsTeam1 = document.createElement("span");
                    inputGoalsTeam1.className = "goalInput";
                    inputGoalsTeam1.style.width = "34px";
                    inputGoalsTeam1.innerText = matchups[i].games[j].team1Goals;
                    divMatch.appendChild(inputGoalsTeam1);
    
                    if(matchups[i].games[j].team1GoalsAddTime != "" && matchups[i].games[j].team1GoalsAddTime != undefined){
                        let inputGoalsAddTimeTeam1 = document.createElement("span");
                        inputGoalsAddTimeTeam1.className = "goalInput";
                        inputGoalsTeam1.style.width = "34px";
                        inputGoalsAddTimeTeam1.style.fontSize = "12px";
                        //inputGoalsAddTimeTeam1.style.width = "25px";
                        inputGoalsAddTimeTeam1.innerText = matchups[i].games[j].team1GoalsAddTime;
                        inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                        divMatch.appendChild(inputGoalsAddTimeTeam1);
                    }
                    else{
                        inputGoalsTeam1.style.width = "69px";
                    }
    
                    let spanVS = document.createElement("span");
                    spanVS.innerText = " VS ";
                    spanVS.id = "spanVS";
                    divMatch.appendChild(spanVS);
    
                    if(matchups[i].games[j].team2GoalsAddTime != "" && matchups[i].games[j].team2GoalsAddTime != undefined){
                        let inputGoalsAddTimeTeam2 = document.createElement("span");
                        inputGoalsAddTimeTeam2.className = "goalInput";
                        inputGoalsAddTimeTeam2.style.fontSize = "12px";
                        inputGoalsAddTimeTeam2.innerText = matchups[i].games[j].team2GoalsAddTime;
                        //inputGoalsAddTimeTeam2.style.width = "25px";
                        inputGoalsAddTimeTeam2.style.marginRight = "1px";
                        divMatch.appendChild(inputGoalsAddTimeTeam2);
                    }
    
                    let inputGoalsTeam2 = document.createElement("span");
                    inputGoalsTeam2.className = "goalInput";
                    inputGoalsTeam2.style.width = "34px";
                    inputGoalsTeam2.innerText = matchups[i].games[j].team2Goals;
                    divMatch.appendChild(inputGoalsTeam2);
    
                    if(!(matchups[i].games[j].team2GoalsAddTime != "" && matchups[i].games[j].team2GoalsAddTime != undefined)){
                        inputGoalsTeam2.style.width = "69px";
                    }
    
                    let divTeam2 = document.createElement("span");
                    divTeam2.className = "teamNamePS";
                    divTeam2.innerText = teams[matchups[i].games[j].team2Id].name;
                    divTeam2.addEventListener("click", () => { //go to team page
                        gameDataJson = JSON.stringify(gameData);
                        sessionStorage.setItem("gameData", gameDataJson);
                        sessionStorage.setItem("team", matchups[i].games[j].team2Id);
                        location.href = "../team/team.html";
                    });
                    divMatch.appendChild(divTeam2);
    
                    let team2LogoContainer = document.createElement("div");
                    team2LogoContainer.className = "teamLogoContainer";
                    divMatch.appendChild(team2LogoContainer);
                    
                    let TeamLogoImg2 = document.createElement("img");
                    TeamLogoImg2.src = ".." + teams[matchups[i].games[j].team2Id].logo + ".png";
                    TeamLogoImg2.className = "teamLogo";
                    team2LogoContainer.appendChild(TeamLogoImg2);
    
                    if(Number(matchups[i].games[j].team1Goals) > Number(matchups[i].games[j].team2Goals)){
                        divTeam1.style.fontWeight = "bold";
                        divTeam2.style.fontStyle = "italic";
                    }
                    else if (Number(matchups[i].games[j].team1Goals) < Number(matchups[i].games[j].team2Goals)){
                        divTeam2.style.fontWeight = "bold";
                        divTeam1.style.fontStyle = "italic";
                    }
                    else{
                        if(Number(matchups[i].games[j].team1GoalsAddTime) > Number(matchups[i].games[j].team2GoalsAddTime)){
                            divTeam1.style.fontWeight = "bold";
                            divTeam2.style.fontStyle = "italic";
                        }
                        else{
                            divTeam2.style.fontWeight = "bold";
                            divTeam1.style.fontStyle = "italic";
                        }
                    }
    
                    if(matchups[i].loser == matchups[i].games[0].team1Id){
                        if(j % 2 == 0){
                            divTeam1.style.textDecoration = "line-through";
                        }
                        else{
                            divTeam2.style.textDecoration = "line-through";
                        }
                    }
                    else if (matchups[i].loser == matchups[i].games[0].team2Id){
                        if(j % 2 != 0){
                            divTeam1.style.textDecoration = "line-through";
                        }
                        else{
                            divTeam2.style.textDecoration = "line-through";
                        }
                    }
                }
            }
            let br = document.createElement("br");
            br.id ="3";
            gamesDiv.appendChild(br);
            if(round == gameData.seasons[season].postSeasonSchedule.length - 1 && gameData.seasons[season].postSeasonSchedule[round].completed == "yes"){
                printChampion(gameData.seasons[season].postSeasonSchedule[round].matchups[0].winner);
            }
        }
    }
    else{  // if after season 11 (change in gameData)
        if(round < gameData.seasons[season].postSeasonSchedule.conference[0].length){
            for(let l = 0; l < gameData.seasons[season].postSeasonSchedule.conference.length; l++){
                let teams = gameData.teams;
                
                    let matchupdiv = document.createElement("div");
                    gamesDiv.appendChild(matchupdiv);
                    let conferenceMatchups = gameData.seasons[season].postSeasonSchedule.conference[l][round].matchups;
                    for(let i = 0; i < conferenceMatchups.length; i++){
                        for(let j = 0; j < conferenceMatchups[i].games.length; j++){
                            if(conferenceMatchups[i].games[j].team1Goals == ""){  // si match pas joué
                                if(conferenceMatchups[i].completed == "no"){
                                    let divMatch = document.createElement("div");
                                    divMatch.id = "divMatch";
                                    gamesDiv.appendChild(divMatch);
                    
                                    let team1LogoContainer = document.createElement("div");
                                    team1LogoContainer.className = "teamLogoContainer";
                                    divMatch.appendChild(team1LogoContainer);
                                    
                                    let TeamLogoImg1 = document.createElement("img");
                                    TeamLogoImg1.src = ".." + teams[conferenceMatchups[i].games[j].team1Id].logo + ".png";
                                    TeamLogoImg1.className = "teamLogo";
                                    team1LogoContainer.appendChild(TeamLogoImg1);
                    
                                    let divTeam1 = document.createElement("span");
                                    divTeam1.className = "teamNamePS";
                                    divTeam1.innerText = " " + teams[conferenceMatchups[i].games[j].team1Id].name + " ";
                                    divTeam1.addEventListener("click", () => { //go to team page
                                        gameDataJson = JSON.stringify(gameData);
                                        sessionStorage.setItem("gameData", gameDataJson);
                                        sessionStorage.setItem("team", conferenceMatchups[i].games[j].team1Id);
                                        location.href = "../team/team.html";
                                    });
                                    divMatch.appendChild(divTeam1);
                    
                                    let inputGoalsTeam1 = document.createElement("input");
                                    inputGoalsTeam1.min = "0";
                                    inputGoalsTeam1.className = "goalInput";
                                    inputGoalsTeam1.type = "number";
                                    divMatch.appendChild(inputGoalsTeam1);
                    
                                    let inputGoalsAddTimeTeam1 = document.createElement("input");
                                    inputGoalsAddTimeTeam1.min = "0";
                                    inputGoalsAddTimeTeam1.className = "goalInput";
                                    inputGoalsAddTimeTeam1.type = "number";
                                    inputGoalsAddTimeTeam1.style.fontSize = "12px";
                                    inputGoalsAddTimeTeam1.style.width = "26px";
                                    inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                                    divMatch.appendChild(inputGoalsAddTimeTeam1);
                    
                                    let buttonVS = document.createElement("button");
                                    buttonVS.innerText = "VS";
                                    buttonVS.addEventListener("click", () => {
                                        let result = dice.diceRoll(teams[conferenceMatchups[i].games[j].team1Id].power + teams[conferenceMatchups[i].games[j].team1Id].tradePower, teams[conferenceMatchups[i].games[j].team1Id].power + teams[conferenceMatchups[i].games[j].team1Id].tradePower);
                                        inputGoalsTeam1.value = result[0];
                                        inputGoalsTeam2.value = result[1];
                                        if(result[0] == result[1]){
                                            let resultAddTime = [0,0]
                                            while(resultAddTime[0] == resultAddTime[1]){
                                                resultAddTime = dice.diceRoll(teams[conferenceMatchups[i].games[j].team1Id].power + teams[conferenceMatchups[i].games[j].team1Id].tradePower, teams[conferenceMatchups[i].games[j].team1Id].power + teams[conferenceMatchups[i].games[j].team1Id].tradePower);
                                                if(resultAddTime[0] > resultAddTime[1]){
                                                    inputGoalsAddTimeTeam1.value = 1;
                                                    inputGoalsAddTimeTeam2.value = 0;
                                                }
                                                else if (resultAddTime[1] > resultAddTime[0]){
                                                    inputGoalsAddTimeTeam1.value = 0;
                                                    inputGoalsAddTimeTeam2.value = 1;
                                                }
                                            }
                                        }
                                        gameButton.dispatchEvent(new Event("click"))
                                    })
                                    divMatch.appendChild(buttonVS);
                    
                                    let inputGoalsAddTimeTeam2 = document.createElement("input");
                                    inputGoalsAddTimeTeam2.min = "0";
                                    inputGoalsAddTimeTeam2.className = "goalInput";
                                    inputGoalsAddTimeTeam2.type = "number";
                                    inputGoalsAddTimeTeam2.style.fontSize = "12px";
                                    inputGoalsAddTimeTeam2.style.width = "26px";
                                    inputGoalsAddTimeTeam2.style.marginRight = "1px";
                                    divMatch.appendChild(inputGoalsAddTimeTeam2);
                    
                                    let inputGoalsTeam2 = document.createElement("input");
                                    inputGoalsTeam2.min = "0";
                                    inputGoalsTeam2.className = "goalInput";
                                    inputGoalsTeam2.type = "number";
                                    divMatch.appendChild(inputGoalsTeam2);
                    
                                    let divTeam2 = document.createElement("span");
                                    divTeam2.className = "teamNamePS";
                                    divTeam2.innerText = " " + teams[conferenceMatchups[i].games[j].team2Id].name + " ";
                                    divTeam2.addEventListener("click", () => { //go to team page
                                        gameDataJson = JSON.stringify(gameData);
                                        sessionStorage.setItem("gameData", gameDataJson);
                                        sessionStorage.setItem("team", conferenceMatchups[i].games[j].team2Id);
                                        location.href = "../team/team.html";
                                    });
                                    divMatch.appendChild(divTeam2);
                    
                                    let team2LogoContainer = document.createElement("div");
                                    team2LogoContainer.className = "teamLogoContainer";
                                    divMatch.appendChild(team2LogoContainer);
                                    
                                    let TeamLogoImg2 = document.createElement("img");
                                    TeamLogoImg2.src = ".." + teams[conferenceMatchups[i].games[j].team2Id].logo + ".png";
                                    TeamLogoImg2.className = "teamLogo";
                                    team2LogoContainer.appendChild(TeamLogoImg2);
                        
                                    let gameButton = document.createElement("button");
                                    gameButton.innerText = "Confirm match";
                                    gameButton.style.display = "none";
                                    gameButton.addEventListener("click", function(){
                                        if(inputGoalsTeam1.value == "" || inputGoalsTeam2.value == ""){
                                            window.alert("The fields are empty");
                                        }
                                        else if(inputGoalsTeam1.value != inputGoalsTeam2.value && (inputGoalsAddTimeTeam1.value != "" || inputGoalsAddTimeTeam2.value != "")){
                                            window.alert("The match has to be tied for add time");
                                        }
                                        else if(inputGoalsTeam1.value == inputGoalsTeam2.value && (inputGoalsAddTimeTeam1.value == "" || inputGoalsAddTimeTeam2.value == "" || inputGoalsAddTimeTeam1.value == inputGoalsAddTimeTeam2.value)){
                                            window.alert("This match can't finished tied")
                                        }
                                        else{
                                            conferenceMatchups[i].games[j].team1Goals = inputGoalsTeam1.value; 
                                            conferenceMatchups[i].games[j].team2Goals = inputGoalsTeam2.value;
                                            conferenceMatchups[i].games[j].team1GoalsAddTime = inputGoalsAddTimeTeam1.value;
                                            conferenceMatchups[i].games[j].team2GoalsAddTime = inputGoalsAddTimeTeam2.value;
                                            recordsPostSeason.testPostSeasonRecords(gameData, season, conferenceMatchups[i].games[j]);
                                            //confirm who won and check if the matchup has ended
                                            let team1Wins = 0;
                                            let team2Wins = 0;
                                            for(let k = 0; k < gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches; k++){
                                                if(k % 2 == 0){
                                                    if(Number(conferenceMatchups[i].games[k].team1Goals) > Number(conferenceMatchups[i].games[k].team2Goals)){
                                                        team1Wins++;
                                                    }
                                                    else if(Number(conferenceMatchups[i].games[k].team1Goals) < Number(conferenceMatchups[i].games[k].team2Goals)){
                                                        team2Wins++;
                                                    }
                                                    else{
                                                        if(conferenceMatchups[i].games[k].team1GoalsAddTime > conferenceMatchups[i].games[k].team2GoalsAddTime){
                                                            team1Wins++;
                                                        }
                                                        else if(conferenceMatchups[i].games[k].team1GoalsAddTime < conferenceMatchups[i].games[k].team2GoalsAddTime){
                                                            team2Wins++;
                                                        }
                                                    }
                                                }
                                                else{
                                                    if(Number(conferenceMatchups[i].games[k].team1Goals) > Number(conferenceMatchups[i].games[k].team2Goals)){
                                                        team2Wins++;
                                                    }
                                                    else if(Number(conferenceMatchups[i].games[k].team1Goals) < Number(conferenceMatchups[i].games[k].team2Goals)){
                                                        team1Wins++;
                                                    }
                                                    else{
                                                        if(conferenceMatchups[i].games[k].team1GoalsAddTime > conferenceMatchups[i].games[k].team2GoalsAddTime){
                                                            team2Wins++;
                                                        }
                                                        else if(conferenceMatchups[i].games[k].team1GoalsAddTime < conferenceMatchups[i].games[k].team2GoalsAddTime){
                                                            team1Wins++;
                                                        }
                                                    }
                                                }
                                            }
                                            if(team1Wins >= Math.ceil(gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches / 2)){
                                                conferenceMatchups[i].completed = "yes";
                                                conferenceMatchups[i].loser = `${conferenceMatchups[i].games[0].team2Id}`;
                                                conferenceMatchups[i].winner = `${conferenceMatchups[i].games[0].team1Id}`;
                                                gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(conferenceMatchups[i].loser), 1);
                                            }
                                            else if(team2Wins >= Math.ceil(gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches / 2)){
                                                conferenceMatchups[i].completed = "yes";
                                                conferenceMatchups[i].loser = `${conferenceMatchups[i].games[0].team1Id}`;
                                                conferenceMatchups[i].winner = `${conferenceMatchups[i].games[0].team2Id}`;
                                                gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(conferenceMatchups[i].loser), 1);
                                            }
                                            //check if all rounds are finished      
                                            let allRoundsFinished = 0
                                            for(let z = 0; z < conferenceNumber; z++){
                                                for(let k = 0; k < conferenceMatchups.length; k++){
                                                    if(gameData.seasons[season].postSeasonSchedule.conference[z][round].matchups[k].completed == "yes"){
                                                        allRoundsFinished++;        //!!!TO CHANGE!!!
                                                    }
                                                }
                                            }
                                            if(allRoundsFinished == conferenceMatchups.length * conferenceNumber){ 
                                                for(let z = 0; z < conferenceNumber; z++){
                                                    gameData.seasons[season].postSeasonSchedule.conference[z][round].completed = "yes";
                                                }
                                                if(round != gameData.seasons[season].postSeasonSchedule.conference[l].length - 1){    
                                                    //lay-out next round
                                                    for(let c = 0; c < conferenceNumber; c++){
                                                        let teamSeeds = gameData.seasons[season].postSeasonSchedule.seeds.filter(function (n){
                                                            for(let a = 0; a < gameData.seasons[season].teams.conference[c].teamsInConference.length; a++){
                                                                if(n == gameData.seasons[season].teams.conference[c].teamsInConference[a].id){
                                                                    return n;
                                                                }
                                                            }
                                                        });
                                                        for(let b = 0; b < gameData.seasons[season].postSeasonSchedule.conference[c][round + 1].matchups.length; b++){
                                                            for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches; j++){
                                                                if(j % 2 == 0){
                                                                    gameData.seasons[season].postSeasonSchedule.conference[c][round + 1].matchups[b].games[j].team1Id = teamSeeds[b];
                                                                    gameData.seasons[season].postSeasonSchedule.conference[c][round + 1].matchups[b].games[j].team2Id = teamSeeds[teamSeeds.length - 1 - b];
                                                                }
                                                                else{
                                                                    gameData.seasons[season].postSeasonSchedule.conference[c][round + 1].matchups[b].games[j].team2Id = teamSeeds[b];
                                                                    gameData.seasons[season].postSeasonSchedule.conference[c][round + 1].matchups[b].games[j].team1Id = teamSeeds[teamSeeds.length - 1 - b];
                                                                }
                                                            }
                                                        }
                                                    }
                                                    selectionOptions(gameData, season); 
                                                    select.options[select.options.length - 2].selected = true;
                                                }
                                                else{   //finals
                                                    for(let a = 0; a < gameData.seasons[season].postSeasonSchedule.finals.length; a++){
                                                        for(let b = 0; b < gameData.seasons[season].postSeasonSchedule.finals[a].matchups.length; b++){
                                                            let teamSeeds = gameData.seasons[season].postSeasonSchedule.seeds;
                                                            for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches; j++){
                                                                if(j % 2 == 0){
                                                                    gameData.seasons[season].postSeasonSchedule.finals[a].matchups[b].games[j].team1Id = teamSeeds[b];
                                                                    gameData.seasons[season].postSeasonSchedule.finals[a].matchups[b].games[j].team2Id = teamSeeds[teamSeeds.length - 1 - b];
                                                                }
                                                                else{
                                                                    gameData.seasons[season].postSeasonSchedule.finals[a].matchups[b].games[j].team2Id = teamSeeds[b];
                                                                    gameData.seasons[season].postSeasonSchedule.finals[a].matchups[b].games[j].team1Id = teamSeeds[teamSeeds.length - 1 - b];
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            button.dispatchEvent(new Event("click"));
                                            selectionOptions(gameData, season);
                                        }
                                    });
                                    divMatch.appendChild(gameButton);
                                }
                            }
                            else{           //si match joué
                                let divMatch = document.createElement("div");
                                divMatch.id = "divMatch";
                                gamesDiv.appendChild(divMatch);
                
                                let team1LogoContainer = document.createElement("div");
                                team1LogoContainer.className = "teamLogoContainer";
                                divMatch.appendChild(team1LogoContainer);
                                
                                let TeamLogoImg1 = document.createElement("img");
                                TeamLogoImg1.src = ".." + teams[conferenceMatchups[i].games[j].team1Id].logo + ".png";
                                TeamLogoImg1.className = "teamLogo";
                                team1LogoContainer.appendChild(TeamLogoImg1);
                
                                let divTeam1 = document.createElement("span");
                                divTeam1.className = "teamNamePS";
                                divTeam1.innerText = teams[conferenceMatchups[i].games[j].team1Id].name;
                                divTeam1.addEventListener("click", () => { //go to team page
                                    gameDataJson = JSON.stringify(gameData);
                                    sessionStorage.setItem("gameData", gameDataJson);
                                    sessionStorage.setItem("team", conferenceMatchups[i].games[j].team1Id);
                                    location.href = "../team/team.html";
                                });
                                divMatch.appendChild(divTeam1);
                
                                let inputGoalsTeam1 = document.createElement("span");
                                inputGoalsTeam1.className = "goalInput";
                                inputGoalsTeam1.style.width = "34px";
                                inputGoalsTeam1.innerText = conferenceMatchups[i].games[j].team1Goals;
                                divMatch.appendChild(inputGoalsTeam1);
                
                                if(conferenceMatchups[i].games[j].team1GoalsAddTime != "" && conferenceMatchups[i].games[j].team1GoalsAddTime != undefined){
                                    let inputGoalsAddTimeTeam1 = document.createElement("span");
                                    inputGoalsAddTimeTeam1.className = "goalInput";
                                    inputGoalsAddTimeTeam1.style.fontSize = "12px";
                                    //inputGoalsAddTimeTeam1.style.width = "25px";
                                    inputGoalsAddTimeTeam1.innerText = conferenceMatchups[i].games[j].team1GoalsAddTime;
                                    inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                                    divMatch.appendChild(inputGoalsAddTimeTeam1);
                                }
                                else{
                                    inputGoalsTeam1.style.width = "69px";
                                }
                
                                let spanVS = document.createElement("span");
                                spanVS.innerText = " VS ";
                                spanVS.id = "spanVS";
                                divMatch.appendChild(spanVS);
                
                                if(conferenceMatchups[i].games[j].team2GoalsAddTime != "" && conferenceMatchups[i].games[j].team2GoalsAddTime != undefined){
                                    let inputGoalsAddTimeTeam2 = document.createElement("span");
                                    inputGoalsAddTimeTeam2.className = "goalInput";
                                    inputGoalsAddTimeTeam2.style.fontSize = "12px";
                                    inputGoalsAddTimeTeam2.innerText = conferenceMatchups[i].games[j].team2GoalsAddTime;
                                    //inputGoalsAddTimeTeam2.style.width = "25px";
                                    inputGoalsAddTimeTeam2.style.marginRight = "1px";
                                    divMatch.appendChild(inputGoalsAddTimeTeam2);
                                }
                
                                let inputGoalsTeam2 = document.createElement("span");
                                inputGoalsTeam2.className = "goalInput";
                                inputGoalsTeam2.style.width = "34px";
                                inputGoalsTeam2.innerText = conferenceMatchups[i].games[j].team2Goals;
                                divMatch.appendChild(inputGoalsTeam2);
                
                                if(!(conferenceMatchups[i].games[j].team2GoalsAddTime != "" && conferenceMatchups[i].games[j].team2GoalsAddTime != undefined)){
                                    inputGoalsTeam2.style.width = "69px";
                                }
                
                                let divTeam2 = document.createElement("span");
                                divTeam2.className = "teamNamePS";
                                divTeam2.innerText = teams[conferenceMatchups[i].games[j].team2Id].name;
                                divTeam2.addEventListener("click", () => { //go to team page
                                    gameDataJson = JSON.stringify(gameData);
                                    sessionStorage.setItem("gameData", gameDataJson);
                                    sessionStorage.setItem("team", conferenceMatchups[i].games[j].team2Id);
                                    location.href = "../team/team.html";
                                });
                                divMatch.appendChild(divTeam2);
                
                                let team2LogoContainer = document.createElement("div");
                                team2LogoContainer.className = "teamLogoContainer";
                                divMatch.appendChild(team2LogoContainer);
                                
                                let TeamLogoImg2 = document.createElement("img");
                                TeamLogoImg2.src = ".." + teams[conferenceMatchups[i].games[j].team2Id].logo + ".png";
                                TeamLogoImg2.className = "teamLogo";
                                team2LogoContainer.appendChild(TeamLogoImg2);
                
                                if(Number(conferenceMatchups[i].games[j].team1Goals) > Number(conferenceMatchups[i].games[j].team2Goals)){
                                    divTeam1.style.fontWeight = "bold";
                                    divTeam2.style.fontStyle = "italic";
                                }
                                else if (Number(conferenceMatchups[i].games[j].team1Goals) < Number(conferenceMatchups[i].games[j].team2Goals)){
                                    divTeam2.style.fontWeight = "bold";
                                    divTeam1.style.fontStyle = "italic";
                                }
                                else{
                                    if(Number(conferenceMatchups[i].games[j].team1GoalsAddTime) > Number(conferenceMatchups[i].games[j].team2GoalsAddTime)){
                                        divTeam1.style.fontWeight = "bold";
                                        divTeam2.style.fontStyle = "italic";
                                    }
                                    else{
                                        divTeam2.style.fontWeight = "bold";
                                        divTeam1.style.fontStyle = "italic";
                                    }
                                }
                
                                if(conferenceMatchups[i].loser == conferenceMatchups[i].games[0].team1Id){
                                    if(j % 2 == 0){
                                        divTeam1.style.textDecoration = "line-through";
                                    }
                                    else{
                                        divTeam2.style.textDecoration = "line-through";
                                    }
                                }
                                else if (conferenceMatchups[i].loser == conferenceMatchups[i].games[0].team2Id){
                                    if(j % 2 != 0){
                                        divTeam1.style.textDecoration = "line-through";
                                    }
                                    else{
                                        divTeam2.style.textDecoration = "line-through";
                                    }
                                }
                            }
                        }
                        let br = document.createElement("br");
                        gamesDiv.appendChild(br);
                        br.id ="4";
                    }
                //}
            }
        }
        else{
            let teams = gameData.teams;
                let matchupdiv = document.createElement("div");
                round = round - gameData.seasons[season].postSeasonSchedule.conference[0].length;
                gamesDiv.appendChild(matchupdiv);
                let finalMatchups = gameData.seasons[season].postSeasonSchedule.finals[round].matchups;
                for(let j = 0; j < finalMatchups[round].games.length; j++){
                    if(finalMatchups[round].games[j].team1Goals == ""){  // si match pas joué
                        if(finalMatchups[round].completed == "no"){
                            let divMatch = document.createElement("div");
                            divMatch.id = "divMatch";
                            gamesDiv.appendChild(divMatch);
            
                            let team1LogoContainer = document.createElement("div");
                            team1LogoContainer.className = "teamLogoContainer";
                            divMatch.appendChild(team1LogoContainer);
                            
                            let TeamLogoImg1 = document.createElement("img");
                            TeamLogoImg1.src = ".." + teams[finalMatchups[round].games[j].team1Id].logo + ".png";
                            TeamLogoImg1.className = "teamLogo";
                            team1LogoContainer.appendChild(TeamLogoImg1);
            
                            let divTeam1 = document.createElement("span");
                            divTeam1.className = "teamNamePS";
                            divTeam1.innerText = " " + teams[finalMatchups[round].games[j].team1Id].name + " ";
                            divTeam1.addEventListener("click", () => { //go to team page
                                gameDataJson = JSON.stringify(gameData);
                                sessionStorage.setItem("gameData", gameDataJson);
                                sessionStorage.setItem("team", finalMatchups[round].games[j].team1Id);
                                location.href = "../team/team.html";
                            });
                            divMatch.appendChild(divTeam1);
            
                            let inputGoalsTeam1 = document.createElement("input");
                            inputGoalsTeam1.min = "0";
                            inputGoalsTeam1.className = "goalInput";
                            inputGoalsTeam1.type = "number";
                            divMatch.appendChild(inputGoalsTeam1);
            
                            let inputGoalsAddTimeTeam1 = document.createElement("input");
                            inputGoalsAddTimeTeam1.min = "0";
                            inputGoalsAddTimeTeam1.className = "goalInput";
                            inputGoalsAddTimeTeam1.type = "number";
                            inputGoalsAddTimeTeam1.style.fontSize = "12px";
                            inputGoalsAddTimeTeam1.style.width = "26px";
                            inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                            divMatch.appendChild(inputGoalsAddTimeTeam1);
            
                            let buttonVS = document.createElement("button");
                                    buttonVS.innerText = "VS";
                                    buttonVS.addEventListener("click", () => {
                                        let result = dice.diceRoll(teams[finalMatchups[round].games[j].team1Id].power + teams[finalMatchups[round].games[j].team1Id].tradePower, teams[finalMatchups[round].games[j].team1Id].power + teams[finalMatchups[round].games[j].team1Id].tradePower);
                                        inputGoalsTeam1.value = result[0];
                                        inputGoalsTeam2.value = result[1];
                                        if(result[0] == result[1]){
                                            let resultAddTime = [0,0]
                                            while(resultAddTime[0] == resultAddTime[1]){
                                                resultAddTime = dice.diceRoll(teams[finalMatchups[round].games[j].team1Id].power + teams[finalMatchups[round].games[j].team1Id].tradePower, teams[finalMatchups[round].games[j].team1Id].power + teams[finalMatchups[round].games[j].team1Id].tradePower);
                                                if(resultAddTime[0] > resultAddTime[1]){
                                                    inputGoalsAddTimeTeam1.value = 1;
                                                    inputGoalsAddTimeTeam2.value = 0;
                                                }
                                                else if (resultAddTime[1] > resultAddTime[0]){
                                                    inputGoalsAddTimeTeam1.value = 0;
                                                    inputGoalsAddTimeTeam2.value = 1;
                                                }
                                            }
                                        }
                                        gameButton.dispatchEvent(new Event("click"))
                                    })
                                    divMatch.appendChild(buttonVS);
            
                            let inputGoalsAddTimeTeam2 = document.createElement("input");
                            inputGoalsAddTimeTeam2.min = "0";
                            inputGoalsAddTimeTeam2.className = "goalInput";
                            inputGoalsAddTimeTeam2.type = "number";
                            inputGoalsAddTimeTeam2.style.fontSize = "12px";
                            inputGoalsAddTimeTeam2.style.width = "26px";
                            inputGoalsAddTimeTeam2.style.marginRight = "1px";
                            divMatch.appendChild(inputGoalsAddTimeTeam2);
            
                            let inputGoalsTeam2 = document.createElement("input");
                            inputGoalsTeam2.min = "0";
                            inputGoalsTeam2.className = "goalInput";
                            inputGoalsTeam2.type = "number";
                            divMatch.appendChild(inputGoalsTeam2);
            
                            let divTeam2 = document.createElement("span");
                            divTeam2.className = "teamNamePS";
                            divTeam2.innerText = " " + teams[finalMatchups[round].games[j].team2Id].name + " ";
                            divTeam2.addEventListener("click", () => { //go to team page
                                gameDataJson = JSON.stringify(gameData);
                                sessionStorage.setItem("gameData", gameDataJson);
                                sessionStorage.setItem("team", finalMatchups[round].games[j].team2Id);
                                location.href = "../team/team.html";
                            });
                            divMatch.appendChild(divTeam2);
            
                            let team2LogoContainer = document.createElement("div");
                            team2LogoContainer.className = "teamLogoContainer";
                            divMatch.appendChild(team2LogoContainer);
                            
                            let TeamLogoImg2 = document.createElement("img");
                            TeamLogoImg2.src = ".." + teams[finalMatchups[round].games[j].team2Id].logo + ".png";
                            TeamLogoImg2.className = "teamLogo";
                            team2LogoContainer.appendChild(TeamLogoImg2);
                
                            let gameButton = document.createElement("button");
                            gameButton.innerText = "Confirm match";
                            gameButton.style.display = "none";
                            gameButton.addEventListener("click", function(){
                                if(inputGoalsTeam1.value == "" || inputGoalsTeam2.value == ""){
                                    window.alert("The fields are empty");
                                }
                                else if(inputGoalsTeam1.value != inputGoalsTeam2.value && (inputGoalsAddTimeTeam1.value != "" || inputGoalsAddTimeTeam2.value != "")){
                                    window.alert("The match has to be tied for add time");
                                }
                                else if(inputGoalsTeam1.value == inputGoalsTeam2.value && (inputGoalsAddTimeTeam1.value == "" || inputGoalsAddTimeTeam2.value == "" || inputGoalsAddTimeTeam1.value == inputGoalsAddTimeTeam2.value)){
                                    window.alert("This match can't finished tied")
                                }
                                else{
                                    finalMatchups[round].games[j].team1Goals = inputGoalsTeam1.value;
                                    finalMatchups[round].games[j].team2Goals = inputGoalsTeam2.value;
                                    finalMatchups[round].games[j].team1GoalsAddTime = inputGoalsAddTimeTeam1.value;
                                    finalMatchups[round].games[j].team2GoalsAddTime = inputGoalsAddTimeTeam2.value;
                                    recordsPostSeason.testPostSeasonRecords(gameData, season, finalMatchups[round].games[j]);
                                    //confirm who won and check if the matchup has ended
                                    let team1Wins = 0;
                                    let team2Wins = 0;
                                    for(let k = 0; k < gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches; k++){
                                        if(k % 2 == 0){
                                            if(Number(finalMatchups[round].games[k].team1Goals) > Number(finalMatchups[round].games[k].team2Goals)){
                                                team1Wins++;
                                            }
                                            else if(Number(finalMatchups[round].games[k].team1Goals) < Number(finalMatchups[round].games[k].team2Goals)){
                                                team2Wins++;
                                            }
                                            else{
                                                if(finalMatchups[round].games[k].team1GoalsAddTime > finalMatchups[round].games[k].team2GoalsAddTime){
                                                    team1Wins++;
                                                }
                                                else if(finalMatchups[round].games[k].team1GoalsAddTime < finalMatchups[round].games[k].team2GoalsAddTime){
                                                    team2Wins++;
                                                }
                                            }
                                        }
                                        else{
                                            if(Number(finalMatchups[round].games[k].team1Goals) > Number(finalMatchups[round].games[k].team2Goals)){
                                                team2Wins++;
                                            }
                                            else if(Number(finalMatchups[round].games[k].team1Goals) < Number(finalMatchups[round].games[k].team2Goals)){
                                                team1Wins++;
                                            }
                                            else{
                                                if(finalMatchups[round].games[k].team1GoalsAddTime > finalMatchups[round].games[k].team2GoalsAddTime){
                                                    team2Wins++;
                                                }
                                                else if(finalMatchups[round].games[k].team1GoalsAddTime < finalMatchups[round].games[k].team2GoalsAddTime){
                                                    team1Wins++;
                                                }
                                            }
                                        }
                                    }
                                    if(team1Wins >= Math.ceil(gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches / 2)){
                                        finalMatchups[round].completed = "yes";
                                        finalMatchups[round].loser = `${finalMatchups[round].games[0].team2Id}`;
                                        finalMatchups[round].winner = `${finalMatchups[round].games[0].team1Id}`;
                                        gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(finalMatchups[round].loser), 1);
                                    }
                                    else if(team2Wins >= Math.ceil(gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches / 2)){
                                        finalMatchups[round].completed = "yes";
                                        finalMatchups[round].loser = `${finalMatchups[round].games[0].team1Id}`;
                                        finalMatchups[round].winner = `${finalMatchups[round].games[0].team2Id}`;
                                        gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(finalMatchups[round].loser), 1);
                                    }
                                    //check if all rounds are finished      
                                    let allRoundsFinished = 0
                                    for(let k = 0; k < finalMatchups.length; k++){
                                        if(gameData.seasons[season].postSeasonSchedule.finals[round].matchups[k].completed == "yes"){
                                            allRoundsFinished++;        //!!!TO CHANGE!!!
                                        }
                                    }
                                    if(allRoundsFinished == finalMatchups.length){ 
                                        gameData.seasons[season].postSeasonSchedule.finals[round].completed = "yes";
                                        //finals
                                        if(round < gameData.seasons[season].postSeasonSchedule.finals.length - 1){
                                            for(let b = 0; b < gameData.seasons[season].postSeasonSchedule.finals[round + 1].matchups.length; b++){
                                                let teamSeeds = gameData.seasons[season].postSeasonSchedule.seeds;
                                                for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.rules.numberOfPlayoffMatches; j++){
                                                    if(j % 2 == 0){
                                                        gameData.seasons[season].postSeasonSchedule.finals[round + 1].matchups[b].games[j].team1Id = teamSeeds[b];
                                                        gameData.seasons[season].postSeasonSchedule.finals[round + 1].matchups[b].games[j].team2Id = teamSeeds[teamSeeds.length - 1 - b];
                                                    }
                                                    else{
                                                        gameData.seasons[season].postSeasonSchedule.finals[round + 1].matchups[b].games[j].team2Id = teamSeeds[b];
                                                        gameData.seasons[season].postSeasonSchedule.finals[round + 1].matchups[b].games[j].team1Id = teamSeeds[teamSeeds.length - 1 - b];
                                                    }
                                                }
                                            }

                                        }
                                        else{   //saison terminée
                                            testAllTimeRecords(gameData, season)
                                        }
                                        
                                    }
                                    selectionOptions(gameData, season);
                                    button.dispatchEvent(new Event("click"));
                                }
                            });
                            divMatch.appendChild(gameButton);
                        }
                    }
                    else{           //si match joué
                        let divMatch = document.createElement("div");
                        divMatch.id = "divMatch";
                        gamesDiv.appendChild(divMatch);
        
                        let team1LogoContainer = document.createElement("div");
                        team1LogoContainer.className = "teamLogoContainer";
                        divMatch.appendChild(team1LogoContainer);
                        
                        let TeamLogoImg1 = document.createElement("img");
                        TeamLogoImg1.src = ".." + teams[finalMatchups[round].games[j].team1Id].logo + ".png";
                        TeamLogoImg1.className = "teamLogo";
                        team1LogoContainer.appendChild(TeamLogoImg1);
        
                        let divTeam1 = document.createElement("span");
                        divTeam1.className = "teamNamePS";
                        divTeam1.innerText = teams[finalMatchups[round].games[j].team1Id].name;
                        divTeam1.addEventListener("click", () => { //go to team page
                            gameDataJson = JSON.stringify(gameData);
                            sessionStorage.setItem("gameData", gameDataJson);
                            sessionStorage.setItem("team", finalMatchups[round].games[j].team1Id);
                            location.href = "../team/team.html";
                        });
                        divMatch.appendChild(divTeam1);
        
                        let inputGoalsTeam1 = document.createElement("span");
                        inputGoalsTeam1.className = "goalInput";
                        inputGoalsTeam1.style.width = "34px";
                        inputGoalsTeam1.innerText = finalMatchups[round].games[j].team1Goals;
                        divMatch.appendChild(inputGoalsTeam1);
        
                        if(finalMatchups[round].games[j].team1GoalsAddTime != "" && finalMatchups[round].games[j].team1GoalsAddTime != undefined){
                            let inputGoalsAddTimeTeam1 = document.createElement("span");
                            inputGoalsAddTimeTeam1.className = "goalInput";
                            inputGoalsAddTimeTeam1.style.fontSize = "12px";
                            //inputGoalsAddTimeTeam1.style.width = "25px";
                            inputGoalsAddTimeTeam1.innerText = finalMatchups[round].games[j].team1GoalsAddTime;
                            inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                            divMatch.appendChild(inputGoalsAddTimeTeam1);
                        }
                        else{
                            inputGoalsTeam1.style.width = "69px";
                        }
        
                        let spanVS = document.createElement("span");
                        spanVS.innerText = " VS ";
                        spanVS.id = "spanVS";
                        divMatch.appendChild(spanVS);
        
                        if(finalMatchups[round].games[j].team2GoalsAddTime != "" && finalMatchups[round].games[j].team2GoalsAddTime != undefined){
                            let inputGoalsAddTimeTeam2 = document.createElement("span");
                            inputGoalsAddTimeTeam2.className = "goalInput";
                            inputGoalsAddTimeTeam2.style.fontSize = "12px";
                            inputGoalsAddTimeTeam2.innerText = finalMatchups[round].games[j].team2GoalsAddTime;
                            //inputGoalsAddTimeTeam2.style.width = "25px";
                            inputGoalsAddTimeTeam2.style.marginRight = "1px";
                            divMatch.appendChild(inputGoalsAddTimeTeam2);
                        }
        
                        let inputGoalsTeam2 = document.createElement("span");
                        inputGoalsTeam2.className = "goalInput";
                        inputGoalsTeam2.style.width = "34px";
                        inputGoalsTeam2.innerText = finalMatchups[round].games[j].team2Goals;
                        divMatch.appendChild(inputGoalsTeam2);
        
                        if(!(finalMatchups[round].games[j].team2GoalsAddTime != "" && finalMatchups[round].games[j].team2GoalsAddTime != undefined)){
                            inputGoalsTeam2.style.width = "69px";
                        }
        
                        let divTeam2 = document.createElement("span");
                        divTeam2.className = "teamNamePS";
                        divTeam2.innerText = teams[finalMatchups[round].games[j].team2Id].name;
                        divTeam2.addEventListener("click", () => { //go to team page
                            gameDataJson = JSON.stringify(gameData);
                            sessionStorage.setItem("gameData", gameDataJson);
                            sessionStorage.setItem("team", finalMatchups[round].games[j].team2Id);
                            location.href = "../team/team.html";
                        });
                        divMatch.appendChild(divTeam2);
        
                        let team2LogoContainer = document.createElement("div");
                        team2LogoContainer.className = "teamLogoContainer";
                        divMatch.appendChild(team2LogoContainer);
                        
                        let TeamLogoImg2 = document.createElement("img");
                        TeamLogoImg2.src = ".." + teams[finalMatchups[round].games[j].team2Id].logo + ".png";
                        TeamLogoImg2.className = "teamLogo";
                        team2LogoContainer.appendChild(TeamLogoImg2);
        
                        if(Number(finalMatchups[round].games[j].team1Goals) > Number(finalMatchups[round].games[j].team2Goals)){
                            divTeam1.style.fontWeight = "bold";
                            divTeam2.style.fontStyle = "italic";
                        }
                        else if (Number(finalMatchups[round].games[j].team1Goals) < Number(finalMatchups[round].games[j].team2Goals)){
                            divTeam2.style.fontWeight = "bold";
                            divTeam1.style.fontStyle = "italic";
                        }
                        else{
                            if(Number(finalMatchups[round].games[j].team1GoalsAddTime) > Number(finalMatchups[round].games[j].team2GoalsAddTime)){
                                divTeam1.style.fontWeight = "bold";
                                divTeam2.style.fontStyle = "italic";
                            }
                            else{
                                divTeam2.style.fontWeight = "bold";
                                divTeam1.style.fontStyle = "italic";
                            }
                        }
        
                        if(finalMatchups[round].loser == finalMatchups[round].games[0].team1Id){
                            if(j % 2 == 0){
                                divTeam1.style.textDecoration = "line-through";
                            }
                            else{
                                divTeam2.style.textDecoration = "line-through";
                            }
                        }
                        else if (finalMatchups[round].loser == finalMatchups[round].games[0].team2Id){
                            if(j % 2 != 0){
                                divTeam1.style.textDecoration = "line-through";
                            }
                            else{
                                divTeam2.style.textDecoration = "line-through";
                            }
                        }
                    }
                }
                let br = document.createElement("br");
                br.id ="5";
                gamesDiv.appendChild(br);
                if(round == gameData.seasons[season].postSeasonSchedule.finals.length - 1 && gameData.seasons[season].postSeasonSchedule.finals[round].completed == "yes"){
                    printChampion(gameData.seasons[season].postSeasonSchedule.finals[round].matchups[0].winner);
                    gameData = addChampionToData(gameData, gameData.seasons[season].postSeasonSchedule.finals[round].matchups[0].winner);
                    removeTradePower(gameData);
                }
        }
    }
}

function removeTradePower(gameData){
    for(let i = 0; i < gameData.teams.length; i++){
        let powerToBeRetained = Math.random() * gameData.teams[i].tradePower;
        gameData.teams[i].power += powerToBeRetained;
        gameData.teams[i].tradePower = 0;
    }
}


function addChampionToData(gameData, team){
    let newTeam = true
    for(let i = 0; i < gameData.records.postSeason.titles.mostTitles.teams.length; i++){
        if(gameData.records.postSeason.titles.mostTitles.teams[i].teamId == team){
            if(gameData.records.postSeason.titles.mostTitles.teams[i].seasonsId.indexOf(season) < 0 || gameData.records.postSeason.titles.mostTitles.teams[i].seasonsId.indexOf(Number(season)) >= 0){
                gameData.records.postSeason.titles.mostTitles.teams[i].seasonsId.push(season);
                gameData.records.postSeason.titles.mostTitles.teams[i].record++
            }
            newTeam = false;
        }
    }
    if(newTeam){
        let newTeam = {
            "teamId": team,
            "seasonsId": [
                season
            ],
            "record": 1
        }
        gameData.records.postSeason.titles.mostTitles.teams.push(newTeam)
    }

    //rearrange data
    gameData.records.postSeason.titles.mostTitles.teams.sort((left, right) => {
        if(left.record > right.record){
            return -1
        }
        else{
            return 1
        }
    })
    
    return gameData
}

let congratulations = document.createElement("h3");
let championsDiv = document.createElement("div");
function printChampion (championId){
    congratulations.innerText = `${gameData.seasons[season].date} Phegsael Hockey League Champions:`
    seasonContainer.appendChild(congratulations);

    championsDiv.id = "championDiv";
    championsDiv.style.border = `5px solid ${gameData.teams[championId].color}`;
    championsDiv.style.width = "470px";
    championsDiv.style.margin = "3px";
    seasonContainer.appendChild(championsDiv);

    let trophy = document.createElement("img");
    trophy.id = "trophy"; 
    trophy.style.width = "120px";
    trophy.marginLeft = "5px";
    trophy.style.display = "inline-block";
    trophy.src = "../graphics/trophy/trophy.png";
    championsDiv.appendChild(trophy);

    let team = document.createElement("div");
    team.style.display = "inline-block";
    team.style.textAlign = "center";
    team.style.width = "350px";
    championsDiv.appendChild(team);

    let teamName = document.createElement("div");
    teamName.innerText = `${gameData.teams[championId].name}`;
    teamName.style.fontWeight = "bold";
    teamName.style.fontSize = "35px";
    teamName.style.textAlign = "center";
    team.appendChild(teamName);

    let teamLogo = document.createElement("img");
    teamLogo.src = `..${gameData.teams[championId].logo}.png`;
    teamLogo.style.height = "80px";
    team.appendChild(teamLogo);
}

function selectionOptions (gameData, season){
    select.innerHTML = "";
    for(let i = 0; i < gameData.seasons[season].schedule.length; i++){
        if(gameData.seasons[season].schedule[i].completed == "yes"){
            let option = document.createElement("option");
            option.innerText = `Round ${i + 1} / ${gameData.seasons[season].schedule.length}`;
            option.value = i;
            select.appendChild(option);
            if(i == gameData.seasons[season].schedule.length - 1){
                option.selected = "selected";
            }
            else if(gameData.seasons[season].schedule[i + 1].completed == "no"){
                option.selected = "selected";
            }
        }
        else{
            let option = document.createElement("option");
            option.innerText = `Round ${i + 1} / ${gameData.seasons[season].schedule.length}`;
            option.value = i;
            option.selected = "selected";
            select.appendChild(option);
            i = gameData.seasons[season].schedule.length;
        }
    }
    if(gameData.seasons[season].schedule[gameData.seasons[season].schedule.length - 1].completed == "yes"){
        if(season <= 11 && gameData.seasons[0].endDate != 1){
            for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.length; i++){
                let option = document.createElement("option");
                option.innerText = `Post-season ${i + 1} Round`;
                option.value = i + gameData.seasons[season].schedule.length;
                select.appendChild(option);
                if(gameData.seasons[season].postSeasonSchedule[i].completed == "no"){
                    option.selected = "selected";
                    i = gameData.seasons[season].postSeasonSchedule.length;
                }
                else{
                    option.selected = "selected";
                }
            }
        }
        else{
            for(let i = 0; i < Math.log2(gameData.seasons[season].postSeasonSchedule.rules.postSeasonTeams); i++){
                let option = document.createElement("option");
                ///text for conference finals and finals !!!CHANGE!!!
                option.innerText = `Post-season ${i + 1} Round`;
                option.value = i + gameData.seasons[season].schedule.length;
                select.appendChild(option);
                if(i >= gameData.seasons[season].postSeasonSchedule.conference[0].length){
                    if(gameData.seasons[season].postSeasonSchedule.finals[i - gameData.seasons[season].postSeasonSchedule.conference[0].length].completed == "no"){
                        option.selected = "selected";
                        i = gameData.seasons[season].postSeasonSchedule.length;
                    }
                    else{
                        option.selected = "selected";
                    }
                }
                else if(gameData.seasons[season].postSeasonSchedule.conference[0][i].completed == "no"){
                    option.selected = "selected";
                    i = gameData.seasons[season].postSeasonSchedule.length;
                }
                else{ 
                    option.selected = "selected";
                }
            }
        }
    }
}

let select = document.createElement("select");
seasonContainer.appendChild(select);
selectionOptions(gameData, season);
select[select.length - 1].selected = "selected";




//conferences/divisions
let divisionsFactor = "league";

let divisionStandingsChoice = document.createElement("button");
let leagueStandingsChoice = document.createElement("button");
let conferenceStandingsChoice = document.createElement("button");
if(conferenceNumber > 1){
    conferenceStandingsChoice.innerText = "Conference";
    conferenceStandingsChoice.addEventListener("click", () =>{
        standingsContainer.innerHTML = "";
        //conference Standings
        for(let i = 0; i < conferenceNumber; i++){
            let conferenceName = document.createElement("div");
            conferenceName.innerText = `${gameData.seasons[season].teams.conference[i].name} Conference`;
            standingsContainer.appendChild(conferenceName);
            let teamChoice = gameData.seasons[season].teams.conference[i].teamsInConference;
            if(homeAwayFactor == "All"){
                let teams = standings(gameData,teamChoice, season, round, sortingType);
                let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
                printStandings(teams, placeTeams);
            }
            else if(homeAwayFactor == "Home"){
                let teams = standingsHome(gameData, teamChoice, season, round, "Pts%");
                printStandingsHome(teams);
            }
            else if(homeAwayFactor == "Away"){
                let teams = standingsAway(gameData,teamChoice, season, round, "Pts%");
                printStandingsAway(teams);
            }
            /* let br = document.createElement("br");
            br.id ="6";
            seasonContainer.appendChild(br); */
        }
        divisionStandingsChoice.style.display = "inline-block";
        leagueStandingsChoice.style.display = "inline-block";
        conferenceStandingsChoice.style.display = "none";
        divisionsFactor = "conference";
    });
    divisionsFactor = "conference";
    standingsContainerContainer.appendChild(conferenceStandingsChoice);
}
if(divisionNumber > 1){
    divisionStandingsChoice.innerText = "Division";
    divisionStandingsChoice.addEventListener("click", () =>{
        standingsContainer.innerHTML = "";
        //division Standings
        for(let i = 0; i < conferenceNumber; i++){
            for(let j = 0; j < divisionNumber; j++){
                let divisionName = document.createElement("div");
                divisionName.innerText = `${gameData.seasons[season].teams.conference[i].divisions[j].name} Division`;
                standingsContainer.appendChild(divisionName);
                let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                if(homeAwayFactor == "All"){
                    let teams = standings(gameData,teamChoice, season, round, sortingType);
                    let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
                    printStandings(teams, placeTeams);
                }
                else if(homeAwayFactor == "Home"){
                    let teams = standingsHome(gameData, teamChoice, season, round, "Pts%");
                    printStandingsHome(teams);
                }
                else if(homeAwayFactor == "Away"){
                    let teams = standingsAway(gameData,teamChoice, season, round, "Pts%");
                    printStandingsAway(teams);
                }
                /* let br = document.createElement("br");
                br.id ="7";
                seasonContainer.appendChild(br); */
            }
        }
        divisionStandingsChoice.style.display = "none";
        leagueStandingsChoice.style.display = "inline-block";
        conferenceStandingsChoice.style.display = "inline-block";
        divisionsFactor = "division";
    });
    divisionsFactor = "division";
    standingsContainerContainer.appendChild(divisionStandingsChoice);
}
if(divisionNumber > 1 || conferenceNumber > 1){
    leagueStandingsChoice.innerText = "League";
    leagueStandingsChoice.style.display = "none";
    leagueStandingsChoice.addEventListener("click", () =>{
        standingsContainer.innerHTML = "";
        
        let leagueName = document.createElement("div");
        leagueName.innerText = `League`;
        standingsContainer.appendChild(leagueName);
        //league Standings
        let teamChoice = gameData.seasons[season].teams.allTeams;
        if(homeAwayFactor == "All"){
            let teams = standings(gameData,teamChoice, season, round, sortingType);
            let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
            printStandings(teams, placeTeams);
        }
        else if(homeAwayFactor == "Home"){
            let teams = standingsHome(gameData, teamChoice, season, round, "Pts%");
            printStandingsHome(teams);
        }
        else if(homeAwayFactor == "Away"){
            let teams = standingsAway(gameData,teamChoice, season, round, "Pts%");
            printStandingsAway(teams);
        }
        divisionStandingsChoice.style.display = "inline-block";
        leagueStandingsChoice.style.display = "none";
        conferenceStandingsChoice.style.display = "inline-block";
        divisionsFactor = "league";
    });
    standingsContainerContainer.appendChild(leagueStandingsChoice);
}

let round = select.value;
let boolRegularSeason = true;
let button = document.createElement("button");
button.innerText = "Change Round";
seasonContainer.appendChild(button);
let gamesDiv = document.createElement("div");
gamesDiv.className = "gamesDiv";
seasonContainer.appendChild(gamesDiv);

let eventDispatched = false;
button.addEventListener("click", () => {
    standingsContainer.innerHTML = "";
    gamesDiv.innerHTML = "";
    congratulations.innerHTML = "";
    championsDiv.innerHTML = "";
    championsDiv.style.border = "0px";
    standingsAllButton.style.display = "none";
    standingsHomeButton.style.display = "inline-block";
    standingsAwayButton.style.display = "inline-block";
    round = select.value;
    if(round < gameData.seasons[season].schedule.length){
        if(boolStandings == true){
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = [];
            teams = standings(gameData, teamChoice, season, round, sortingType);
            let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
            printStandings(teams, placeTeams);
        }
        gamesRound(gameData, season, round);
        boolRegularSeason = true;
        standingsHomeButton.style.display = "inline-block";
        standingsAwayButton.style.display = "inline-block";
        conferenceStandingsChoice.style.display = "inline-block";
        divisionStandingsChoice.style.display = "inline-block";
        if(eventDispatched == false){
            if(divisionsFactor == "conference"){
                conferenceStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "division"){
                divisionStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "league"){
                leagueStandingsChoice.dispatchEvent(new Event("click"));
            }
        }
    }
    else{
        round = round - gameData.seasons[season].schedule.length
        gamesPostSeason(gameData, season, round);
        boolRegularSeason = false;
        standingsHomeButton.style.display = "none";
        standingsAwayButton.style.display = "none";
        standingsAllButton.style.display = "none";
        conferenceStandingsChoice.style.display = "none";
        leagueStandingsChoice.style.display = "none";
        divisionStandingsChoice.style.display = "none";
    }
    
    if(boolPredictions == true){
        expectations(select.value);
    }
    if(boolPowerRankings == true){
        printPowerRankings(select.value);
    }
    if(boolTradeLog == true){
        tradeLog(select.value);
    }
});

let previousRound = document.createElement("button");
previousRound.innerText = "Previous Round";
previousRound.addEventListener("click", () =>{
    if(boolRegularSeason == true){
        if(round != 0){
            round--;
        }
        else{
            round = select.value;
        }
    }
    else{
        if(round == 0){
            boolRegularSeason = true;
            round += gameData.seasons[season].schedule.length;
            round--;
        }
        else{
            round += gameData.seasons[season].schedule.length;
            round--;
        }
    }
    select.value = round;
    standingsContainer.innerHTML = "";
    gamesDiv.innerHTML = "";
    congratulations.innerHTML = "";
    championsDiv.innerHTML = "";
    championsDiv.style.border = "0px";
    standingsAllButton.style.display = "none";
    standingsHomeButton.style.display = "inline-block";
    standingsAwayButton.style.display = "inline-block";
    leagueStandingsChoice.style.display = "none";
    conferenceStandingsChoice.style.display = "inline-block";
    divisionStandingsChoice.style.display = "inline-block";
    if(round < gameData.seasons[season].schedule.length){
        //if(conferenceNumber == 1 && divisionNumber == 1){
            if(boolStandings == true){
                let teamChoice = gameData.seasons[season].teams.allTeams;
                let teams = [];
                teams = standings(gameData, teamChoice, season, round, sortingType);
                let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
                printStandings(teams, placeTeams);
            }
            gamesRound(gameData, season, round);
            boolRegularSeason = true;
            standingsHomeButton.style.display = "inline-block";
            standingsAwayButton.style.display = "inline-block";
            conferenceStandingsChoice.style.display = "inline-block";
            divisionStandingsChoice.style.display = "inline-block";
            if(divisionsFactor == "conference"){
                conferenceStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "division"){
                divisionStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "league"){
                leagueStandingsChoice.dispatchEvent(new Event("click"));
            }
            
        //}
    }
    else{
        round = round - gameData.seasons[season].schedule.length
        gamesPostSeason(gameData, season, round);
        boolRegularSeason = false;
        standingsHomeButton.style.display = "none";
        standingsAwayButton.style.display = "none";
        standingsAllButton.style.display = "none";
        conferenceStandingsChoice.style.display = "none";
        leagueStandingsChoice.style.display = "none";
        divisionStandingsChoice.style.display = "none";
    }

    if(boolPredictions == true){
        expectations(select.value)
    }
    if(boolPowerRankings == true){
        printPowerRankings(select.value);
    }
    if(boolTradeLog == true){
        tradeLog(select.value);
    }
});
seasonContainer.appendChild(previousRound);

let nextRound = document.createElement("button");
nextRound.innerText = "Next Round";
nextRound.addEventListener("click", () => {
    if(boolRegularSeason == true){
        if(season <= 11 && gameData.seasons[0].endDate != 1){
            if(round == gameData.seasons[season].schedule.length - 1 && gameData.seasons[season].postSeasonSchedule[0].completed == "yes"){
                boolRegularSeason = false;
                round++;
            }
            else if(gameData.seasons[season].schedule[round].completed == "yes"){
                round++;
            }
            else{
                round = select.value;
            }
        }
        else{
            if(round == gameData.seasons[season].schedule.length - 1 && gameData.seasons[season].postSeasonSchedule.conference[0].completed == "yes"){
                boolRegularSeason = false;
                round++;
            }
            else if(gameData.seasons[season].schedule[round].completed == "yes"){
                round++;
            }
            else{
                round = select.value;
            }
        }
    }
    else{
        if(season <= 11 && gameData.seasons[0].endDate != 1){
            if(round != gameData.seasons[season].postSeasonSchedule.length - 1 && gameData.seasons[season].postSeasonSchedule[round].completed == "yes"){
                round += gameData.seasons[season].schedule.length;
                round++;
            }
            else{
                round = select.value;
            }
        }
        else{
            let postSeasonRounds = Math.log2(gameData.seasons[season].postSeasonSchedule.rules.postSeasonTeams);
            if(round <= postSeasonRounds){
                if(round < gameData.seasons[season].postSeasonSchedule.conference[0].length){
                    if(gameData.seasons[season].postSeasonSchedule.conference[0][round].completed == "yes"){
                        round += gameData.seasons[season].schedule.length;
                        round++;
                    }
                    else{
                        round = select.value;
                    }
                }
                else{
                    round = round - gameData.seasons[season].postSeasonSchedule.conference[0].length;
                    if(gameData.seasons[season].postSeasonSchedule.finals[round].completed == "yes"){
                        round += gameData.seasons[season].schedule.length;
                        round++;
                    }
                    else{
                        round = select.value;
                    }
                }
            }
            else{
                round = select.value;
            }
        }
    }
    select.value = round;
    standingsContainer.innerHTML = "";
    gamesDiv.innerHTML = "";
    congratulations.innerHTML = "";
    championsDiv.innerHTML = "";
    championsDiv.style.border = "0px";
    standingsAllButton.style.display = "none";
    leagueStandingsChoice.style.display = "none";
    standingsHomeButton.style.display = "inline-block";
    standingsAwayButton.style.display = "inline-block";
    if(round < gameData.seasons[season].schedule.length){
        //if(conferenceNumber == 1 && divisionNumber == 1){
            if(boolStandings == true){
                let teamChoice = gameData.seasons[season].teams.allTeams;
                let teams = [];
                teams = standings(gameData, teamChoice, season, round, sortingType);
                let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
                printStandings(teams, placeTeams);
            }
            gamesRound(gameData, season, round);
            boolRegularSeason = true;
            standingsHomeButton.style.display = "inline-block";
            standingsAwayButton.style.display = "inline-block";
            conferenceStandingsChoice.style.display = "inline-block";
            divisionStandingsChoice.style.display = "inline-block";
            if(divisionsFactor == "conference"){
                conferenceStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "division"){
                divisionStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "league"){
                leagueStandingsChoice.dispatchEvent(new Event("click"));
            }
        //}
    }
    else{
        round = round - gameData.seasons[season].schedule.length
        gamesPostSeason(gameData, season, round);
        boolRegularSeason = false;
        standingsHomeButton.style.display = "none";
        standingsAwayButton.style.display = "none";
        standingsAllButton.style.display = "none";
        conferenceStandingsChoice.style.display = "none";
        leagueStandingsChoice.style.display = "none";
        divisionStandingsChoice.style.display = "none";
    }

    if(boolPredictions == true){
        expectations(select.value);
    }
    if(boolPowerRankings == true){
        printPowerRankings(select.value);
    }
    if(boolTradeLog == true){
        tradeLog(select.value);
    }
});
seasonContainer.appendChild(nextRound);

if(select.value < gameData.seasons[season].schedule.length){
    //if(conferenceNumber == 1 && divisionNumber == 1){
        if(boolStandings == true){
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = [];
            teams = standings(gameData, teamChoice, season, round, sortingType);
            let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
            printStandings(teams, placeTeams)
        }
        gamesRound(gameData, season, round);
        boolRegularSeason = true;
        homeAwayFactor = "All";
        if(divisionsFactor == "conference"){
            conferenceStandingsChoice.dispatchEvent(new Event("click"));
        }
        else if(divisionsFactor == "division"){
            divisionStandingsChoice.dispatchEvent(new Event("click"));
        }
        else if(divisionsFactor == "league"){
            leagueStandingsChoice.dispatchEvent(new Event("click"));
        }
    //}
}
else{
    round = round - gameData.seasons[season].schedule.length
    gamesPostSeason(gameData, season, round);
    boolRegularSeason = false;
}


//standings Home and Away


let standingsHomeButton = document.createElement("button");
let standingsAwayButton = document.createElement("button");
let standingsAllButton = document.createElement("button");

standingsHomeButton.innerText = "Home";
standingsHomeButton.addEventListener("click", () =>{
    standingsContainer.innerHTML = "";
    //if(conferenceNumber == 1 && divisionNumber == 1){
        if(divisionsFactor == "league"){
            printStandingsHome(teams);
            let leagueName = document.createElement("div");
            leagueName.innerText = `League`;
            standingsContainer.appendChild(leagueName);
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = standingsHome(gameData, teamChoice, season, round, "Pts%");
        }
        else if(divisionsFactor == "conference"){
            for(let i = 0; i < conferenceNumber; i++){
                printStandingsHome(teams);
                let conferenceName = document.createElement("div");
                conferenceName.innerText = `${gameData.seasons[season].teams.conference[i].name} Conference`;
                standingsContainer.appendChild(conferenceName);
                let teamChoice = gameData.seasons[season].teams.conference[i].teamsInConference;
                let teams = standingsHome(gameData, teamChoice, season, round, "Pts%");
            }
        }
        else if(divisionsFactor == "division"){
            for(let i = 0; i < conferenceNumber; i++){
                for(let j = 0; j < divisionNumber; j++){
                    printStandingsHome(teams);
                    let divisionName = document.createElement("div");
                    divisionName.innerText = `${gameData.seasons[season].teams.conference[i].divisions[j].name} Division`;
                    standingsContainer.appendChild(divisionName);
                    let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                    let teams = standingsHome(gameData, teamChoice, season, round, "Pts%");
                }
            }
        }
        standingsAllButton.style.display = "inline-block";
        standingsAwayButton.style.display = "inline-block";
        standingsHomeButton.style.display = "none";
        homeAwayFactor = "Home";
    //}
});
standingsContainerContainer.appendChild(standingsHomeButton);

standingsAwayButton.innerText = "Away";
standingsAwayButton.addEventListener("click", () =>{
    standingsContainer.innerHTML = "";
    //if(conferenceNumber == 1 && divisionNumber == 1){
        if(divisionsFactor == "league"){
            printStandingsAway(teams);
            let leagueName = document.createElement("div");
            leagueName.innerText = `League`;
            standingsContainer.appendChild(leagueName);
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = standingsAway(gameData, teamChoice, season, round, "Pts%");
        }
        else if(divisionsFactor == "conference"){
            for(let i = 0; i < conferenceNumber; i++){
                printStandingsAway(teams);
                let conferenceName = document.createElement("div");
                conferenceName.innerText = `${gameData.seasons[season].teams.conference[i].name} Conference`;
                standingsContainer.appendChild(conferenceName);
                let teamChoice = gameData.seasons[season].teams.conference[i].teamsInConference;
                let teams = standingsAway(gameData, teamChoice, season, round, "Pts%");
            }
        }
        else if(divisionsFactor == "division"){
            for(let i = 0; i < conferenceNumber; i++){
                for(let j = 0; j < divisionNumber; j++){
                    printStandingsAway(teams);
                    let divisionName = document.createElement("div");
                    divisionName.innerText = `${gameData.seasons[season].teams.conference[i].divisions[j].name} Division`;
                    standingsContainer.appendChild(divisionName);
                    let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                    let teams = standingsAway(gameData, teamChoice, season, round, "Pts%");
                }
            }
        }
        standingsAllButton.style.display = "inline-block";
        standingsHomeButton.style.display = "inline-block";
        standingsAwayButton.style.display = "none";
        homeAwayFactor = "Away";
    //}
});
standingsContainerContainer.appendChild(standingsAwayButton);

standingsAllButton.innerText = "All";
standingsAllButton.style.display = "none";
standingsAllButton.addEventListener("click", () => {
    standingsContainer.innerHTML = "";
    //if(conferenceNumber == 1 && divisionNumber == 1){
        if(divisionsFactor == "league"){
            printStandings(teams, placeTeams);
            let leagueName = document.createElement("div");
            leagueName.innerText = `League`;
            standingsContainer.appendChild(leagueName);
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = standings(gameData, teamChoice, season, round, sortingType);
            let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
        }
        else if(divisionsFactor == "conference"){
            for(let i = 0; i < conferenceNumber; i++){
                printStandings(teams, placeTeams);
                let conferenceName = document.createElement("div");
                conferenceName.innerText = `${gameData.seasons[season].teams.conference[i].name} Conference`;
                standingsContainer.appendChild(conferenceName);
                let teamChoice = gameData.seasons[season].teams.conference[i].teamsInConference;
                let teams = standings(gameData, teamChoice, season, round, sortingType);
                let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
            }
        }
        else if(divisionsFactor == "division"){
            for(let i = 0; i < conferenceNumber; i++){
                for(let j = 0; j < divisionNumber; j++){
                    printStandings(teams, placeTeams);
                    let divisionName = document.createElement("div");
                    divisionName.innerText = `${gameData.seasons[season].teams.conference[i].divisions[j].name} Division`;
                    standingsContainer.appendChild(divisionName);
                    let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                    let teams = standings(gameData, teamChoice, season, round, sortingType);
                    let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
                }
            }
        }
        standingsAllButton.style.display = "none";
        standingsHomeButton.style.display = "inline-block";
        standingsAwayButton.style.display = "inline-block";
        homeAwayFactor = "All";
    //}
});
standingsContainerContainer.appendChild(standingsAllButton);

if(boolRegularSeason == false){
    standingsAllButton.style.display = "none";
    standingsHomeButton.style.display = "none";
    standingsAwayButton.style.display = "none";
    conferenceStandingsChoice.style.display = "none";
    leagueStandingsChoice.style.display = "none";
    divisionStandingsChoice.style.display = "none";
}

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



//left side of season:

let leftSide = document.createElement("div");
leftSide.className = "season_leftSide";
gameContents.appendChild(leftSide);

let leftSideButtons = document.createElement("div");
leftSideButtons.className = "season_leftSideButtons";
leftSide.appendChild(leftSideButtons);

let buttonLeftSideStandings = document.createElement("button");
buttonLeftSideStandings.innerText = "Standings";
buttonLeftSideStandings.style.display = "inline-block";
buttonLeftSideStandings.className = "season_leftSideButton";
leftSideButtons.appendChild(buttonLeftSideStandings);
buttonLeftSideStandings.addEventListener("click", () => {
    powerRankingsContainer.innerHTML = "";
    standingsContainerContainer.style.display = "block";
    standingsContainer.innerHTML = "";
    seasonProbabilitiesContainer.innerHTML = "";
    previousTrades.innerHTML = "";
    boolTradeLog = false;
    boolStandings = true;
    boolPowerRankings = false;
    boolPredictions = false;

    if(boolRegularSeason == true){
        let teamChoice = gameData.seasons[season].teams.allTeams;
        let teams = [];
        teams = standings(gameData, teamChoice, season, round, sortingType);
        let placeTeams = standings(gameData, teamChoice, season, round, "Pts");
        printStandings(teams, placeTeams);
        standingsHomeButton.style.display = "inline-block";
        standingsAwayButton.style.display = "inline-block";
        conferenceStandingsChoice.style.display = "inline-block";
        divisionStandingsChoice.style.display = "inline-block";
        if(eventDispatched == false){
            if(divisionsFactor == "conference"){
                conferenceStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "division"){
                divisionStandingsChoice.dispatchEvent(new Event("click"));
            }
            else if(divisionsFactor == "league"){
                leagueStandingsChoice.dispatchEvent(new Event("click"));
            }
        }
    }
})

let buttonLeftSidePR = document.createElement("button");
buttonLeftSidePR.innerText = "Power Rankings";
buttonLeftSidePR.className = "season_leftSideButton";
buttonLeftSidePR.style.display = "inline-block";
leftSideButtons.appendChild(buttonLeftSidePR);
buttonLeftSidePR.addEventListener("click", () => {
    powerRankingsContainer.innerHTML = "";
    standingsContainerContainer.style.display = "none";
    seasonProbabilitiesContainer.innerHTML = "";
    previousTrades.innerHTML = "";
    standingsContainer.innerHTML = "";
    boolTradeLog = false;
    boolStandings = false;
    boolPowerRankings = true;
    boolPredictions = false;
    printPowerRankings(select.value);
})

let buttonLeftSideSP = document.createElement("button");
buttonLeftSideSP.innerText = "Season Predictions";
buttonLeftSideSP.style.display = "inline-block";
buttonLeftSideSP.className = "season_leftSideButton";
leftSideButtons.appendChild(buttonLeftSideSP);
buttonLeftSideSP.addEventListener("click", () => {
    powerRankingsContainer.innerHTML = "";
    standingsContainerContainer.style.display = "none";
    seasonProbabilitiesContainer.innerHTML = "";
    previousTrades.innerHTML = "";
    standingsContainer.innerHTML = "";
    boolTradeLog = false;
    boolStandings = false;
    boolPowerRankings = false;
    boolPredictions = true;
    expectations(select.value);
})

let buttonLeftSideTL = document.createElement("button");
buttonLeftSideTL.innerText = "Trade Log";
buttonLeftSideTL.style.display = "inline-block";
buttonLeftSideTL.className = "season_leftSideButton";
leftSideButtons.appendChild(buttonLeftSideTL);
buttonLeftSideTL.addEventListener("click", () => {
    standingsContainer.innerHTML = "";
    standingsContainerContainer.style.display = "none";
    powerRankingsContainer.innerHTML = "";
    seasonProbabilitiesContainer.innerHTML = "";
    previousTrades.innerHTML = "";
    boolTradeLog = true;
    boolStandings = false;
    boolPowerRankings = false;
    boolPredictions = false;
    tradeLog(select.value);
})

standingsContainerContainer.className = "season_leftSideContainers";
leftSide.appendChild(standingsContainerContainer);


standingsContainer.className = "gridContainer";
standingsContainerContainer.appendChild(standingsContainer);




let seasonProbabilitiesContainer = document.createElement("div");
seasonProbabilitiesContainer.className = "season_leftSideContainers"
leftSide.appendChild(seasonProbabilitiesContainer)

function expectations(round){
    seasonProbabilitiesContainer.innerHTML = "";

    let expectationsTitle = document.createElement("h3");
    expectationsTitle.innerText = "Season Predictions";
    expectationsTitle.style.textAlign = "center";
    seasonProbabilitiesContainer.appendChild(expectationsTitle)
    //expectations:
    if(season > 46){
        let container = document.createElement("div");
        seasonProbabilitiesContainer.appendChild(container)
        container.style.display = "grid";
        container.style.gridTemplateColumns = "50px 250px 90px 90px 120px 120px";
        container.style.overflowY = "auto";
        container.style.width = "fit-content"

        let predictions;
        for(let i = gameData.seasons[season].predictions.length - 1; i >= 0; i--){
            if(Number(gameData.seasons[season].predictions[i].round) <= Number(round)){
                predictions = gameData.seasons[season].predictions[i]
                i = -1;
            }
        }
        let standings = [];
        let standingsOrdered = [];
        predictions.standings.forEach((value) => {standingsOrdered.push(value)})
        standingsOrdered.sort(function(a, b){return b-a})
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
                container.appendChild(place);

                let team = document.createElement("div")
                team.innerText = "Team";
                team.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(team);

                let playoffOdds = document.createElement("div")
                playoffOdds.innerText = "Playoff odds:";
                playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(playoffOdds);

                let firstOverallOdds = document.createElement("div")
                firstOverallOdds.innerText = "1st overall odds:";
                firstOverallOdds.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(firstOverallOdds);

                let expectations = document.createElement("div")
                expectations.innerText = "Expectations:";
                expectations.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(expectations);

                let playoffsLastYear = document.createElement("div")
                playoffsLastYear.innerText = "Playoffs Last Year:";
                playoffsLastYear.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(playoffsLastYear);
            }
            else{
                let place = document.createElement("div");
                place.innerText = i + 1;
                place.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(place);

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
                container.appendChild(teamName);
                //logo of team
                let logo = document.createElement("img"); 
                logo.className = "logo";
                logo.id = "logo";
                logo.src = ".." + gameData.teams[standings[i]].logo + ".png";
                teamName.appendChild(logo);  

                let playoffOdds = document.createElement("div")
                playoffOdds.innerText = predictions.playoffs[standings[i]] / 5 + "%";
                playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(playoffOdds);

                let firstOverallOdds = document.createElement("div")
                firstOverallOdds.innerText = predictions.lose[standings[i]] / 5 + "%";
                firstOverallOdds.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(firstOverallOdds);

                let expectations = document.createElement("div")
                expectations.className = "seasonPanel_winProbabilitiesRowSquare";
                container.appendChild(expectations);
                for(let k = 0; k < gameData.seasons[season].teams.allTeams.length; k++){
                    if(gameData.seasons[season].teams.allTeams[k].id == standings[i]){
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
                container.appendChild(playoffsLastYear);

                if(i % 2 == 0){
                    place.style.backgroundColor = "lightgray";
                    teamName.style.backgroundColor = "lightgray";
                    playoffOdds.style.backgroundColor = "lightgray";
                    expectations.style.backgroundColor = "lightgray";
                    playoffsLastYear.style.backgroundColor = "lightgray";
                    firstOverallOdds.style.backgroundColor = "lightgray";
                }
            }
        }

        if(round == select.length - 1 && boolRegularSeason == true && predictions.round != round){
            let redoPredictions = document.createElement("button");
            redoPredictions.innerText = "Reevaluate predictions";
            redoPredictions.style.width = "fit-content";
            seasonProbabilitiesContainer.appendChild(redoPredictions);
            redoPredictions.addEventListener("click", () => {
                let loadingScreen = document.getElementsByClassName("lds-roller");
                loadingScreen[0].style.display = "inline-block";
                console.log(loadingScreen[0])
                eventBackground.style.opacity = "0.5";
                eventBackground.style.display = "block";
                setTimeout(() => {
                    gameData.seasons[season].predictions.push(standingsFunctions.regularSeasonPredictions(gameData, round));
                    gameData = JSON.stringify(gameData);
                    sessionStorage.removeItem("gameData");
                    sessionStorage.setItem("gameData", gameData);
                    gameData = JSON.parse(gameData);
                    window.location.reload(false)
                }, 10)
            })
        }
    }
    else if(season > 32){
        seasonProbabilitiesContainer.style.display = "grid";
        seasonProbabilitiesContainer.style.gridTemplateColumns = "50px 250px 90px 120px 120px";
        seasonProbabilitiesContainer.style.marginLeft = "110px";
        seasonProbabilitiesContainer.style.marginTop = "100px";

        let predictions = gameData.seasons[season].predictions;
        let standings = [];
        let standingsOrdered = [];
        predictions.standings.forEach((value) => {standingsOrdered.push(value)})
        standingsOrdered.sort(function(a, b){return b-a})
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
                seasonProbabilitiesContainer.appendChild(place);

                let team = document.createElement("div")
                team.innerText = "Team";
                team.className = "seasonPanel_winProbabilitiesRowSquare";
                seasonProbabilitiesContainer.appendChild(team);

                let playoffOdds = document.createElement("div")
                playoffOdds.innerText = "Playoff odds:";
                playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
                seasonProbabilitiesContainer.appendChild(playoffOdds);

                let expectations = document.createElement("div")
                expectations.innerText = "Expectations:";
                expectations.className = "seasonPanel_winProbabilitiesRowSquare";
                seasonProbabilitiesContainer.appendChild(expectations);

                let playoffsLastYear = document.createElement("div")
                playoffsLastYear.innerText = "Playoffs Last Year:";
                playoffsLastYear.className = "seasonPanel_winProbabilitiesRowSquare";
                seasonProbabilitiesContainer.appendChild(playoffsLastYear);
            }
            else{
                let place = document.createElement("div");
                place.innerText = i + 1;
                place.className = "seasonPanel_winProbabilitiesRowSquare";
                seasonProbabilitiesContainer.appendChild(place);

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
                seasonProbabilitiesContainer.appendChild(teamName);
                //logo of team
                let logo = document.createElement("img"); 
                logo.className = "logo";
                logo.id = "logo";
                logo.src = ".." + gameData.teams[standings[i]].logo + ".png";
                teamName.appendChild(logo);  

                let playoffOdds = document.createElement("div")
                playoffOdds.innerText = predictions.playoffs[standings[i]] / 10 + "%";
                playoffOdds.className = "seasonPanel_winProbabilitiesRowSquare";
                seasonProbabilitiesContainer.appendChild(playoffOdds);

                let expectations = document.createElement("div")
                expectations.className = "seasonPanel_winProbabilitiesRowSquare";
                seasonProbabilitiesContainer.appendChild(expectations);
                for(let k = 0; k < gameData.seasons[season].teams.allTeams.length; k++){
                    if(gameData.seasons[season].teams.allTeams[k].id == standings[i]){
                        if(gameData.seasons[season].teams.allTeams[k].power + gameData.seasons[season].teams.allTeams[k].tradePower < 0.5){
                            expectations.innerText = "Tanking";
                        }
                        else if(gameData.seasons[season].teams.allTeams[k].power + gameData.seasons[season].teams.allTeams[k].tradePower < 0.8){
                            expectations.innerText = "None";
                        }
                        else if(gameData.seasons[season].teams.allTeams[k].power + gameData.seasons[season].teams.allTeams[k].tradePower < 1){
                            expectations.innerText = "Be competitive";
                        }
                        else if(gameData.seasons[season].teams.allTeams[k].power + gameData.seasons[season].teams.allTeams[k].tradePower < 1.1){
                            expectations.innerText = "Playoff Team";
                        }
                        else if(gameData.seasons[season].teams.allTeams[k].power + gameData.seasons[season].teams.allTeams[k].tradePower < 1.25){
                            expectations.innerText = "Dark horse"
                        }
                        else if(gameData.seasons[season].teams.allTeams[k].power + gameData.seasons[season].teams.allTeams[k].tradePower < 1.6){
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
                seasonProbabilitiesContainer.appendChild(playoffsLastYear);

                if(i % 2 == 0){
                    place.style.backgroundColor = "lightgray";
                    teamName.style.backgroundColor = "lightgray";
                    playoffOdds.style.backgroundColor = "lightgray";
                    expectations.style.backgroundColor = "lightgray";
                    playoffsLastYear.style.backgroundColor = "lightgray";
                }
            }
        }
    }
}

function powerRankingsF(round){
    let powerRankings = []
    //order power rankings: standings, power, recent form
    for(let i = 0; i < gameData.seasons[season].teams.allTeams.length; i++){
        let teamId = gameData.seasons[season].teams.allTeams[i].id;

        //point of team + last 10 games:
        let teamPoints = 0;
        let teamLast10Matches = [];
        let fiveMatches = 0;
        for(let j = round - 1; j >= 0; j--){
            for(let l = 0; l < gameData.seasons[season].schedule[j].games.length; l++){
                if(gameData.seasons[season].schedule[j].games[l].team1Id == teamId){
                    if(gameData.seasons[season].schedule[j].games[l].team1Goals > gameData.seasons[season].schedule[j].games[l].team2Goals){
                        teamLast10Matches.push({result: "V", place: "H", round: j, game: l})
                        if(fiveMatches < 5){
                            teamPoints += 3;
                            fiveMatches++;
                        }
                        else{
                            teamPoints += 3 * (j + 4) / round;
                        }
                    }
                    else if(gameData.seasons[season].schedule[j].games[l].team1Goals == gameData.seasons[season].schedule[j].games[l].team2Goals){
                        teamLast10Matches.push({result: "D", place: "H", round: j, game: l})
                        if(fiveMatches < 5){
                            teamPoints += 1;
                            fiveMatches++;
                        }
                        else{
                            teamPoints += 1 * (j + 4) / round;
                        }
                    }
                    else if(gameData.seasons[season].schedule[j].games[l].team1Goals < gameData.seasons[season].schedule[j].games[l].team2Goals){
                        if(fiveMatches < 5){
                            fiveMatches++;
                        }
                        teamLast10Matches.push({result: "L", place: "H", round: j, game: l})
                    }
                }
                else if(gameData.seasons[season].schedule[j].games[l].team2Id == teamId){
                    if(gameData.seasons[season].schedule[j].games[l].team1Goals > gameData.seasons[season].schedule[j].games[l].team2Goals){
                        teamLast10Matches.push({result: "L", place: "A", round: j, game: l})
                        if(fiveMatches < 5){
                            fiveMatches++;
                        }
                    }
                    else if(gameData.seasons[season].schedule[j].games[l].team1Goals == gameData.seasons[season].schedule[j].games[l].team2Goals){
                        if(fiveMatches < 5){
                            fiveMatches++;
                            teamPoints += 1;
                        }
                        else{
                            teamPoints += 1 * (j + 4) / round;
                        }
                        teamLast10Matches.push({result: "D", place: "A", round: j, game: l})
                    }
                    else if(gameData.seasons[season].schedule[j].games[l].team1Goals < gameData.seasons[season].schedule[j].games[l].team2Goals){
                        if(fiveMatches < 5){
                            fiveMatches++;
                            teamPoints += 3;
                        }
                        else{
                            teamPoints += 3 * (j + 4) / round;
                        }
                        teamLast10Matches.push({result: "V", place: "A", round: j, game: l})
                    }
                }
            }
        }
        teamPoints /= teamLast10Matches.length;
        /* let teamPower = gameData.seasons[season].teams.allTeams[i].power
        teamPoints *= (Math.pow(teamPower - 1, 3) + 1)/2; */

        if(teamLast10Matches.length > 10){
            teamLast10Matches.length = 10;
        }

        powerRankings.push({id: teamId, points: teamPoints, last10Matches: teamLast10Matches});
    }
    //reorder powerRankings by power:
    powerRankings.sort(function(left, right){
        if(left.points > right.points){
            return -1;
        }
        else{
            return 1;
        }
    });
    console.log(powerRankings)
    return powerRankings;
}

function printPowerRankings(round){
    if(boolRegularSeason == false){
        round = gameData.seasons[season].schedule.length
    }

    powerRankingsContainer.innerHTML = "";

    let powerRankings = powerRankingsF(round);

    let previousPowerRankings
    if(round > 0){
        previousPowerRankings = powerRankingsF(round - 1)
    }
    else{
        previousPowerRankings = powerRankings;
    }

    let powerRankingsTitle = document.createElement("h3");
    powerRankingsTitle.innerText = "Power Rankings";
    powerRankingsTitle.style.textAlign = "center";
    powerRankingsContainer.appendChild(powerRankingsTitle);

    let powerRankingsGrid = document.createElement("div");
    powerRankingsGrid.className = "season_powerRankingsGrid";
    powerRankingsContainer.appendChild(powerRankingsGrid);
    //print power rankings:
    for(let i = -1; i < gameData.seasons[season].teams.allTeams.length; i++){
        if(i == -1){
            //Changement
            let changement = document.createElement("div");
            changement.innerText = "Chg";
            changement.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(changement)

            //Number
            let number = document.createElement("div");
            number.innerText = "Pos";
            number.style.backgroundColor = "lightgray"
            number.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(number)

            //Team + Logo
            let team = document.createElement("div")
            team.innerText = "Team";
            team.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(team);

            //Last 10 Games
            let last10Games = document.createElement("div")
            last10Games.innerText = "Last 10 Games";
            last10Games.style.backgroundColor = "lightgray"
            last10Games.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(last10Games);

            //Record
            let record = document.createElement("div")
            record.innerText = "Record";
            record.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(record);

            //Expectations
            let expectations = document.createElement("div")
            expectations.innerText = "Expectations";
            expectations.style.backgroundColor = "lightgray"
            expectations.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(expectations);
        }
        else{
            //Changement
            let changement = document.createElement("div");
            changement.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(changement);
            
            let teamIndexPreviousRound
            for(let j = 0; j < previousPowerRankings.length; j++){
                if(previousPowerRankings[j].id == powerRankings[i].id){
                    teamIndexPreviousRound = j
                }
            }

            if(teamIndexPreviousRound > i){
                changement.innerText = `${teamIndexPreviousRound - i}`;
                changement.style.backgroundColor = "green";
            }
            else if(teamIndexPreviousRound < i){
                changement.innerText = `${i - teamIndexPreviousRound}`;
                changement.style.backgroundColor = "red";
            }

            //Number
            let number = document.createElement("div");
            number.innerText = i + 1;
            number.style.backgroundColor = "lightgray"
            number.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(number)

            //Team + Logo
            let team = document.createElement("div");
            team.className = "season_powerRankingsElement";
            team.innerText = gameData.teams[powerRankings[i].id].name;
            team.addEventListener("click", () => { //go to team page
                let gameDataJson = JSON.stringify(gameData);
                sessionStorage.setItem("gameData", gameDataJson);
                sessionStorage.setItem("team", powerRankings[i].id);
                location.href = "../team/team.html";
            });
            powerRankingsGrid.appendChild(team);
                //logo of team
                let logo = document.createElement("img"); 
                logo.className = "logo";
                logo.id = "logo";
                logo.src = ".." + gameData.teams[powerRankings[i].id].logo + ".png";
                team.appendChild(logo); 
            
            //Last 10 games
            let last10Games = document.createElement("div")
            last10Games.style.backgroundColor = "lightgray"
            last10Games.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(last10Games);

            for(let j = powerRankings[i].last10Matches.length - 1; j >= 0; j--){
                let match = document.createElement("div");
                match.className = "season_powerRankingsElementMatch";
                last10Games.appendChild(match)

                if(powerRankings[i].last10Matches[j].result == "V"){
                    match.innerText = "V";
                    match.style.backgroundColor = "lightgreen";
                }
                else if(powerRankings[i].last10Matches[j].result == "D"){
                    match.innerText = "D";
                    match.style.backgroundColor = "orange";
                }
                else if(powerRankings[i].last10Matches[j].result == "L"){
                    match.innerText = "L";
                    match.style.backgroundColor = "red";
                }

                let round = powerRankings[i].last10Matches[j].round;
                let game = powerRankings[i].last10Matches[j].game;
                //hover --> popup showing the match:
                let hoverup = document.createElement("div");
                hoverup.className = "season_powerRankingsHoverup";
                match.appendChild(hoverup);
                    //Round:
                    let hoverupRound = document.createElement("div");
                    hoverupRound.innerText = `Round ${round + 1}`;
                    hoverup.appendChild(hoverupRound)
                    //Match:
                    let hoverupMatch = document.createElement("div");
                    hoverupMatch.className = "season_powerRankingsHoverupMatch";
                    hoverup.appendChild(hoverupMatch);
                        //logo1:
                        let hoverupLogo1 = document.createElement("img");
                        hoverupLogo1.src = ".." + gameData.teams[gameData.seasons[season].schedule[round].games[game].team1Id].logo + ".png"
                        hoverupLogo1.className = "logo";
                        hoverupMatch.appendChild(hoverupLogo1);
                        //team1:
                        let hoverupTeam1 = document.createElement("div");
                        hoverupTeam1.innerText = gameData.teams[gameData.seasons[season].schedule[round].games[game].team1Id].shortName;
                        hoverupTeam1.className = "season_powerRankingsHoverupMatchElement"
                        if(gameData.seasons[season].schedule[round].games[game].team1Id == powerRankings[i].id){
                            hoverupTeam1.style.fontWeight = "bold"
                        }
                        hoverupMatch.appendChild(hoverupTeam1);
                        //result1:
                        let hoverupResult1 = document.createElement("div");
                        hoverupResult1.innerText = gameData.seasons[season].schedule[round].games[game].team1Goals;
                        hoverupResult1.className = "season_powerRankingsHoverupMatchElement"
                        hoverupMatch.appendChild(hoverupResult1);
                        //VS:
                        let hoverupVS = document.createElement("div");
                        hoverupVS.innerText = "VS";
                        hoverupMatch.appendChild(hoverupVS);
                        hoverupVS.className = "season_powerRankingsHoverupMatchElement"
                        //result2:
                        let hoverupResult2 = document.createElement("div");
                        hoverupResult2.innerText = gameData.seasons[season].schedule[round].games[game].team2Goals;
                        hoverupResult2.className = "season_powerRankingsHoverupMatchElement"
                        hoverupMatch.appendChild(hoverupResult2);
                        //team2:
                        let hoverupTeam2 = document.createElement("div");
                        hoverupTeam2.innerText = gameData.teams[gameData.seasons[season].schedule[round].games[game].team2Id].shortName;
                        hoverupTeam2.className = "season_powerRankingsHoverupMatchElement"
                        if(gameData.seasons[season].schedule[round].games[game].team2Id == powerRankings[i].id){
                            hoverupTeam2.style.fontWeight = "bold"
                        }
                        hoverupMatch.appendChild(hoverupTeam2);
                        //logo2:
                        let hoverupLogo2 = document.createElement("img");
                        hoverupLogo2.src = ".." + gameData.teams[gameData.seasons[season].schedule[round].games[game].team2Id].logo + ".png"
                        hoverupLogo2.className = "logo";
                        hoverupMatch.appendChild(hoverupLogo2);

            }

            //record:
            let record = document.createElement("div")
            record.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(record);
            let victories = 0;
            let draws = 0;
            let losses = 0;
            for(let j = 0; j < powerRankings[i].last10Matches.length; j++){
                if(powerRankings[i].last10Matches[j].result == "V"){
                    victories++;
                }
                else if(powerRankings[i].last10Matches[j].result == "D"){
                    draws++;
                }
                else if(powerRankings[i].last10Matches[j].result == "L"){
                    losses++;
                }
            }
            record.innerText = `${victories}-${draws}-${losses}`;
            
            //Expectations
            let expectations = document.createElement("div")
            expectations.style.backgroundColor = "lightgray"
            expectations.className = "season_powerRankingsElement";
            powerRankingsGrid.appendChild(expectations);
            for(let k = 0; k < gameData.seasons[season].teams.allTeams.length; k++){
                if(gameData.seasons[season].teams.allTeams[k].id == powerRankings[i].id){
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
        }
    }
}

let powerRankingsContainer = document.createElement("div");
powerRankingsContainer.className = "season_leftSideContainers"
leftSide.appendChild(powerRankingsContainer)

leftSide.appendChild(previousTrades);
    
function tradeLog(round){
    previousTrades.innerHTML = ""
    let tradeLogInfo = document.createElement("h3");
    tradeLogInfo.innerText = "Trade Log";
    tradeLogInfo.style.textAlign = "center";
    previousTrades.appendChild(tradeLogInfo)
    if(season >= 40){
        for(let i = 0; i < gameData.seasons[season].trade.length; i++){
            if(Number(gameData.seasons[season].trade[i].round) <= round || boolRegularSeason == false){
                let trade = document.createElement("div");
                previousTrades.appendChild(trade);
                trade.innerText = `- Trade between ${gameData.teams[gameData.seasons[season].trade[i].buyer].name} and ${gameData.teams[gameData.seasons[season].trade[i].seller].name} (round ${gameData.seasons[season].trade[i].round})`;
                trade.addEventListener("click", () => {
                    let eventDescription = `A trade has occurred between ${gameData.teams[gameData.seasons[season].trade[i].buyer].name} and ${gameData.teams[gameData.seasons[season].trade[i].seller].name}.`;
                    let eventEffects = `${gameData.teams[gameData.seasons[season].trade[i].seller].name} receives:\n`
                    for(let j = 0; j < gameData.seasons[season].trade[i].picks.length; j++){
                        if(gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].pick + 1 == 1){
                            eventEffects += `- ${gameData.teams[gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].fromTeam].name}' ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].year + gameData.seasons[season].endDate} ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].pick + 1}st round pick\n`
                        }
                        else if(gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].pick + 1 == 2){
                            eventEffects += `- ${gameData.teams[gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].fromTeam].name}' ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].year + gameData.seasons[season].endDate} ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].pick + 1}nd round pick\n`
                        }
                        else if(gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].pick + 1 == 3){
                            eventEffects += `- ${gameData.teams[gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].fromTeam].name}' ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].year + gameData.seasons[season].endDate} ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].pick + 1}rd round pick\n`
                        }
                        else{
                            eventEffects += `- ${gameData.teams[gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].fromTeam].name}' ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].year + gameData.seasons[season].endDate} ${gameData.seasons[season].trade[i].assetsOfBuyer[gameData.seasons[season].trade[i].picks[j]].pick + 1}th round pick\n`
                        }
                    }
                    eventEffects += `\n${gameData.teams[gameData.seasons[season].trade[i].buyer].name} receives: ${gameData.seasons[season].trade[i].power.toFixed(3)} power in players` //place holder
                    events.events(eventDiv, eventBackground, "Trade!", eventDescription, eventEffects);  
                })
            }
        }
    }
}

if(boolRegularSeason == false){
    standingsContainerContainer.style.display = "none";
    printPowerRankings(select.value);
}

