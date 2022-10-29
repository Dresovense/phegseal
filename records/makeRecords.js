let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season");

let button = document.createElement("button");
button.innerText = "Create Records";
button.addEventListener("click", () => {
    for(let i = 0; i < gameData.seasons.length - 1; i++){
        let goals = {
            mostGoalsScoredInPlayoffs:{
                name: `Most goals scored in the ${gameData.seasons[i].date} play-offs`,
                teams:[
                    
                ]
            },
            mostGoalsScoredHomeInPlayoffs:{
                name: `Most goals scored at home in the ${gameData.seasons[i].date} play-offs`,
                teams:[
                    
                ]
            },
            mostGoalsScoredAwayInPlayoffs:{
                name: `Most goals scored away in the ${gameData.seasons[i].date} play-offs`,
                teams:[
                    
                ]
            },
            mostShutoutsInPlayoffs:{
                name: `Most shutouts in the ${gameData.seasons[i].date} play-offs`,
                teams:[
                    
                ]
            },
            mostShutoutsHomeInPlayoffs:{
                name: `Most shutouts at home in the ${gameData.seasons[i].date} play-offs`,
                teams:[
                    
                ]
            },
            mostShutoutsAwayInPlayoffs:{
                name: `Most shutouts away in the ${gameData.seasons[i].date} play-offs`,
                teams:[
                    
                ]
            }
        }
        let numberOfTeams 
        if(i <= 11){
            numberOfTeams = 4;
        }
        else{
            numberOfTeams = gameData.seasons[i].postSeasonSchedule.rules.postSeasonTeams;
        }

        for(let j = 0; j < numberOfTeams; j++){
            let standingsGS = playoffOrder(gameData, i, "GF");
            let standingsGSH = playoffOrder(gameData, i, "GFH");
            let standingsGSA = playoffOrder(gameData, i, "GFA");
            let standingsSO = playoffOrder(gameData, i, "SO");
            let standingsSOH = playoffOrder(gameData, i, "SOH");
            let standingsSOA = playoffOrder(gameData, i, "SOA");
            let teamMostGoalsScoredInPlayoffs = {
                "teamId": `${standingsGS[j].id}`,
                "record": `${standingsGS[j].goalsScored()}`
            }
            let teamMostGoalsScoredHomeInPlayoffs = {
                "teamId": `${standingsGSH[j].id}`,
                "record": `${standingsGSH[j].goalsScoredHome}`
            }
            let teamMostGoalsScoredAwayInPlayoffs = {
                "teamId": `${standingsGSA[j].id}`,
                "record": `${standingsGSA[j].goalsScoredAway}`
            }
            let teamMostShutoutsInPlayoffs = {
                "teamId": `${standingsSO[j].id}`,
                "record": `${standingsSO[j].shutouts()}`
            }
            let teamMostShutoutsHomeInPlayoffs = {
                "teamId": `${standingsSOH[j].id}`,
                "record": `${standingsSOH[j].shutoutsHome}`
            }
            let teamMostShutoutsAwayInPlayoffs = {
                "teamId": `${standingsSOA[j].id}`,
                "record": `${standingsSOA[j].shutoutsAway}`
            }
            goals.mostGoalsScoredInPlayoffs.teams.push(teamMostGoalsScoredInPlayoffs)
            goals.mostGoalsScoredHomeInPlayoffs.teams.push(teamMostGoalsScoredHomeInPlayoffs)
            goals.mostGoalsScoredAwayInPlayoffs.teams.push(teamMostGoalsScoredAwayInPlayoffs)
            goals.mostShutoutsInPlayoffs.teams.push(teamMostShutoutsInPlayoffs)
            goals.mostShutoutsHomeInPlayoffs.teams.push(teamMostShutoutsHomeInPlayoffs)
            goals.mostShutoutsAwayInPlayoffs.teams.push(teamMostShutoutsAwayInPlayoffs)

        }
        gameData.seasons[i].records.postSeason.goals = goals;
    }
});
document.body.appendChild(button);

