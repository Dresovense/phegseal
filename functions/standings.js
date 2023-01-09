module.exports = {
    standings: function(gameData, teamChoice, season, round, sortingType){
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
        else if(sortingType == "SO"){
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
    },
    playoffBound: function(gameData, season, round){
        let teamListPlayOffBound = [];
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
    },
    regularSeasonPredictions: function(gameData, round){
        let predictions = {
            "win": [],
            "lose": [],
            "standings": [],
            "playoffs": [],
            "round": round
        }
    
        let team_predictions_win = []
        let team_predictions_lose = []
        let team_predictions_playoffs = []
        let team_predictions_standings = []
        for(let i = 0; i < gameData.seasons[gameData.seasons.length - 1].teams.allTeams.length; i++){
            team_predictions_win.push(0);
            team_predictions_lose.push(0);
            team_predictions_playoffs.push(0);
            team_predictions_standings.push(0);
        }
        for(let i = 0; i < 500; i++){
            let gameDataTest = JSON.parse(JSON.stringify(gameData));
            for(let j = round; j < gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule.length; j++){
                for(k = 0; k < gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games.length; k++){
                    result = dice.diceRoll(gameData.teams[gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team1Id].power + gameData.teams[gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team1Id].tradePower, gameData.teams[gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team2Id].power + gameData.teams[gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team2Id].tradePower)
                    gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team1Goals = result[0];
                    gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team2Goals = result[1];
                }
            }
            let teamChoice = gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.allTeams;
            let teams = this.standings(gameDataTest, teamChoice, gameDataTest.seasons.length - 1, gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule.length - 1, "Pts");
            let conferences = []
            for(let j = 0; j < gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.conference.length; j++){
                conferences.push(0);
            }
            for(let j = 0; j < teams.length; j++){
                team_predictions_standings[teams[j].id] += teams.length - j;
                for(k = 0; k < conferences.length; k++){
                    if(conferences[k] < gameDataTest.seasons[gameDataTest.seasons.length - 1].postSeasonSchedule.rules.teamsQualifiedPerDivision){
                        for(let l = 0; l < gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.conference[k].teamsInConference.length; l++){
                            if(teams[j].id == gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.conference[k].teamsInConference[l].id){
                                conferences[k] += 1
                                team_predictions_playoffs[teams[j].id] += 1;
                            }
                        }
                    }
                }
            }
            team_predictions_win[teams[0].id] += 1;
            team_predictions_lose[teams[teams.length - 1].id] += 1;
        }
        predictions.win = team_predictions_win;
        predictions.lose = team_predictions_lose;
        predictions.playoffs = team_predictions_playoffs;
        predictions.standings = team_predictions_standings;
        return predictions
    }
}

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