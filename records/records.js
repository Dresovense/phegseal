let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");

let button = document.createElement("button");
button.innerText = "Create Records";
button.addEventListener("click", () => {
//create records
    //most ...
            let mostPointsList = [
                {
                    teamId: "-1",
                    seasonId: "-1",
                    record: "0"
                },
                {
                    teamId: "-1",
                    seasonId: "-1",
                    record: "0"
                },
                {
                    teamId: "-1",
                    seasonId: "-1",
                    record: "0"
                },
                {
                    teamId: "-1",
                    seasonId: "-1",
                    record: "0"
                },
                {
                    teamId: "-1",
                    seasonId: "-1",
                    record: "0"
                }
            ]
            for(let i = 0; i < gameData.seasons.length; i++){
                let teams = standings(gameData, i, gameData.seasons[i].schedule.length - 1);
                for(let j = 0; j < teams.length; j++){
                    if(!(gameData.seasons[i].postSeasonSchedule[0].matchups[0].winner == teamId || gameData.seasons[i].postSeasonSchedule[0].matchups[0].loser == teamId || gameData.seasons[i].postSeasonSchedule[0].matchups[1].winner == teamId || gameData.seasons[i].postSeasonSchedule[0].matchups[1].loser == teamId)){
                        for(let k = 4; k >= 0; k--){
                            if(mostPointsList[k].record >= teams[j].points()){
                                if(k < 4){
                                    let team = {
                                        teamId: teams[j].id,
                                        seasonId: i,
                                        record: teams[j].points()
                                    };
                                    mostPointsList.splice(k + 1, 0, team);
                                    mostPointsList.pop();
                                }
                                k = 0;
                            }
                            else{
                                if(k == 0){
                                    let team = {
                                        teamId: teams[j].id,
                                        seasonId: i,
                                        record: teams[j].points()
                                    };
                                    mostPointsList.splice(0, 0, team);
                                    mostPointsList.pop();
                                }
                            }
                        }
                    }
                }
            }
            gameData.records.postSeason.participations.mostPointsWithoutPlayoff.teams = mostPointsList;
    
    //less ...
    /* let lessPointsList = [
        {
            teamId: "-1",
            seasonId: "-1",
            record: "100"
        },
        {
            teamId: "-1",
            seasonId: "-1",
            record: "100"
        },
        {
            teamId: "-1",
            seasonId: "-1",
            record: "100"
        },
        {
            teamId: "-1",
            seasonId: "-1",
            record: "100"
        },
        {
            teamId: "-1",
            seasonId: "-1",
            record: "100"
        }
    ];
    for(let i = 0; i < gameData.seasons.length; i++){
        let teams = standings(gameData, i, gameData.seasons[i].schedule.length - 1);
        for(let j = 0; j < teams.length; j++){
            if(gameData.seasons[i].postSeasonSchedule[0].matchups[0].winner == j || gameData.seasons[i].postSeasonSchedule[0].matchups[0].loser == j || gameData.seasons[i].postSeasonSchedule[0].matchups[1].winner == j || gameData.seasons[i].postSeasonSchedule[0].matchups[1].loser == j){
                for(let k = 4; k >= 0; k--){
                    if(lessPointsList[k].record <= teams[j].points()){
                        console.log(teams[j].id + "   " + i)
                        if(k < 4){
                            let team = {
                                teamId: teams[j].id,
                                seasonId: i,
                                record: teams[j].points()
                            };
                            lessPointsList.splice(k + 1, 0, team);
                            lessPointsList.pop();
                        }
                        k = 0;
                    }
                    else{
                        if(k == 0){
                            let team = {
                                teamId: teams[j].id,
                                seasonId: i,
                                record: teams[j].points()
                            };
                            lessPointsList.splice(0, 0, team);
                            lessPointsList.pop();
                        }
                    }
            }
            }
        }     
    }
    gameData.records.postSeason.participations.teamInPlayoffLessPoints.teams = lessPointsList; */

    //consecutive ...
    /* let consecutiveList = [
        {
            teamId: "-1",
            endSeasons: [],
            record: "0"
        },
        {
            teamId: "-1",
            endSeasons: [],
            record: "0"
        },
        {
            teamId: "-1",
            endSeasons: [],
            record: "0"
        },
        {
            teamId: "-1",
            endSeasons: [],
            record: "0"
        },
        {
            teamId: "-1",
            endSeasons: [],
            record: "0"
        }
    ]
    //let teams = [];
    for(let teamId = 0; teamId < gameData.teams.length; teamId++){
        let teamRecord = {
            consecutivePlayoffs: 0,
            endSeasons: -1
        };
        for(let i = 0; i < gameData.seasons.length; i++){ */
            /* for(let j = 0; j < gameData.seasons[i].schedule.length; j++){
                for(let k = 0; k < gameData.seasons[i].schedule[j].games.length; k++){ */
                    //if(gameData.seasons[i].postSeasonSchedule[0].matchups[0].winner == teamId || gameData.seasons[i].postSeasonSchedule[0].matchups[0].loser == teamId || gameData.seasons[i].postSeasonSchedule[0].matchups[1].winner == teamId || gameData.seasons[i].postSeasonSchedule[0].matchups[1].loser == teamId){
                        //if(gameData.seasons[i].schedule[j].games[k].team1Goals == gameData.seasons[i].schedule[j].games[k].team2Goals){ //consecutive Won
                        /* console.log("here");    
                        teamRecord.consecutivePlayoffs++;
                        }
                        else{
                            for(let l = 4; l >= 0; l--){
                                if(consecutiveList[l].record == teamRecord.consecutivePlayoffs && teamId == consecutiveList[l].teamId){
                                    consecutiveList[l].endSeasons.push(i-1);
                                }
                                else if(consecutiveList[l].record > teamRecord.consecutivePlayoffs){
                                    if(l < 4){
                                        let team = {
                                            teamId: teamId,
                                            endSeasons: [i-1],
                                            record: teamRecord.consecutivePlayoffs
                                        };
                                        consecutiveList.splice(l + 1, 0, team);
                                        consecutiveList.pop();
                                    }
                                    l = 0;
                                }
                                else{
                                    if(l == 0){
                                        let team = {
                                            teamId: teamId,
                                            endSeasons: [i-1],
                                            record: teamRecord.consecutivePlayoffs
                                        };
                                        consecutiveList.splice(0, 0, team);
                                        consecutiveList.pop();
                                    }
                                }
                            }
                            teamRecord.consecutivePlayoffs = 0;
                        } */
                    //}
                    /* else if(gameData.seasons[i].schedule[j].games[k].team2Id == teamId){
                        if(gameData.seasons[i].schedule[j].games[k].team1Goals == gameData.seasons[i].schedule[j].games[k].team2Goals){ //consecutive Won
                            consecutiveGamesWon++;
                        }
                        else{
                            for(let l = 4; l >= 0; l--){
                                if(consecutiveList[l].record >= consecutiveGamesWon){
                                    if(l < 4){
                                        let team = {
                                            teamId: teamId,
                                            seasonId: i,
                                            record: consecutiveGamesWon,
                                            endRound: j
                                        };
                                        consecutiveList.splice(l + 1, 0, team);
                                        consecutiveList.pop();
                                    }
                                    l = 0;
                                }
                                else{
                                    if(l == 0){
                                        let team = {
                                            teamId: teamId,
                                            seasonId: i,
                                            record: consecutiveGamesWon,
                                            endRound: j
                                        };
                                        consecutiveList.splice(0, 0, team);
                                        consecutiveList.pop();
                                    }
                                }
                            }
                            consecutiveGamesWon = 0;
                        } */
                    /* }
                } */
            //}
        /* }
    }
    gameData.records.postSeason.participations.consecutivePlayoffParticipation.teams = consecutiveList; */


//post season:
    /* let mostPointsList = [
        {
            teamId: "-1",
            seasonsId: [],
            record: "0"
        },
        {
            teamId: "-1",
            seasonsId: [],
            record: "0"
        },
        {
            teamId: "-1",
            seasonsId: [],
            record: "0"
        },
        {
            teamId: "-1",
            seasonsId: [],
            record: "0"
        },
        {
            teamId: "-1",
            seasonsId: [],
            record: "0"
        }
    ]
    let teams = [];
    for(let i = 0; i < gameData.teams.length; i++){
        let record = {
            titles: 0,
            seasons: []
        }
        teams.push(record); //number of titles
    }
    for(let i = 0; i < gameData.seasons.length; i++){
        for(let j = 0; j < teams.length; j++){
            if(gameData.seasons[i].postSeasonSchedule[1].matchups[0].winner == j || gameData.seasons[i].postSeasonSchedule[1].matchups[0].loser == j){
                teams[j].titles++;
                teams[j].seasons.push(i);
            }
        }
    }
    for(let j = 0; j < gameData.teams.length; j++){
        for(let k = 4; k >= 0; k--){
            if(mostPointsList[k].record >= teams[j].titles){
                if(k < 4){
                    let team = {
                        teamId: j,
                        seasonsId: teams[j].seasons,
                        record: teams[j].titles
                    };
                    mostPointsList.splice(k + 1, 0, team);
                    mostPointsList.pop();
                }
                k = 0;
            }
            else{
                if(k == 0){
                    let team = {
                        teamId: j,
                        seasonsId: teams[j].seasons,
                        record: teams[j].titles
                    };
                    mostPointsList.splice(0, 0, team);
                    mostPointsList.pop();
                }
            }
        }
    }
    gameData.records.postSeason.participations.finalParticipation.teams = mostPointsList; */

});
document.body.appendChild(button);

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

function standings (gameData, season, round){
    let teams = [];
    for(let i = 0; i < gameData.seasons[season].teams.length; i++){
        teamId = gameData.seasons[season].teams[i].id;
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

    /* for(let i = -1; i < teams.length; i++){
        if(i == -1){
            let standingsRow = document.createElement("div");
            standingsRow.className = "gridRow";
            standingsRow.id = "row" + i;
            standingsContainer.appendChild(standingsRow);
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
    } */
}