function playoffCount(gameData, season, teamId, type){
    let victoriesHome = 0;
    let victoriesAway = 0;
    let defeatsHome = 0;
    let defeatsAway = 0;
    let victoriesHomeAddTime = 0;
    let victoriesAwayAddTime = 0;
    let defeatsHomeAddTime = 0;
    let defeatsAwayAddTime = 0;
    let goalsScoredHome = 0;
    let goalsScoredAway = 0;
    let goalsAgainstHome = 0;
    let goalsAgainstAway = 0;
    let shutoutsHome = 0;
    let shutoutsAway = 0;
    if(season <= 11){
        for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.length; i++){
            for(let j = 0; j < gameData.seasons[season].postSeasonSchedule[i].matchups.length; j++){
                for(let k = 0; k < gameData.seasons[season].postSeasonSchedule[i].matchups[j].games.length; k++){
                    let game = gameData.seasons[season].postSeasonSchedule[i].matchups[j].games[k];
                        if(game.team1Id == teamId){
                            if(game.team1Goals > game.team2Goals){
                                victoriesHome++;
                            }
                            else if(game.team1Goals < game.team2Goals){
                                defeatsHome++;
                            }
                            else{
                                if(game.team1GoalsAddTime > game.team2GoalsAddTime){
                                    victoriesHome++;
                                    victoriesHomeAddTime++;
                                }
                                else if(game.team1GoalsAddTime < game.team2GoalsAddTime){
                                    defeatsHome++;
                                    defeatsHomeAddTime++;
                                }
                            }
                            let goalsTeam1AddTime = 0;
                            let goalsTeam2AddTime = 0;
                            if(game.team1GoalsAddTime != "" && game.team1GoalsAddTime != undefined){
                                goalsTeam1AddTime = game.team1GoalsAddTime;
                                goalsTeam2AddTime = game.team2GoalsAddTime
                            }
                            goalsScoredHome = parseInt(goalsScoredHome) + parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime);
                            goalsAgainstHome = parseInt(goalsAgainstHome) + parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime);
                            if(parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime) == 0){
                                shutoutsHome++;
                            }
                        }
                        else if(game.team2Id == teamId){
                            if(game.team1Goals > game.team2Goals){
                                defeatsAway++;
                            }
                            else if(game.team1Goals < game.team2Goals){
                                victoriesAway++;
                            }
                            else{
                                if(game.team1GoalsAddTime > game.team2GoalsAddTime){
                                    defeatsAway++;
                                    defeatsAwayAddTime++;
                                }
                                else if(game.team1GoalsAddTime < game.team2GoalsAddTime){
                                    victoriesAway++;
                                    victoriesAwayAddTime++;
                                }
                            }
                            let goalsTeam1AddTime = 0;
                            let goalsTeam2AddTime = 0;
                            if(game.team1GoalsAddTime != "" && game.team1GoalsAddTime != undefined){
                                goalsTeam1AddTime = game.team1GoalsAddTime;
                                goalsTeam2AddTime = game.team2GoalsAddTime
                            }
                            goalsScoredAway = parseInt(goalsScoredAway) + parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime);
                            goalsAgainstAway = parseInt(goalsAgainstAway) + parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime);
                            if(parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime) == 0){
                                shutoutsAway++;
                            }
                        }
                }
            }
        }
    }
    else{
        for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.conference.length; i++){
            for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.conference[i].length; j++){
                for(let k = 0; k < gameData.seasons[season].postSeasonSchedule.conference[i][j].matchups.length; k++){
                    for(let l = 0; l < gameData.seasons[season].postSeasonSchedule.conference[i][j].matchups[k].games.length; l++){
                        let game = gameData.seasons[season].postSeasonSchedule.conference[i][j].matchups[k].games[l];
                        if(game.team1Goals != ""){
                            if(game.team1Id == teamId){
                                if(game.team1Goals > game.team2Goals){
                                    victoriesHome++;
                                }
                                else if(game.team1Goals < game.team2Goals){
                                    defeatsHome++;
                                }
                                else{
                                    if(game.team1GoalsAddTime > game.team2GoalsAddTime){
                                        victoriesHome++;
                                        victoriesHomeAddTime++;
                                    }
                                    else if(game.team1GoalsAddTime < game.team2GoalsAddTime){
                                        defeatsHome++;
                                        defeatsHomeAddTime++;
                                    }
                                }
                                let goalsTeam1AddTime = 0;
                                let goalsTeam2AddTime = 0;
                                if(game.team1GoalsAddTime != "" && game.team1GoalsAddTime != undefined){
                                    goalsTeam1AddTime = game.team1GoalsAddTime;
                                    goalsTeam2AddTime = game.team2GoalsAddTime
                                }
                                console.log(parseInt(goalsScoredHome))
                                console.log(game)
                                console.log(parseInt(game.team1Goals))
                                console.log(parseInt(goalsTeam1AddTime))
                                console.log(parseInt(goalsScoredHome) + parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime))
                                if(parseInt(game.team1Goals) == NaN){
                                    console.log("here")
                                }
                                goalsScoredHome = parseInt(goalsScoredHome) + parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime);
                                goalsAgainstHome = parseInt(goalsAgainstHome) + parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime);
                                if(parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime) == 0){
                                    shutoutsHome++;
                                }
                            }
                            else if(game.team2Id == teamId){
                                if(game.team1Goals > game.team2Goals){
                                    defeatsAway++;
                                }
                                else if(game.team1Goals < game.team2Goals){
                                    victoriesAway++;
                                }
                                else{
                                    if(game.team1GoalsAddTime > game.team2GoalsAddTime){
                                        defeatsAway++;
                                        defeatsAwayAddTime++;
                                    }
                                    else if(game.team1GoalsAddTime < game.team2GoalsAddTime){
                                        victoriesAway++;
                                        victoriesAwayAddTime++;
                                    }
                                }
                                let goalsTeam1AddTime = 0;
                                let goalsTeam2AddTime = 0;
                                if(game.team1GoalsAddTime != "" && game.team1GoalsAddTime != undefined){
                                    goalsTeam1AddTime = game.team1GoalsAddTime;
                                    goalsTeam2AddTime = game.team2GoalsAddTime
                                }
                                goalsScoredAway = parseInt(goalsScoredAway) + parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime);
                                goalsAgainstAway = parseInt(goalsAgainstAway) + parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime);
                                if(parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime) == 0){
                                    shutoutsAway++;
                                }
                            }
                        }
                    }
                }
            }
        }
        for(let i = 0; i < gameData.seasons[season].postSeasonSchedule.finals.length; i++){
            for(let j = 0; j < gameData.seasons[season].postSeasonSchedule.finals[i].matchups.length; j++){
                for(let k = 0; k < gameData.seasons[season].postSeasonSchedule.finals[i].matchups[j].games.length; k++){
                    let game = gameData.seasons[season].postSeasonSchedule.finals[i].matchups[j].games[k];
                    if(game.team1Id == teamId){
                        if(game.team1Goals > game.team2Goals){
                            victoriesHome++;
                        }
                        else if(game.team1Goals < game.team2Goals){
                            defeatsHome++;
                        }
                        else{
                            if(game.team1GoalsAddTime > game.team2GoalsAddTime){
                                victoriesHome++;
                                victoriesHomeAddTime++;
                            }
                            else if(game.team1GoalsAddTime < game.team2GoalsAddTime){
                                defeatsHome++;
                                defeatsHomeAddTime++;
                            }
                        }
                        let goalsTeam1AddTime = 0;
                        let goalsTeam2AddTime = 0;
                        if(game.team1GoalsAddTime != "" && game.team1GoalsAddTime != undefined){
                            goalsTeam1AddTime = game.team1GoalsAddTime;
                            goalsTeam2AddTime = game.team2GoalsAddTime
                        }
                        goalsScoredHome = parseInt(goalsScoredHome) + parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime);
                        goalsAgainstHome = parseInt(goalsAgainstHome) + parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime);
                        if(parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime) == 0){
                            shutoutsHome++;
                        }
                    }
                    else if(game.team2Id == teamId){
                        if(game.team1Goals > game.team2Goals){
                            defeatsAway++;
                        }
                        else if(game.team1Goals < game.team2Goals){
                            victoriesAway++;
                        }
                        else{
                            if(game.team1GoalsAddTime > game.team2GoalsAddTime){
                                defeatsAway++;
                                defeatsAwayAddTime++;
                            }
                            else if(game.team1GoalsAddTime < game.team2GoalsAddTime){
                                victoriesAway++;
                                victoriesAwayAddTime++;
                            }
                        }
                        let goalsTeam1AddTime = 0;
                        let goalsTeam2AddTime = 0;
                        if(game.team1GoalsAddTime != "" && game.team1GoalsAddTime != undefined){
                            goalsTeam1AddTime = game.team1GoalsAddTime;
                            goalsTeam2AddTime = game.team2GoalsAddTime
                        }
                        goalsScoredAway = parseInt(goalsScoredAway) + parseInt(game.team2Goals) + parseInt(goalsTeam2AddTime);
                        goalsAgainstAway = parseInt(goalsAgainstAway) + parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime);
                        if(parseInt(game.team1Goals) + parseInt(goalsTeam1AddTime) == 0){
                            shutoutsAway++;
                        }
                    }
                }
            }
        }
    }

    switch(type){
        case "victoriesHome": return victoriesHome; 
        case "victoriesAway": return victoriesAway;
        case "defeatsHome": return defeatsHome;
        case "defeatsAway": return defeatsAway;
        case "victoriesHomeAddTime": return victoriesHomeAddTime;
        case "victoriesAwayAddTime": return victoriesAwayAddTime;
        case "defeatsHomeAddTime": return defeatsHomeAddTime;
        case "defeatsAwayAddTime": return defeatsAwayAddTime;
        case "goalsScoredHome": return goalsScoredHome;
        case "goalsScoredAway": return goalsScoredAway;
        case "goalsAgainstHome": return goalsAgainstHome;
        case "goalsAgainstAway": return goalsAgainstAway;
        case "shutoutsHome": return shutoutsHome;
        case "shutoutsAway": return shutoutsAway;
    }

}

