//import * as records from './records.mjs';
const records = require("./records.js");
let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");

let endDate = gameData.seasons[season].endDate;
let startDate = parseInt(gameData.seasons[season].endDate) - 1;
let seasonTitle = document.createElement("h3");
seasonTitle.innerText = startDate + "-" + endDate + " Season";
document.body.appendChild(seasonTitle);

const conferenceNumber = gameData.seasons[season].teams.conference.length;
const divisionNumber = gameData.seasons[season].teams.conference[0].divisions.length;

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
                if(schedule[i].games[j].team1Goals > schedule[i].games[j].team2Goals){
                    victoriesHome++;
                }
                else if(schedule[i].games[j].team1Goals == schedule[i].games[j].team2Goals){
                    tiesHome++;
                }
                else if(schedule[i].games[j].team1Goals < schedule[i].games[j].team2Goals){
                    defeatsHome++;
                }
                goalsScoredHome += parseInt(schedule[i].games[j].team1Goals);
                goalsAgainstHome += parseInt(schedule[i].games[j].team2Goals);
                if(schedule[i].games[j].team2Goals == 0){
                    shutoutsHome++;
                }
            }
            else if(schedule[i].games[j].team2Id == teamId && schedule[i].games[j].team1Goals != ""){
                if(schedule[i].games[j].team1Goals > schedule[i].games[j].team2Goals){
                    defeatsAway++;
                }
                else if(schedule[i].games[j].team1Goals == schedule[i].games[j].team2Goals){
                    tiesAway++;
                }
                else if(schedule[i].games[j].team1Goals < schedule[i].games[j].team2Goals){
                    victoriesAway++;
                }
                goalsScoredAway += parseInt(schedule[i].games[j].team2Goals);
                goalsAgainstAway += parseInt(schedule[i].games[j].team1Goals);
                if(schedule[i].games[j].team1Goals == 0){
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

function standings (gameData, teamChoice, season, round){
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

    return teams;
}

function standingsHome (gameData, teamChoice, season, round){
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

    return teams;
}

function standingsAway (gameData, teamChoice, season, round){
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

    return teams;
}

function teamsPlayOffBound (gameData, season, round){
    let teamListPlayOffBound = [];
    if(season <= 11){
        let numberOfTeamsInPlayOffs = gameData.seasons[season].postSeasonSchedule[0].matchups.length * 2;
        let playOfTeamsPerDivision = numberOfTeamsInPlayOffs / (conferenceNumber * divisionNumber);
        for(let i = 0; i < playOfTeamsPerDivision; i++){
            for(let j = 0; j < conferenceNumber; j++){
                for(let k = 0; k < divisionNumber; k++){
                    let teamChoice = gameData.seasons[season].teams.conference[j].divisions[k].teams;
                    let teams = standings(gameData, teamChoice, season, round);
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
                    let teams = standings(gameData, teamChoice, season, round);
                    teamListPlayOffBound.push(teams[i].id);
                }
            }
        }
        for(let i = 0; i < wildCardsPerConference; i++){
            for(let j = 0; j < conferenceNumber; j++){
                let teamChoice = gameData.seasons[season].teams.conference[j].teamsInConference;
                let teams = standings(gameData, teamChoice, season, round);
                let teamAdded = false;
                let teamList = 0;
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

function printStandings(teams){
    let playOffTeams = teamsPlayOffBound(gameData, season, round);
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
            shutouts.innerText = "SO";
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
                let standingsRound = standings(gameData, teams, season, round);
                let standingsPreviousRound = standings(gameData, teams, season, round - 1);
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
            name.addEventListener("click", () => { //go to team page
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
            //points of team
            let points = document.createElement("div");
            points.className = "gridsquare";
            points.id = "points";
            points.style.backgroundColor = "lightgray";
            points.innerText = teams[i].points();
            standingsRow.appendChild(points);
            //pointPercentage of team
            let pointPercentage = document.createElement("div");
            pointPercentage.className = "gridsquare";
            pointPercentage.id = "pointPercentage";
            pointPercentage.innerText = (teams[i].points() / teams[i].gamesPlayed()).toFixed(3);
            standingsRow.appendChild(pointPercentage); 
        }
    }
}

function printStandingsHome(teams){
    let playOffTeams = teamsPlayOffBound(gameData, season, round);
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
            shutouts.innerText = "SO";
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
                let standingsRound = standingsHome(gameData, teams, season, round);
                let standingsPreviousRound = standingsHome(gameData, teams, season, round - 1);
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
            standingsRow.appendChild(name);
            //logo of team
            let logo = document.createElement("img");
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + teams[i].logo + ".png";
            name.appendChild(logo);  
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
            pointPercentage.innerText = (teams[i].pointsHome() / teams[i].gamesPlayedHome()).toFixed(3);
            standingsRow.appendChild(pointPercentage); 
        }
    }
}

function printStandingsAway(teams){
    let playOffTeams = teamsPlayOffBound(gameData, season, round);
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
            shutouts.innerText = "SO";
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
                let standingsRound = standingsAway(gameData, teams, season, round);
                let standingsPreviousRound = standingsAway(gameData, teams, season, round - 1);
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
            standingsRow.appendChild(name);
            //logo of team
            let logo = document.createElement("img");
            logo.className = "logo";
            logo.id = "logo";
            logo.src = ".." + teams[i].logo + ".png";
            name.appendChild(logo);  
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
            pointPercentage.innerText = (teams[i].pointsAway() / teams[i].gamesPlayedAway()).toFixed(3);
            standingsRow.appendChild(pointPercentage); 
        }
    }
}

function layOutPostSeason(gameData, season){
    //seeding
    gameData.seasons[season].postSeasonSchedule.seeds = teamsPlayOffBound(gameData, season, gameData.seasons[season].schedule.length - 1);
    let teamChoice = [];
    for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.seeds.length; i++){
        let team = {
            id: `${gameData.seasons[season].postSeasonSchedule.seeds[i]}`
        }
        teamChoice.push(team);
    }
    let standingsSeason = standings(gameData, teamChoice, season, gameData.seasons[season].schedule.length - 1);
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

        //TO BE TESTED !!CHANGE!!
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
                for(let k = 0; k < 3; k++){
                    if(k != 1){
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
   /*  let teamsList = [];
    teamsList = standings(gameData, teams, season, round);
    let numberOfTeamsInPlayOffs = gameData.seasons[season].postSeasonSchedule[0].matchups.length * 2;
    for(let i = 0; i < gameData.seasons[season].postSeasonSchedule[0].matchups.length; i++){
        for(let j = 0; j < 3; j++){
            if(j != 1){
                gameData.seasons[season].postSeasonSchedule[0].matchups[i].games[j].team1Id = teamsList[i].id;
                gameData.seasons[season].postSeasonSchedule[0].matchups[i].games[j].team2Id = teamsList[numberOfTeamsInPlayOffs - 1 - i].id;
            }
            else{
                gameData.seasons[season].postSeasonSchedule[0].matchups[i].games[j].team2Id = teamsList[i].id;
                gameData.seasons[season].postSeasonSchedule[0].matchups[i].games[j].team1Id = teamsList[numberOfTeamsInPlayOffs - 1 - i].id;
            }
        }
    } */
    
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
                sessionStorage.setItem("team", matches[i].team1Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam1);

            let inputGoalsTeam1 = document.createElement("input");
            inputGoalsTeam1.min = "0";
            inputGoalsTeam1.className = "goalInput";
            inputGoalsTeam1.type = "number";
            divMatch.appendChild(inputGoalsTeam1);

            let spanVS = document.createElement("span");
            spanVS.innerText = "VS";
            spanVS.id = "spanVS";
            divMatch.appendChild(spanVS);

            let inputGoalsTeam2 = document.createElement("input");
            inputGoalsTeam2.min = "0";
            inputGoalsTeam2.className = "goalInput";
            inputGoalsTeam2.type = "number";
            divMatch.appendChild(inputGoalsTeam2);

            let divTeam2 = document.createElement("span");
            divTeam2.className = "teamName";
            divTeam2.innerText = " " + teams[matches[i].team2Id].name + " ";
            divTeam2.addEventListener("click", () => { //go to team page
                sessionStorage.setItem("team", matches[i].team2Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam2);

            let team2LogoContainer = document.createElement("div");
            team2LogoContainer.className = "teamLogoContainer";
            divMatch.appendChild(team2LogoContainer);
            
            let TeamLogoImg2 = document.createElement("img");
            TeamLogoImg2.src = ".." + teams[matches[i].team2Id].logo + ".png";
            TeamLogoImg2.className = "teamLogo";
            team2LogoContainer.appendChild(TeamLogoImg2);

            let gameButton = document.createElement("button");
            gameButton.innerText = "Confirm match";
            gameButton.style.marginLeft = "3px";
            gameButton.addEventListener("click", function(){
                if(inputGoalsTeam1.value == "" || inputGoalsTeam2.value == ""){
                    window.alert("The fields are empty");
                }
                else{
                    matches[i].team1Goals = inputGoalsTeam1.value;
                    matches[i].team2Goals = inputGoalsTeam2.value;
                    //test records
                    records.testSeasonRecords();
                    let matchEnded = 0;
                    for(let j = 0; j < matches.length; j++){
                        if(matches[j].team1Goals != ""){
                            matchEnded++
                        }
                    }
                    if(matchEnded == matches.length){
                        gameData.seasons[season].schedule[round].completed = "yes";
                        selectionOptions(gameData, season);
                    }
                    //lay-out post season       !!Change!!
                    if(gameData.seasons[season].schedule[gameData.seasons[season].schedule.length - 1].completed == "yes"){
                        layOutPostSeason(gameData, season);
                    }
                    gameDataJson = JSON.stringify(gameData);
                    sessionStorage.setItem("gameData", gameDataJson);
                    button.dispatchEvent(new Event("click"));
                }
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
                sessionStorage.setItem("team", matches[i].team1Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam1);

            let inputGoalsTeam1 = document.createElement("span");
            inputGoalsTeam1.className = "goalInput";
            inputGoalsTeam1.innerText = matches[i].team1Goals;
            divMatch.appendChild(inputGoalsTeam1);

            let spanVS = document.createElement("span");
            spanVS.innerText = " VS ";
            spanVS.id = "spanVS";
            divMatch.appendChild(spanVS);

            let inputGoalsTeam2 = document.createElement("span");
            inputGoalsTeam2.className = "goalInput";
            inputGoalsTeam2.innerText = matches[i].team2Goals;
            divMatch.appendChild(inputGoalsTeam2);

            let divTeam2 = document.createElement("span");
            divTeam2.className = "teamName";
            divTeam2.innerText = teams[matches[i].team2Id].name;
            divTeam2.addEventListener("click", () => { //go to team page
                sessionStorage.setItem("team", matches[i].team2Id);
                location.href = "../team/team.html";
            });
            divMatch.appendChild(divTeam2);

            let team2LogoContainer = document.createElement("div");
            team2LogoContainer.className = "teamLogoContainer";
            divMatch.appendChild(team2LogoContainer);
            
            let TeamLogoImg2 = document.createElement("img");
            TeamLogoImg2.src = ".." + teams[matches[i].team2Id].logo + ".png";
            TeamLogoImg2.className = "teamLogo";
            team2LogoContainer.appendChild(TeamLogoImg2);

            if(matches[i].team1Goals > matches[i].team2Goals){
                divTeam1.style.fontWeight = "bold";
                divTeam2.style.fontStyle = "italic";
            }
            else if (matches[i].team1Goals < matches[i].team2Goals){
                divTeam2.style.fontWeight = "bold";
                divTeam1.style.fontStyle = "italic";
            }

        }
        let br = document.createElement("br");
        gamesDiv.appendChild(br);
    }
}

function gamesPostSeason (gameData, season, round){     ///!!!CHANGE!!! 
    if(season <= 11){
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
                        divTeam1.className = "teamName";
                        divTeam1.innerText = " " + teams[matchups[i].games[j].team1Id].name + " ";
                        divTeam1.addEventListener("click", () => { //go to team page
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
                        inputGoalsAddTimeTeam1.style.width = "25px";
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
                        inputGoalsAddTimeTeam2.style.width = "25px";
                        inputGoalsAddTimeTeam2.style.marginRight = "1px";
                        divMatch.appendChild(inputGoalsAddTimeTeam2);
        
                        let inputGoalsTeam2 = document.createElement("input");
                        inputGoalsTeam2.min = "0";
                        inputGoalsTeam2.className = "goalInput";
                        inputGoalsTeam2.type = "number";
                        divMatch.appendChild(inputGoalsTeam2);
        
                        let divTeam2 = document.createElement("span");
                        divTeam2.className = "teamName";
                        divTeam2.innerText = " " + teams[matchups[i].games[j].team2Id].name + " ";
                        divTeam2.addEventListener("click", () => { //go to team page
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
                                        if(matchups[i].games[k].team1Goals > matchups[i].games[k].team2Goals){
                                            team1Wins++;
                                        }
                                        else if(matchups[i].games[k].team1Goals < matchups[i].games[k].team2Goals){
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
                                        if(matchups[i].games[k].team1Goals > matchups[i].games[k].team2Goals){
                                            team2Wins++;
                                        }
                                        else if(matchups[i].games[k].team1Goals < matchups[i].games[k].team2Goals){
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
                                if(allRoundsFinished == matchups.length){
                                    gameData.seasons[season].postSeasonSchedule[round].completed = "yes";
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
                                        selectionOptions(gameData, season); 
                                    }
                                }
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
                    TeamLogoImg1.src = ".." + teams[matchups[i].games[j].team1Id].logo + ".png";
                    TeamLogoImg1.className = "teamLogo";
                    team1LogoContainer.appendChild(TeamLogoImg1);
    
                    let divTeam1 = document.createElement("span");
                    divTeam1.className = "teamName";
                    divTeam1.innerText = teams[matchups[i].games[j].team1Id].name;
                    divTeam1.addEventListener("click", () => { //go to team page
                        sessionStorage.setItem("team", matchups[i].games[j].team1Id);
                        location.href = "../team/team.html";
                    });
                    divMatch.appendChild(divTeam1);
    
                    let inputGoalsTeam1 = document.createElement("span");
                    inputGoalsTeam1.className = "goalInput";
                    inputGoalsTeam1.innerText = matchups[i].games[j].team1Goals;
                    divMatch.appendChild(inputGoalsTeam1);
    
                    if(matchups[i].games[j].team1GoalsAddTime != "" && matchups[i].games[j].team1GoalsAddTime != undefined){
                        let inputGoalsAddTimeTeam1 = document.createElement("span");
                        inputGoalsAddTimeTeam1.className = "goalInput";
                        inputGoalsAddTimeTeam1.style.fontSize = "12px";
                        inputGoalsAddTimeTeam1.style.width = "25px";
                        inputGoalsAddTimeTeam1.innerText = matchups[i].games[j].team1GoalsAddTime;
                        inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                        divMatch.appendChild(inputGoalsAddTimeTeam1);
                    }
                    else{
                        inputGoalsTeam1.style.width = "60px";
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
                        inputGoalsAddTimeTeam2.style.width = "25px";
                        inputGoalsAddTimeTeam2.style.marginRight = "1px";
                        divMatch.appendChild(inputGoalsAddTimeTeam2);
                    }
    
                    let inputGoalsTeam2 = document.createElement("span");
                    inputGoalsTeam2.className = "goalInput";
                    inputGoalsTeam2.innerText = matchups[i].games[j].team2Goals;
                    divMatch.appendChild(inputGoalsTeam2);
    
                    if(!(matchups[i].games[j].team2GoalsAddTime != "" && matchups[i].games[j].team2GoalsAddTime != undefined)){
                        inputGoalsTeam2.style.width = "60px";
                    }
    
                    let divTeam2 = document.createElement("span");
                    divTeam2.className = "teamName";
                    divTeam2.innerText = teams[matchups[i].games[j].team2Id].name;
                    divTeam2.addEventListener("click", () => { //go to team page
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
    
                    if(matchups[i].games[j].team1Goals > matchups[i].games[j].team2Goals){
                        divTeam1.style.fontWeight = "bold";
                        divTeam2.style.fontStyle = "italic";
                    }
                    else if (matchups[i].games[j].team1Goals < matchups[i].games[j].team2Goals){
                        divTeam2.style.fontWeight = "bold";
                        divTeam1.style.fontStyle = "italic";
                    }
                    else{
                        if(matchups[i].games[j].team1GoalsAddTime > matchups[i].games[j].team2GoalsAddTime){
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
            
                //for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.conference[l][0].matchups.length; i++){
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
                                    divTeam1.className = "teamName";
                                    divTeam1.innerText = " " + teams[conferenceMatchups[i].games[j].team1Id].name + " ";
                                    divTeam1.addEventListener("click", () => { //go to team page
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
                                    inputGoalsAddTimeTeam1.style.width = "25px";
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
                                    inputGoalsAddTimeTeam2.style.width = "25px";
                                    inputGoalsAddTimeTeam2.style.marginRight = "1px";
                                    divMatch.appendChild(inputGoalsAddTimeTeam2);
                    
                                    let inputGoalsTeam2 = document.createElement("input");
                                    inputGoalsTeam2.min = "0";
                                    inputGoalsTeam2.className = "goalInput";
                                    inputGoalsTeam2.type = "number";
                                    divMatch.appendChild(inputGoalsTeam2);
                    
                                    let divTeam2 = document.createElement("span");
                                    divTeam2.className = "teamName";
                                    divTeam2.innerText = " " + teams[conferenceMatchups[i].games[j].team2Id].name + " ";
                                    divTeam2.addEventListener("click", () => { //go to team page
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
                                            //!!!CHANGE!!! Change way to pursue playoffs
                                            conferenceMatchups[i].games[j].team1Goals = inputGoalsTeam1.value;
                                            conferenceMatchups[i].games[j].team2Goals = inputGoalsTeam2.value;
                                            conferenceMatchups[i].games[j].team1GoalsAddTime = inputGoalsAddTimeTeam1.value;
                                            conferenceMatchups[i].games[j].team2GoalsAddTime = inputGoalsAddTimeTeam2.value;
                                            //confirm who won and check if the matchup has ended
                                            let team1Wins = 0;
                                            let team2Wins = 0;
                                            for(let k = 0; k < 3; k++){
                                                if(k % 2 == 0){
                                                    if(conferenceMatchups[i].games[k].team1Goals > conferenceMatchups[i].games[k].team2Goals){
                                                        team1Wins++;
                                                    }
                                                    else if(conferenceMatchups[i].games[k].team1Goals < conferenceMatchups[i].games[k].team2Goals){
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
                                                    if(conferenceMatchups[i].games[k].team1Goals > conferenceMatchups[i].games[k].team2Goals){
                                                        team2Wins++;
                                                    }
                                                    else if(conferenceMatchups[i].games[k].team1Goals < conferenceMatchups[i].games[k].team2Goals){
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
                                            if(team1Wins >= 2){
                                                conferenceMatchups[i].completed = "yes";
                                                conferenceMatchups[i].loser = `${conferenceMatchups[i].games[0].team2Id}`;
                                                conferenceMatchups[i].winner = `${conferenceMatchups[i].games[0].team1Id}`;
                                                //if(round != gameData.seasons[season].postSeasonSchedule.conference[l].length - 1){
                                                    gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(conferenceMatchups[i].loser), 1);
                                                // }
                                            }
                                            else if(team2Wins >= 2){
                                                conferenceMatchups[i].completed = "yes";
                                                conferenceMatchups[i].loser = `${conferenceMatchups[i].games[0].team1Id}`;
                                                conferenceMatchups[i].winner = `${conferenceMatchups[i].games[0].team2Id}`;
                                                //if(round != gameData.seasons[season].postSeasonSchedule.conference[l].length - 1){
                                                    gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(conferenceMatchups[i].loser), 1);
                                                //}
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
                                                            for(let j = 0; j < 3; j++){
                                                                if(j != 1){
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
                                                }
                                                else{   //finals
                                                    for(let a = 0; a < gameData.seasons[season].postSeasonSchedule.finals.length; a++){
                                                        for(let b = 0; b < gameData.seasons[season].postSeasonSchedule.finals[a].matchups.length; b++){
                                                            let teamSeeds = gameData.seasons[season].postSeasonSchedule.seeds;
                                                            for(let j = 0; j < 3; j++){
                                                                if(j != 1){
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
                                TeamLogoImg1.src = ".." + teams[conferenceMatchups[i].games[j].team1Id].logo + ".png";
                                TeamLogoImg1.className = "teamLogo";
                                team1LogoContainer.appendChild(TeamLogoImg1);
                
                                let divTeam1 = document.createElement("span");
                                divTeam1.className = "teamName";
                                divTeam1.innerText = teams[conferenceMatchups[i].games[j].team1Id].name;
                                divTeam1.addEventListener("click", () => { //go to team page
                                    sessionStorage.setItem("team", conferenceMatchups[i].games[j].team1Id);
                                    location.href = "../team/team.html";
                                });
                                divMatch.appendChild(divTeam1);
                
                                let inputGoalsTeam1 = document.createElement("span");
                                inputGoalsTeam1.className = "goalInput";
                                inputGoalsTeam1.innerText = conferenceMatchups[i].games[j].team1Goals;
                                divMatch.appendChild(inputGoalsTeam1);
                
                                if(conferenceMatchups[i].games[j].team1GoalsAddTime != "" && conferenceMatchups[i].games[j].team1GoalsAddTime != undefined){
                                    let inputGoalsAddTimeTeam1 = document.createElement("span");
                                    inputGoalsAddTimeTeam1.className = "goalInput";
                                    inputGoalsAddTimeTeam1.style.fontSize = "12px";
                                    inputGoalsAddTimeTeam1.style.width = "25px";
                                    inputGoalsAddTimeTeam1.innerText = conferenceMatchups[i].games[j].team1GoalsAddTime;
                                    inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                                    divMatch.appendChild(inputGoalsAddTimeTeam1);
                                }
                                else{
                                    inputGoalsTeam1.style.width = "60px";
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
                                    inputGoalsAddTimeTeam2.style.width = "25px";
                                    inputGoalsAddTimeTeam2.style.marginRight = "1px";
                                    divMatch.appendChild(inputGoalsAddTimeTeam2);
                                }
                
                                let inputGoalsTeam2 = document.createElement("span");
                                inputGoalsTeam2.className = "goalInput";
                                inputGoalsTeam2.innerText = conferenceMatchups[i].games[j].team2Goals;
                                divMatch.appendChild(inputGoalsTeam2);
                
                                if(!(conferenceMatchups[i].games[j].team2GoalsAddTime != "" && conferenceMatchups[i].games[j].team2GoalsAddTime != undefined)){
                                    inputGoalsTeam2.style.width = "60px";
                                }
                
                                let divTeam2 = document.createElement("span");
                                divTeam2.className = "teamName";
                                divTeam2.innerText = teams[conferenceMatchups[i].games[j].team2Id].name;
                                divTeam2.addEventListener("click", () => { //go to team page
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
                
                                if(conferenceMatchups[i].games[j].team1Goals > conferenceMatchups[i].games[j].team2Goals){
                                    divTeam1.style.fontWeight = "bold";
                                    divTeam2.style.fontStyle = "italic";
                                }
                                else if (conferenceMatchups[i].games[j].team1Goals < conferenceMatchups[i].games[j].team2Goals){
                                    divTeam2.style.fontWeight = "bold";
                                    divTeam1.style.fontStyle = "italic";
                                }
                                else{
                                    if(conferenceMatchups[i].games[j].team1GoalsAddTime > conferenceMatchups[i].games[j].team2GoalsAddTime){
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
                    }
                //}
            }
        }
        else{
            let teams = gameData.teams;
            //for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.conference[l][0].matchups.length; i++){
                let matchupdiv = document.createElement("div");
                round = round - gameData.seasons[season].postSeasonSchedule.conference[0].length;
                gamesDiv.appendChild(matchupdiv);
                console.log(round)
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
                            divTeam1.className = "teamName";
                            divTeam1.innerText = " " + teams[finalMatchups[round].games[j].team1Id].name + " ";
                            divTeam1.addEventListener("click", () => { //go to team page
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
                            inputGoalsAddTimeTeam1.style.width = "25px";
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
                            inputGoalsAddTimeTeam2.style.width = "25px";
                            inputGoalsAddTimeTeam2.style.marginRight = "1px";
                            divMatch.appendChild(inputGoalsAddTimeTeam2);
            
                            let inputGoalsTeam2 = document.createElement("input");
                            inputGoalsTeam2.min = "0";
                            inputGoalsTeam2.className = "goalInput";
                            inputGoalsTeam2.type = "number";
                            divMatch.appendChild(inputGoalsTeam2);
            
                            let divTeam2 = document.createElement("span");
                            divTeam2.className = "teamName";
                            divTeam2.innerText = " " + teams[finalMatchups[round].games[j].team2Id].name + " ";
                            divTeam2.addEventListener("click", () => { //go to team page
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
                                    //!!!CHANGE!!! Change way to pursue playoffs
                                    finalMatchups[round].games[j].team1Goals = inputGoalsTeam1.value;
                                    finalMatchups[round].games[j].team2Goals = inputGoalsTeam2.value;
                                    finalMatchups[round].games[j].team1GoalsAddTime = inputGoalsAddTimeTeam1.value;
                                    finalMatchups[round].games[j].team2GoalsAddTime = inputGoalsAddTimeTeam2.value;
                                    //confirm who won and check if the matchup has ended
                                    let team1Wins = 0;
                                    let team2Wins = 0;
                                    for(let k = 0; k < 3; k++){
                                        if(k % 2 == 0){
                                            if(finalMatchups[round].games[k].team1Goals > finalMatchups[round].games[k].team2Goals){
                                                team1Wins++;
                                            }
                                            else if(finalMatchups[round].games[k].team1Goals < finalMatchups[round].games[k].team2Goals){
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
                                            if(finalMatchups[round].games[k].team1Goals > finalMatchups[round].games[k].team2Goals){
                                                team2Wins++;
                                            }
                                            else if(finalMatchups[round].games[k].team1Goals < finalMatchups[round].games[k].team2Goals){
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
                                    if(team1Wins >= 2){
                                        finalMatchups[round].completed = "yes";
                                        finalMatchups[round].loser = `${finalMatchups[round].games[0].team2Id}`;
                                        finalMatchups[round].winner = `${finalMatchups[round].games[0].team1Id}`;
                                        //if(round != gameData.seasons[season].postSeasonSchedule.conference[l].length - 1){
                                            gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(finalMatchups[round].loser), 1);
                                        // }
                                    }
                                    else if(team2Wins >= 2){
                                        finalMatchups[round].completed = "yes";
                                        finalMatchups[round].loser = `${finalMatchups[round].games[0].team1Id}`;
                                        finalMatchups[round].winner = `${finalMatchups[round].games[0].team2Id}`;
                                        //if(round != gameData.seasons[season].postSeasonSchedule.conference[l].length - 1){
                                            gameData.seasons[season].postSeasonSchedule.seeds.splice(gameData.seasons[season].postSeasonSchedule.seeds.indexOf(finalMatchups[round].loser), 1);
                                        //}
                                    }
                                    //check if all rounds are finished      
                                    let allRoundsFinished = 0
                                    for(let k = 0; k < finalMatchups.length; k++){
                                        if(gameData.seasons[season].postSeasonSchedule.finals[round].matchups[k].completed == "yes"){
                                            allRoundsFinished++;        //!!!TO CHANGE!!!
                                        }
                                    }
                                    if(allRoundsFinished == finalMatchups.length){ //!!!CHANGE!!! change way postSeason changes
                                        gameData.seasons[season].postSeasonSchedule.finals[round].completed = "yes";
                                        //finals
                                        //for(let a = 0; a < gameData.seasons[season].postSeasonSchedule.finals.length; a++){
                                        if(round < gameData.seasons[season].postSeasonSchedule.finals.length - 1){
                                            console.log(round);
                                            console.log(gameData.seasons[season].postSeasonSchedule.finals.length - 1)
                                            for(let b = 0; b < gameData.seasons[season].postSeasonSchedule.finals[round + 1].matchups.length; b++){
                                                let teamSeeds = gameData.seasons[season].postSeasonSchedule.seeds;
                                                for(let j = 0; j < 3; j++){
                                                    if(j != 1){
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
                                        //}
                                        
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
                        divTeam1.className = "teamName";
                        divTeam1.innerText = teams[finalMatchups[round].games[j].team1Id].name;
                        divTeam1.addEventListener("click", () => { //go to team page
                            sessionStorage.setItem("team", finalMatchups[round].games[j].team1Id);
                            location.href = "../team/team.html";
                        });
                        divMatch.appendChild(divTeam1);
        
                        let inputGoalsTeam1 = document.createElement("span");
                        inputGoalsTeam1.className = "goalInput";
                        inputGoalsTeam1.innerText = finalMatchups[round].games[j].team1Goals;
                        divMatch.appendChild(inputGoalsTeam1);
        
                        if(finalMatchups[round].games[j].team1GoalsAddTime != "" && finalMatchups[round].games[j].team1GoalsAddTime != undefined){
                            let inputGoalsAddTimeTeam1 = document.createElement("span");
                            inputGoalsAddTimeTeam1.className = "goalInput";
                            inputGoalsAddTimeTeam1.style.fontSize = "12px";
                            inputGoalsAddTimeTeam1.style.width = "25px";
                            inputGoalsAddTimeTeam1.innerText = finalMatchups[round].games[j].team1GoalsAddTime;
                            inputGoalsAddTimeTeam1.style.marginLeft = "1px";
                            divMatch.appendChild(inputGoalsAddTimeTeam1);
                        }
                        else{
                            inputGoalsTeam1.style.width = "60px";
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
                            inputGoalsAddTimeTeam2.style.width = "25px";
                            inputGoalsAddTimeTeam2.style.marginRight = "1px";
                            divMatch.appendChild(inputGoalsAddTimeTeam2);
                        }
        
                        let inputGoalsTeam2 = document.createElement("span");
                        inputGoalsTeam2.className = "goalInput";
                        inputGoalsTeam2.innerText = finalMatchups[round].games[j].team2Goals;
                        divMatch.appendChild(inputGoalsTeam2);
        
                        if(!(finalMatchups[round].games[j].team2GoalsAddTime != "" && finalMatchups[round].games[j].team2GoalsAddTime != undefined)){
                            inputGoalsTeam2.style.width = "60px";
                        }
        
                        let divTeam2 = document.createElement("span");
                        divTeam2.className = "teamName";
                        divTeam2.innerText = teams[finalMatchups[round].games[j].team2Id].name;
                        divTeam2.addEventListener("click", () => { //go to team page
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
        
                        if(finalMatchups[round].games[j].team1Goals > finalMatchups[round].games[j].team2Goals){
                            divTeam1.style.fontWeight = "bold";
                            divTeam2.style.fontStyle = "italic";
                        }
                        else if (finalMatchups[round].games[j].team1Goals < finalMatchups[round].games[j].team2Goals){
                            divTeam2.style.fontWeight = "bold";
                            divTeam1.style.fontStyle = "italic";
                        }
                        else{
                            if(finalMatchups[round].games[j].team1GoalsAddTime > finalMatchups[round].games[j].team2GoalsAddTime){
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
                gamesDiv.appendChild(br);
                if(round == gameData.seasons[season].postSeasonSchedule.finals.length - 1 && gameData.seasons[season].postSeasonSchedule.finals[round].completed == "yes"){
                    printChampion(gameData.seasons[season].postSeasonSchedule.finals[round].matchups[0].winner);
                }
            //}
        }
    }
}

let congratulations = document.createElement("h3");
let championsDiv = document.createElement("div");
function printChampion (championId){
    congratulations.innerText = `${gameData.seasons[season].date} Phegsael Football League Champions:`
    document.body.appendChild(congratulations);

    championsDiv.id = "championDiv";
    championsDiv.style.border = `5px solid ${gameData.teams[championId].color}`;
    championsDiv.style.width = "370px";
    championsDiv.style.margin = "3px";
    document.body.appendChild(championsDiv);

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
    team.style.width = "250px";
    championsDiv.appendChild(team);

    let teamName = document.createElement("div");
    teamName.innerText = `${gameData.teams[championId].name}`;
    teamName.style.fontWeight = "bold";
    teamName.style.height = "30px";
    teamName.style.fontSize = "3.3vw";
    teamName.style.textAlign = "center";
    team.appendChild(teamName);

    let teamLogo = document.createElement("img");
    teamLogo.src = `..${gameData.teams[championId].logo}.png`;
    teamLogo.style.height = "90px";
    team.appendChild(teamLogo);
}

function selectionOptions (gameData, season){
    select.innerHTML = "";
    for(let i = 0; i < gameData.seasons[season].schedule.length; i++){
        if(gameData.seasons[season].schedule[i].completed == "yes"){
            let option = document.createElement("option");
            option.innerText = `Round ${i + 1}`;
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
            option.innerText = `Round ${i + 1}`;
            option.value = i;
            option.selected = "selected";
            select.appendChild(option);
            i = gameData.seasons[season].schedule.length;
        }
    }
    if(gameData.seasons[season].schedule[gameData.seasons[season].schedule.length - 1].completed == "yes"){
        if(season <= 11){
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
                console.log(i)
                ///text for conference finals and finals !!!CHANGE!!!
                option.innerText = `Post-season ${i + 1} Round`;
                option.value = i + gameData.seasons[season].schedule.length;
                select.appendChild(option);
                if(i >= gameData.seasons[season].postSeasonSchedule.conference[0].length){
                    if(gameData.seasons[season].postSeasonSchedule.finals[i - gameData.seasons[season].postSeasonSchedule.conference[0].length].completed == "no"){
                        console.log("a")
                        option.selected = "selected";
                        i = gameData.seasons[season].postSeasonSchedule.length;
                    }
                    else{
                        console.log("b")
                        option.selected = "selected";
                    }
                }
                else if(gameData.seasons[season].postSeasonSchedule.conference[0][i].completed == "no"){
                    console.log("c")
                    option.selected = "selected";
                    i = gameData.seasons[season].postSeasonSchedule.length;
                }
                else{ 
                    console.log("d")
                    option.selected = "selected";
                }
            }
        }
    }
}

let select = document.createElement("select");
document.body.appendChild(select);
selectionOptions(gameData, season);

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
                let teams = standings(gameData,teamChoice, season, round);
                printStandings(teams);
            }
            else if(homeAwayFactor == "Home"){
                let teams = standingsHome(gameData, teamChoice, season, round);
                printStandingsHome(teams);
            }
            else if(homeAwayFactor == "Away"){
                let teams = standingsAway(gameData,teamChoice, season, round);
                printStandingsAway(teams);
            }
            let br = document.createElement("br");
            document.body.appendChild(br);
        }
        divisionStandingsChoice.style.display = "inline-block";
        leagueStandingsChoice.style.display = "inline-block";
        conferenceStandingsChoice.style.display = "none";
        divisionsFactor = "conference";
    });
    document.body.appendChild(conferenceStandingsChoice);
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
                    let teams = standings(gameData,teamChoice, season, round);
                    printStandings(teams);
                }
                else if(homeAwayFactor == "Home"){
                    let teams = standingsHome(gameData, teamChoice, season, round);
                    printStandingsHome(teams);
                }
                else if(homeAwayFactor == "Away"){
                    let teams = standingsAway(gameData,teamChoice, season, round);
                    printStandingsAway(teams);
                }
                let br = document.createElement("br");
                document.body.appendChild(br);
            }
        }
        divisionStandingsChoice.style.display = "none";
        leagueStandingsChoice.style.display = "inline-block";
        conferenceStandingsChoice.style.display = "inline-block";
        divisionsFactor = "division";
    });
    document.body.appendChild(divisionStandingsChoice);
}
if(divisionNumber > 1 || conferenceNumber > 1){
    leagueStandingsChoice.innerText = "League";
    leagueStandingsChoice.style.display = "none";
    leagueStandingsChoice.addEventListener("click", () =>{
        standingsContainer.innerHTML = "";
        //league Standings
        let teamChoice = gameData.seasons[season].teams.allTeams;
        if(homeAwayFactor == "All"){
            let teams = standings(gameData,teamChoice, season, round);
            printStandings(teams);
        }
        else if(homeAwayFactor == "Home"){
            let teams = standingsHome(gameData, teamChoice, season, round);
            printStandingsHome(teams);
        }
        else if(homeAwayFactor == "Away"){
            let teams = standingsAway(gameData,teamChoice, season, round);
            printStandingsAway(teams);
        }
        divisionStandingsChoice.style.display = "inline-block";
        leagueStandingsChoice.style.display = "none";
        conferenceStandingsChoice.style.display = "inline-block";
        divisionsFactor = "league";
    });
    document.body.appendChild(leagueStandingsChoice);
}


let round = select.value;
let boolRegularSeason = true;
let button = document.createElement("button");
button.innerText = "Change Round";
document.body.appendChild(button);
let gamesDiv = document.createElement("div");
document.body.appendChild(gamesDiv);
let standingsContainer = document.createElement("div");
standingsContainer.className = "gridContainer";
document.body.appendChild(standingsContainer);

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
        let teamChoice = gameData.seasons[season].teams.allTeams;
        let teams = [];
        teams = standings(gameData, teamChoice, season, round);
        printStandings(teams);
        gamesRound(gameData, season, round);
        boolRegularSeason = true;
        standingsHomeButton.style.display = "inline-block";
        standingsAwayButton.style.display = "inline-block";
        conferenceStandingsChoice.style.display = "inline-block";
        divisionStandingsChoice.style.display = "inline-block";
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
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = [];
            teams = standings(gameData, teamChoice, season, round);
            printStandings(teams);
            gamesRound(gameData, season, round);
            boolRegularSeason = true;
            standingsHomeButton.style.display = "inline-block";
            standingsAwayButton.style.display = "inline-block";
            conferenceStandingsChoice.style.display = "inline-block";
            divisionStandingsChoice.style.display = "inline-block";
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
});
document.body.appendChild(previousRound);

let nextRound = document.createElement("button");
nextRound.innerText = "Next Round";
nextRound.addEventListener("click", () => {
    if(boolRegularSeason == true){
        if(season <= 11){
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
        if(season <= 11){
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
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = [];
            teams = standings(gameData, teamChoice, season, round);
            printStandings(teams);
            gamesRound(gameData, season, round);
            boolRegularSeason = true;
            standingsHomeButton.style.display = "inline-block";
            standingsAwayButton.style.display = "inline-block";
            conferenceStandingsChoice.style.display = "inline-block";
            divisionStandingsChoice.style.display = "inline-block";
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
});
document.body.appendChild(nextRound);

if(select.value < gameData.seasons[season].schedule.length){
    //if(conferenceNumber == 1 && divisionNumber == 1){
        let teamChoice = gameData.seasons[season].teams.allTeams;
        let teams = [];
        teams = standings(gameData, teamChoice, season, round);
        printStandings(teams)
        gamesRound(gameData, season, round);
        boolRegularSeason = true;
    //}
}
else{
    round = round - gameData.seasons[season].schedule.length
    gamesPostSeason(gameData, season, round);
    boolRegularSeason = false;
}


//standings Home and Away
let homeAwayFactor = "All";

let standingsHomeButton = document.createElement("button");
let standingsAwayButton = document.createElement("button");
let standingsAllButton = document.createElement("button");

standingsHomeButton.innerText = "Home";
standingsHomeButton.addEventListener("click", () =>{
    standingsContainer.innerHTML = "";
    //if(conferenceNumber == 1 && divisionNumber == 1){
        if(divisionsFactor == "league"){
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = standingsHome(gameData, teamChoice, season, round);
            printStandingsHome(teams);
        }
        else if(divisionsFactor == "conference"){
            for(let i = 0; i < conferenceNumber; i++){
                let conferenceName = document.createElement("div");
                conferenceName.innerText = `${gameData.seasons[season].teams.conference[i].name} Conference`;
                standingsContainer.appendChild(conferenceName);
                let teamChoice = gameData.seasons[season].teams.conference[i].teamsInConference;
                let teams = standingsHome(gameData, teamChoice, season, round);
                printStandingsHome(teams);
            }
        }
        else if(divisionsFactor == "division"){
            for(let i = 0; i < conferenceNumber; i++){
                for(let j = 0; j < divisionNumber; j++){
                    let divisionName = document.createElement("div");
                    divisionName.innerText = `${gameData.seasons[season].teams.conference[i].divisions[j].name} Division`;
                    standingsContainer.appendChild(divisionName);
                    let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                    let teams = standingsHome(gameData, teamChoice, season, round);
                    printStandingsHome(teams);
                }
            }
        }
        standingsAllButton.style.display = "inline-block";
        standingsAwayButton.style.display = "inline-block";
        standingsHomeButton.style.display = "none";
        homeAwayFactor = "Home";
    //}
});
document.body.appendChild(standingsHomeButton);

standingsAwayButton.innerText = "Away";
standingsAwayButton.addEventListener("click", () =>{
    standingsContainer.innerHTML = "";
    //if(conferenceNumber == 1 && divisionNumber == 1){
        if(divisionsFactor == "league"){
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = standingsAway(gameData, teamChoice, season, round);
            printStandingsAway(teams);
        }
        else if(divisionsFactor == "conference"){
            for(let i = 0; i < conferenceNumber; i++){
                let conferenceName = document.createElement("div");
                conferenceName.innerText = `${gameData.seasons[season].teams.conference[i].name} Conference`;
                standingsContainer.appendChild(conferenceName);
                let teamChoice = gameData.seasons[season].teams.conference[i].teamsInConference;
                let teams = standingsAway(gameData, teamChoice, season, round);
                printStandingsAway(teams);
            }
        }
        else if(divisionsFactor == "division"){
            for(let i = 0; i < conferenceNumber; i++){
                for(let j = 0; j < divisionNumber; j++){
                    let divisionName = document.createElement("div");
                    divisionName.innerText = `${gameData.seasons[season].teams.conference[i].divisions[j].name} Division`;
                    standingsContainer.appendChild(divisionName);
                    let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                    let teams = standingsAway(gameData, teamChoice, season, round);
                    printStandingsAway(teams);
                }
            }
        }
        standingsAllButton.style.display = "inline-block";
        standingsHomeButton.style.display = "inline-block";
        standingsAwayButton.style.display = "none";
        homeAwayFactor = "Away";
    //}
});
document.body.appendChild(standingsAwayButton);

standingsAllButton.innerText = "All";
standingsAllButton.style.display = "none";
standingsAllButton.addEventListener("click", () => {
    standingsContainer.innerHTML = "";
    //if(conferenceNumber == 1 && divisionNumber == 1){
        if(divisionsFactor == "league"){
            let teamChoice = gameData.seasons[season].teams.allTeams;
            let teams = standings(gameData, teamChoice, season, round);
            printStandings(teams);
        }
        else if(divisionsFactor == "conference"){
            for(let i = 0; i < conferenceNumber; i++){
                let conferenceName = document.createElement("div");
                conferenceName.innerText = `${gameData.seasons[season].teams.conference[i].name} Conference`;
                standingsContainer.appendChild(conferenceName);
                let teamChoice = gameData.seasons[season].teams.conference[i].teamsInConference;
                let teams = standings(gameData, teamChoice, season, round);
                printStandings(teams);
            }
        }
        else if(divisionsFactor == "division"){
            for(let i = 0; i < conferenceNumber; i++){
                for(let j = 0; j < divisionNumber; j++){
                    let divisionName = document.createElement("div");
                    divisionName.innerText = `${gameData.seasons[season].teams.conference[i].divisions[j].name} Division`;
                    standingsContainer.appendChild(divisionName);
                    let teamChoice = gameData.seasons[season].teams.conference[i].divisions[j].teams;
                    let teams = standings(gameData, teamChoice, season, round);
                    printStandings(teams);
                }
            }
        }
        standingsAllButton.style.display = "none";
        standingsHomeButton.style.display = "inline-block";
        standingsAwayButton.style.display = "inline-block";
        homeAwayFactor = "All";
    //}
});
document.body.appendChild(standingsAllButton);

if(boolRegularSeason == false){
    standingsAllButton.style.display = "none";
    standingsHomeButton.style.display = "none";
    standingsAwayButton.style.display = "none";
    conferenceStandingsChoice.style.display = "none";
    leagueStandingsChoice.style.display = "none";
    divisionStandingsChoice.style.display = "none";
}

