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