function playoffOrder (gameData, season, sortingType){
    let teams = [];
    for(let i = 0; i < gameData.seasons[season].teams.allTeams.length; i++){
        teamId = gameData.seasons[season].teams.allTeams[i].id;
        const teamData = {
            id : teamId, //par rapport à l'id des équipes en jeu cette saison la
            name : gameData.teams[teamId].name,
            logo : gameData.teams[teamId].logo,
            color : gameData.teams[teamId].color,
            victoriesHome : playoffCount(gameData, season, teamId, "victoriesHome"),
            victoriesAway : playoffCount(gameData, season, teamId, "victoriesAway"),
            defeatsHome : playoffCount(gameData, season, teamId, "defeatsHome"),
            defeatsAway : playoffCount(gameData, season, teamId, "defeatsAway"),
            victoriesHomeAddTime : playoffCount(gameData, season, teamId, "victoriesHomeAddTime"),
            victoriesAwayAddTime : playoffCount(gameData, season, teamId, "victoriesAwayAddTime"),
            defeatsHomeAddTime: playoffCount(gameData, season, teamId, "defeatsHomeAddTime"),
            defeatsAwayAddTime: playoffCount(gameData, season, teamId, "defeatsAwayAddTime"),
            goalsScoredHome : playoffCount(gameData, season, teamId, "goalsScoredHome"),
            goalsScoredAway : playoffCount(gameData, season, teamId, "goalsScoredAway"),
            goalsAgainstHome : playoffCount(gameData, season, teamId, "goalsAgainstHome"),
            goalsAgainstAway : playoffCount(gameData, season, teamId, "goalsAgainstAway"),
            shutoutsHome : playoffCount(gameData, season, teamId, "shutoutsHome"),
            shutoutsAway : playoffCount(gameData, season, teamId, "shutoutsAway"),
            victories : function() {return this.victoriesAway + this.victoriesHome},
            defeats :  function() {return this.defeatsHome + this.defeatsAway},
            victoriesAddTime : function() {return this.victoriesAwayAddTime + this.victoriesHomeAddTime},
            defeatsAddTime : function() {return this.defeatsAwayAddTime + this.defeatsHomeAddTime},
            goalsScored : function() {return this.goalsScoredHome + this.goalsScoredAway},
            goalsAgainst : function() {return this.goalsAgainstHome + this.goalsAgainstAway},
            shutouts : function() {return this.shutoutsHome + this.shutoutsAway},
            gamesPlayedHome: function() {return this.victoriesHome + this.tiesHome + this.defeatsHome},
            gamesPlayedAway: function() {return this.victoriesAway + this.tiesAway + this.defeatsAway},
            gamesPlayed: function() {return this.gamesPlayedHome() + this.gamesPlayedAway()}
        }
        teams.push(teamData);
    }

    if(sortingType == "V"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victories() > right.victories()){
                return -1;
            }
            else if (left.victories() < right.victories()){
                return 1;
            }
        });
    }
    else if(sortingType == "VH"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesHome > right.victoriesHome){
                return -1;
            }
            else if (left.victoriesHome < right.victoriesHome){
                return 1;
            }
        });
    }
    else if(sortingType == "VA"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesAway > right.victoriesAway){
                return -1;
            }
            else if (left.victoriesAway < right.victoriesAway){
                return 1;
            }
        });
    }
    else if(sortingType == "VAT"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesAddTime() > right.victoriesAddTime()){
                return -1;
            }
            else if (left.victoriesAddTime() < right.victoriesAddTime()){
                return 1;
            }
        });
    }
    else if(sortingType == "VATH"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesHomeAddTime > right.victoriesHomeAddTime){
                return -1;
            }
            else if (left.victoriesHomeAddTime < right.victoriesHomeAddTime){
                return 1;
            }
        });
    }
    else if(sortingType == "VATA"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.victoriesAwayAddTime > right.victoriesAwayAddTime){
                return -1;
            }
            else if (left.victoriesAwayAddTime < right.victoriesAwayAddTime){
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
            if(left.goalsScored() > right.goalsScored() || right.goalsScored() == NaN){
                return -1;
            }
            else if(left.goalsScored() < right.goalsScored() || left.goalsScored() == NaN){
                return 1;
            }
        });
    }
    else if(sortingType == "GFH"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScoredHome > right.goalsScoredHome || right.goalsScoredHome == NaN){
                return -1;
            }
            else if(left.goalsScoredHome < right.goalsScoredHome || left.goalsScoredHome == NaN){
                return 1;
            }
        });
    }
    else if(sortingType == "GFA"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.goalsScoredAway > right.goalsScoredAway || right.goalsScoredAway == NaN){
                return -1;
            }
            else if(left.goalsScoredAway < right.goalsScoredAway || left.goalsScoredAway == NaN){
                return 1;
            }
        });
    }
    else if(sortingType == "GFAT"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.mostGoalsScoredAddTimeInPlayoffs > right.mostGoalsScoredAddTimeInPlayoffs){
                return -1;
            }
            else if(left.mostGoalsScoredAddTimeInPlayoffs < right.mostGoalsScoredAddTimeInPlayoffs){
                return 1;
            }
        });
    }
    else if(sortingType == "GFHAT"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.mostGoalsScoredAddTimeHomeInPlayoffs > right.mostGoalsScoredAddTimeHomeInPlayoffs){
                return -1;
            }
            else if(left.mostGoalsScoredAddTimeHomeInPlayoffs < right.mostGoalsScoredAddTimeHomeInPlayoffs){
                return 1;
            }
        });
    }
    else if(sortingType == "GFAAT"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.mostGoalsScoredAddTimeAwayInPlayoffs > right.mostGoalsScoredAddTimeAwayInPlayoffs){
                return -1;
            }
            else if(left.mostGoalsScoredAddTimeAwayInPlayoffs < right.mostGoalsScoredAddTimeAwayInPlayoffs){
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
    else if(sortingType == "SOH"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutoutsHome > right.shutoutsHome){
                return -1;
            }
            else if (left.shutoutsHome < right.shutoutsHome){
                return 1;
            }
        });
    }
    else if(sortingType == "SOA"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutoutsAway > right.shutoutsAway){
                return -1;
            }
            else if (left.shutoutsAway < right.shutoutsAway){
                return 1;
            }
        });
    }

    return teams
}

function consecutiveMatches(gameData, season, sorting){
    let consecutiveList = [];
    for(let j = 0; j < gameData.seasons[season].teams.allTeams.length; j++){
        let consecutive = 0;
        for(let i = 0; i < gameData.seasons[season].schedule.length; i++){
            let playedInRound = false;
            for(let k = 0; k < gameData.seasons[season].schedule[i].games.length; k++){
                if(sorting == "WinStr"){
                    //Winning streak
                    if(gameData.seasons[season].schedule[i].games[k].team1Id == j){
                        if(gameData.seasons[season].schedule[i].games[k].team1Goals == gameData.seasons[season].schedule[i].games[k].team2Goals){
                            consecutive++;
                        }
                        else{
                            consecutiveList.push([j, consecutive, i]) //[teamId, result, endingRound]
                            consecutive = 0
                        }
                        playedInRound = true;
                    }
                    else if(gameData.seasons[season].schedule[i].games[k].team2Id == j){
                        if(gameData.seasons[season].schedule[i].games[k].team1Goals == gameData.seasons[season].schedule[i].games[k].team2Goals){
                            consecutive++;
                        }
                        else{
                            consecutiveList.push([j, consecutive, i]) //[teamId, result, endingRound]
                            consecutive = 0
                        }
                        playedInRound = true;
                    }
                }
                else if(sorting == "NoWin"){
                    if(gameData.seasons[season].schedule[i].games[k].team1Id == j){
                        if(gameData.seasons[season].schedule[i].games[k].team1Goals == gameData.seasons[season].schedule[i].games[k].team2Goals){
                            consecutiveList.push([j, consecutive, i]) //[teamId, result, endingRound]
                            consecutive = 0
                        }
                        else{
                            consecutive++;
                        }
                        playedInRound = true;
                    }
                    else if(gameData.seasons[season].schedule[i].games[k].team2Id == j){
                        if(gameData.seasons[season].schedule[i].games[k].team1Goals == gameData.seasons[season].schedule[i].games[k].team2Goals){
                            consecutiveList.push([j, consecutive, i]) //[teamId, result, endingRound]
                            consecutive = 0
                        }
                        else{
                            consecutive++;
                        }
                        playedInRound = true;
                    }
                }
                else if(sorting == "WinStrHome"){
                    if(gameData.seasons[season].schedule[i].games[k].team1Id == j){
                        if(gameData.seasons[season].schedule[i].games[k].team1Goals == gameData.seasons[season].schedule[i].games[k].team2Goals){
                            consecutive++;
                        }
                        else{
                            consecutiveList.push([j, consecutive, i]) //[teamId, result, endingRound]
                            consecutive = 0
                        }
                        playedInRound = true;
                    }
                }
                else if(sorting == "WinStrAway"){
                    if(gameData.seasons[season].schedule[i].games[k].team2Id == j){
                        if(gameData.seasons[season].schedule[i].games[k].team1Goals == gameData.seasons[season].schedule[i].games[k].team2Goals){
                            consecutive++;
                        }
                        else{
                            consecutiveList.push([j, consecutive, i]) //[teamId, result, endingRound]
                            consecutive = 0
                        }
                        playedInRound = true;
                    }
                }
            }
        }
    }

    consecutiveList.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left[1] > right[1]){
            return -1;
        }
        else if (left[1] < right[1]){
            return 1;
        }
    });
    return consecutiveList;

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
    else if(sortingType == "SO"){
        teams.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
            if(left.shutoutsHome > right.shutoutsHome){
                return -1;
            }
            else if (left.shutoutsHome < right.shutoutsHome){
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
    else if(sortingType == "SO"){
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
