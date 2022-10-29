/* let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let season = sessionStorage.getItem("season"); */

module.exports = {
    testSeasonRecords: function(gameData, season, round, teamPlayed1, teamPlayed2) {
        checkPoints(gameData, season, round)
        checkVictories(gameData, season, round, teamPlayed1, teamPlayed2)
        checkDefeats(gameData, season, round, teamPlayed1, teamPlayed2)
        checkTies(gameData, season, round, teamPlayed1, teamPlayed2)
        checkGoals(gameData, season, round, teamPlayed1, teamPlayed2)
    }
}

//points

function checkPoints(gameData, season, round){
    let pointRecords = gameData.seasons[season].records.regularSeason.points;
    let standingsSeason = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "Pts");
    let mostPoints = [];
    let lessPoints = [];
    for(let i = 0; i < 5; i++){ //5 teams in standing
        let teamMostPoints = {
            "teamId": standingsSeason[i].id,
            "record": standingsSeason[i].points()
        }
        mostPoints.push(teamMostPoints);
        let teamLessPoints = {
            "teamId": standingsSeason[standingsSeason.length - 1 - i].id,
            "record": standingsSeason[standingsSeason.length - 1 - i].points()
        }
        lessPoints.push(teamLessPoints);
    }
    pointRecords.mostPoints.teams = mostPoints;
    pointRecords.lessPoints.teams = lessPoints;
}

//victories

function checkVictories(gameData, season, round, teamPlayed1, teamPlayed2){
    let victoryRecords = gameData.seasons[season].records.regularSeason.victories;
    let standingsSeasonV = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "V");
    let standingsSeasonVH = standingsHome(gameData, gameData.seasons[season].teams.allTeams, season, round, "V");
    let standingsSeasonVA = standingsAway(gameData, gameData.seasons[season].teams.allTeams, season, round, "V");
    let mostVictories = [];
    let lessVictories = [];
    let mostVictoriesHome = [];
    let lessVictoriesHome = [];
    let mostVictoriesAway = [];
    let lessVictoriesAway = [];
    for(let i = 0; i < 5; i++){ //5 teams in standing
        let teamMostVictories = {
            "teamId": standingsSeasonV[i].id,
            "record": standingsSeasonV[i].victories()
        }
        mostVictories.push(teamMostVictories);
        let teamLessVictories = {
            "teamId": standingsSeasonV[standingsSeasonV.length - 1 - i].id,
            "record": standingsSeasonV[standingsSeasonV.length - 1 - i].victories()
        }
        lessVictories.push(teamLessVictories);

        let teamMostVictoriesHome = {
            "teamId": standingsSeasonVH[i].id,
            "record": standingsSeasonVH[i].victoriesHome
        }
        mostVictoriesHome.push(teamMostVictoriesHome);
        let teamLessVictoriesHome = {
            "teamId": standingsSeasonVH[standingsSeasonVH.length - 1 - i].id,
            "record": standingsSeasonVH[standingsSeasonVH.length - 1 - i].victoriesHome
        }
        lessVictoriesHome.push(teamLessVictoriesHome);

        let teamMostVictoriesAway = {
            "teamId": standingsSeasonVA[i].id,
            "record": standingsSeasonVA[i].victoriesAway
        }
        mostVictoriesAway.push(teamMostVictoriesAway);
        let teamLessVictoriesAway = {
            "teamId": standingsSeasonVA[standingsSeasonVA.length - 1 - i].id,
            "record": standingsSeasonVA[standingsSeasonVA.length - 1 - i].victoriesAway
        }
        lessVictoriesAway.push(teamLessVictoriesAway);
    }
    victoryRecords.mostVictories.teams = mostVictories;
    victoryRecords.lessVictories.teams = lessVictories;
    victoryRecords.mostVictoriesHome.teams = mostVictoriesHome;
    victoryRecords.lessVictoriesHome.teams = lessVictoriesHome;
    victoryRecords.mostVictoriesAway.teams = mostVictoriesAway;
    victoryRecords.lessVictoriesAway.teams = lessVictoriesAway;

    //consecutive
    consecutiveWinStreaks(gameData, season, round, teamPlayed1, teamPlayed2)
    consecutiveWinStreaksHome(gameData, season, round, teamPlayed1)
    consecutiveWinStreaksAway(gameData, season, round, teamPlayed2)
    consecutiveNoWinStreaks(gameData, season, round, teamPlayed1, teamPlayed2);
}

function consecutiveWinStreaks(gameData, season, round, teamPlayed1, teamPlayed2){
    let teamPlayedList = [teamPlayed1, teamPlayed2]

    let WinStreak = gameData.seasons[season].records.regularSeason.victories.mostConsecutiveVictories.teams;

    for(let k = 0; k < teamPlayedList.length; k++){
        let consecutiveWinStreak = 0;
        let matchesNonPlayed = 0;
        for(let i = 0; i <= round; i++){
            let gamesRound = gameData.seasons[season].schedule[i].games
            let teamHasPlayed = false;
            for(let j = 0; j < gamesRound.length; j++){
                if(gamesRound[j].team1Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals > gamesRound[j].team2Goals){
                        consecutiveWinStreak++;
                        if(i == round){
                            let teamIndex = WinStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveWinStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveWinStreak,
                                    "endingRound": i
                                }
                                if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                                    WinStreak.push(teamConsecutiveWinStreak) 
                                }
                            }
                            else{
                                WinStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                WinStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveWinStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveWinStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                            WinStreak.push(teamConsecutiveWinStreak) 
                        }
                        consecutiveWinStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
                else if(gamesRound[j].team2Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals < gamesRound[j].team2Goals){
                        consecutiveWinStreak++;
                        if(i == round){
                            let teamIndex = WinStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveWinStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveWinStreak,
                                    "endingRound": i
                                }
                                if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                                    WinStreak.push(teamConsecutiveWinStreak) 
                                }
                            }
                            else{
                                WinStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                WinStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveWinStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveWinStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                            WinStreak.push(teamConsecutiveWinStreak) 
                        }
                        consecutiveWinStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
            }
            if(teamHasPlayed == false){
                matchesNonPlayed++;
            }
        }
    }

    WinStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    WinStreak.length = 5;
}

function consecutiveWinStreaksHome(gameData, season, round, teamPlayed1){
    let WinStreak = gameData.seasons[season].records.regularSeason.victories.mostConsecutiveVictoriesHome.teams;

    let consecutiveWinStreak = 0;
    let matchesNonPlayed = 0;
    for(let i = 0; i <= round; i++){
        let gamesRound = gameData.seasons[season].schedule[i].games
        let teamHasPlayed = false;
        for(let j = 0; j < gamesRound.length; j++){
            if(gamesRound[j].team1Id == teamPlayed1 && gamesRound[j].team1Goals != ""){
                teamHasPlayed = true;
                if(gamesRound[j].team1Goals > gamesRound[j].team2Goals){
                    consecutiveWinStreak++;
                    if(i == round){
                        let teamIndex = WinStreak.findIndex(team => team.teamId == teamPlayed1 && team.endingRound == i - 1 - matchesNonPlayed);
                        if(teamIndex == -1){
                            let teamConsecutiveWinStreak = {
                                "teamId": teamPlayed1,
                                "record": consecutiveWinStreak,
                                "endingRound": i
                            }
                            if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                                WinStreak.push(teamConsecutiveWinStreak) 
                            }
                        }
                        else{
                            WinStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                            WinStreak[teamIndex].record++;
                        }
                    }
                }
                else{
                    let teamConsecutiveWinStreak = {
                        "teamId": teamPlayed1,
                        "record": consecutiveWinStreak,
                        "endingRound": i - 1 - matchesNonPlayed
                    }
                    if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                        WinStreak.push(teamConsecutiveWinStreak) 
                    }
                    consecutiveWinStreak = 0
                }
                matchesNonPlayed = 0;
            }
        }
        if(teamHasPlayed == false){
            matchesNonPlayed ++;
        }
    }

    WinStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    WinStreak.length = 5;
}

function consecutiveWinStreaksAway(gameData, season, round, teamPlayed2){
    let WinStreak = gameData.seasons[season].records.regularSeason.victories.mostConsecutiveVictoriesAway.teams;

    let consecutiveWinStreak = 0;
    let matchesNonPlayed = 0;
    for(let i = 0; i <= round; i++){
        let gamesRound = gameData.seasons[season].schedule[i].games
        let teamHasPlayed = false;
        for(let j = 0; j < gamesRound.length; j++){
            if(gamesRound[j].team2Id == teamPlayed2 && gamesRound[j].team1Goals != ""){
                teamHasPlayed = true;
                if(gamesRound[j].team1Goals < gamesRound[j].team2Goals){
                    consecutiveWinStreak++;
                    if(i == round){
                        let teamIndex = WinStreak.findIndex(team => team.teamId == teamPlayed2 && team.endingRound == i - 1 - matchesNonPlayed);
                        if(teamIndex == -1){
                            let teamConsecutiveWinStreak = {
                                "teamId": teamPlayed2,
                                "record": consecutiveWinStreak,
                                "endingRound": i
                            }
                            if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                                WinStreak.push(teamConsecutiveWinStreak) 
                            }
                        }
                        else{
                            WinStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                            WinStreak[teamIndex].record++;
                        }
                    }
                }
                else{
                    let teamConsecutiveWinStreak = {
                        "teamId": teamPlayed2,
                        "record": consecutiveWinStreak,
                        "endingRound": i - 1 - matchesNonPlayed
                    }
                    if(WinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveWinStreak)}) == false){
                        WinStreak.push(teamConsecutiveWinStreak) 
                    }
                    consecutiveWinStreak = 0
                }
                matchesNonPlayed = 0;
            }
        }
        if(teamHasPlayed == false){
            matchesNonPlayed++;
        }
    }

    WinStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    WinStreak.length = 5;
}

function consecutiveNoWinStreaks(gameData, season, round, teamPlayed1, teamPlayed2){
    let teamPlayedList = [teamPlayed1, teamPlayed2]

    let NoWinStreak = gameData.seasons[season].records.regularSeason.victories.consecutiveNoWinMatches.teams;
    let matchesNonPlayed = 0;
    for(let k = 0; k < teamPlayedList.length; k++){
        let consecutiveNoWinStreak = 0;
        for(let i = 0; i <= round; i++){
            let gamesRound = gameData.seasons[season].schedule[i].games
            let teamHasPlayed = false;
            for(let j = 0; j < gamesRound.length; j++){
                if(gamesRound[j].team1Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals <= gamesRound[j].team2Goals){
                        consecutiveNoWinStreak++;
                        if(i == round){
                            let teamIndex = NoWinStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveNoWinStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveNoWinStreak,
                                    "endingRound": i
                                }
                                if(NoWinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoWinStreak)}) == false){
                                    NoWinStreak.push(teamConsecutiveNoWinStreak) 
                                }
                            }
                            else{
                                NoWinStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                NoWinStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveNoWinStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveNoWinStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(NoWinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoWinStreak)}) == false){
                            NoWinStreak.push(teamConsecutiveNoWinStreak) 
                        }
                        consecutiveNoWinStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
                if(gamesRound[j].team2Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals >= gamesRound[j].team2Goals){
                        consecutiveNoWinStreak++;
                        if(i == round){
                            let teamIndex = NoWinStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveNoWinStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveNoWinStreak,
                                    "endingRound": i
                                }
                                if(NoWinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoWinStreak)}) == false){
                                    NoWinStreak.push(teamConsecutiveNoWinStreak) 
                                }
                            }
                            else{
                                NoWinStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                NoWinStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveNoWinStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveNoWinStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(NoWinStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoWinStreak)}) == false){
                            NoWinStreak.push(teamConsecutiveNoWinStreak) 
                        }
                        consecutiveNoWinStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
            }
            if(teamHasPlayed == false){
                matchesNonPlayed++;
            }
        }
    }

    NoWinStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    NoWinStreak.length = 5;
}

//defeats

function checkDefeats(gameData, season, round, teamPlayed1, teamPlayed2){
    let defeatRecords = gameData.seasons[season].records.regularSeason.defeats;
    let standingsSeasonD = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "L");
    let standingsSeasonDH = standingsHome(gameData, gameData.seasons[season].teams.allTeams, season, round, "L");
    let standingsSeasonDA = standingsAway(gameData, gameData.seasons[season].teams.allTeams, season, round, "L");
    let mostDefeats = [];
    let lessDefeats = [];
    let mostDefeatsHome = [];
    let lessDefeatsHome = [];
    let mostDefeatsAway = [];
    let lessDefeatsAway = [];
    for(let i = 0; i < 5; i++){ //5 teams in standing
        let teamMostDefeats = {
            "teamId": standingsSeasonD[i].id,
            "record": standingsSeasonD[i].defeats()
        }
        mostDefeats.push(teamMostDefeats);
        let teamLessDefeats = {
            "teamId": standingsSeasonD[standingsSeasonD.length - 1 - i].id,
            "record": standingsSeasonD[standingsSeasonD.length - 1 - i].defeats()
        }
        lessDefeats.push(teamLessDefeats);

        let teamMostDefeatsHome = {
            "teamId": standingsSeasonDH[i].id,
            "record": standingsSeasonDH[i].defeatsHome
        }
        mostDefeatsHome.push(teamMostDefeatsHome);
        let teamLessDefeatsHome = {
            "teamId": standingsSeasonDH[standingsSeasonDH.length - 1 - i].id,
            "record": standingsSeasonDH[standingsSeasonDH.length - 1 - i].defeatsHome
        }
        lessDefeatsHome.push(teamLessDefeatsHome);

        let teamMostDefeatsAway = {
            "teamId": standingsSeasonDA[i].id,
            "record": standingsSeasonDA[i].defeatsAway
        }
        mostDefeatsAway.push(teamMostDefeatsAway);
        let teamLessDefeatsAway = {
            "teamId": standingsSeasonDA[standingsSeasonDA.length - 1 - i].id,
            "record": standingsSeasonDA[standingsSeasonDA.length - 1 - i].defeatsAway
        }
        lessDefeatsAway.push(teamLessDefeatsAway);
    }
    defeatRecords.mostDefeats.teams = mostDefeats;
    defeatRecords.lessDefeats.teams = lessDefeats;
    defeatRecords.mostDefeatsHome.teams = mostDefeatsHome;
    defeatRecords.lessDefeatsHome.teams = lessDefeatsHome;
    defeatRecords.mostDefeatsAway.teams = mostDefeatsAway;
    defeatRecords.lessDefeatsAway.teams = lessDefeatsAway;

    //consecutive
    consecutiveDefeatsStreaks(gameData, season, round, teamPlayed1, teamPlayed2)
    consecutiveDefeatsStreaksHome(gameData, season, round, teamPlayed1)
    consecutiveDefeatsStreaksAway(gameData, season, round, teamPlayed2)
    consecutiveNoDefeatsStreaks(gameData, season, round, teamPlayed1, teamPlayed2);
}

function consecutiveDefeatsStreaks(gameData, season, round, teamPlayed1, teamPlayed2){
    let teamPlayedList = [teamPlayed1, teamPlayed2]

    let defeatStreak = gameData.seasons[season].records.regularSeason.defeats.mostConsecutiveDefeats.teams;

    for(let k = 0; k < teamPlayedList.length; k++){
        let consecutiveDefeatStreak = 0;
        let matchesNonPlayed = 0;
        for(let i = 0; i <= round; i++){
            let gamesRound = gameData.seasons[season].schedule[i].games
            let teamHasPlayed = false;
            for(let j = 0; j < gamesRound.length; j++){
                if(gamesRound[j].team1Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals < gamesRound[j].team2Goals){
                        consecutiveDefeatStreak++;
                        if(i == round){
                            let teamIndex = defeatStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveDefeatStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveDefeatStreak,
                                    "endingRound": i
                                }
                                if(defeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatStreak)}) == false){
                                    defeatStreak.push(teamConsecutiveDefeatStreak) 
                                }
                            }
                            else{
                                defeatStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                defeatStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveDefeatStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveDefeatStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(defeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatStreak)}) == false){
                            defeatStreak.push(teamConsecutiveDefeatStreak) 
                        }
                        consecutiveDefeatStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
                else if(gamesRound[j].team2Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals > gamesRound[j].team2Goals){
                        consecutiveDefeatStreak++;
                        if(i == round){
                            let teamIndex = defeatStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveDefeatStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveDefeatStreak,
                                    "endingRound": i
                                }
                                if(defeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatStreak)}) == false){
                                    defeatStreak.push(teamConsecutiveDefeatStreak) 
                                }
                            }
                            else{
                                defeatStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                defeatStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveDefeatStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveDefeatStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(defeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatStreak)}) == false){
                            defeatStreak.push(teamConsecutiveDefeatStreak) 
                        }
                        consecutiveDefeatStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
            }
            if(teamHasPlayed == false){
                matchesNonPlayed++;
            }
        }
    }

    defeatStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    defeatStreak.length = 5;
}

function consecutiveDefeatsStreaksHome(gameData, season, round, teamPlayed1){
    let DefeatsStreak = gameData.seasons[season].records.regularSeason.defeats.mostConsecutiveDefeatsHome.teams;

    let consecutiveDefeatsStreak = 0;
    let matchesNonPlayed = 0;
    for(let i = 0; i <= round; i++){
        let gamesRound = gameData.seasons[season].schedule[i].games;
        let teamHasPlayed = false;
        for(let j = 0; j < gamesRound.length; j++){
            if(gamesRound[j].team1Id == teamPlayed1 && gamesRound[j].team1Goals != ""){
                teamHasPlayed = true;
                if(gamesRound[j].team1Goals < gamesRound[j].team2Goals){
                    consecutiveDefeatsStreak++;
                    if(i == round){
                        let teamIndex = DefeatsStreak.findIndex(team => team.teamId == teamPlayed1 && team.endingRound == i - 1 - matchesNonPlayed);
                        if(teamIndex == -1){
                            let teamConsecutiveDefeatsStreak = {
                                "teamId": teamPlayed1,
                                "record": consecutiveDefeatsStreak,
                                "endingRound": i
                            }
                            if(DefeatsStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatsStreak)}) == false){
                                DefeatsStreak.push(teamConsecutiveDefeatsStreak) 
                            }
                        }
                        else{
                            DefeatsStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                            DefeatsStreak[teamIndex].record++;
                        }
                    }
                }
                else{
                    let teamConsecutiveDefeatsStreak = {
                        "teamId": teamPlayed1,
                        "record": consecutiveDefeatsStreak,
                        "endingRound": i - 1 - matchesNonPlayed
                    }
                    if(DefeatsStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatsStreak)}) == false){
                        DefeatsStreak.push(teamConsecutiveDefeatsStreak) 
                    }
                    consecutiveDefeatsStreak = 0
                }
                matchesNonPlayed = 0;
            }
        }
        if(teamHasPlayed == false){
            matchesNonPlayed++;
        }
    }

    DefeatsStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    DefeatsStreak.length = 5;
}

function consecutiveDefeatsStreaksAway(gameData, season, round, teamPlayed2){
    let DefeatStreak = gameData.seasons[season].records.regularSeason.defeats.mostConsecutiveDefeatsAway.teams;

    let consecutiveDefeatStreak = 0;
    let matchesNonPlayed = 0;
    for(let i = 0; i <= round; i++){
        let gamesRound = gameData.seasons[season].schedule[i].games;
        let teamHasPlayed = false;
        for(let j = 0; j < gamesRound.length; j++){
            if(gamesRound[j].team2Id == teamPlayed2 && gamesRound[j].team1Goals != ""){
                teamHasPlayed = true;
                if(gamesRound[j].team1Goals > gamesRound[j].team2Goals){
                    consecutiveDefeatStreak++;
                    if(i == round){
                        let teamIndex = DefeatStreak.findIndex(team => team.teamId == teamPlayed2 && team.endingRound == i - 1 - matchesNonPlayed);
                        if(teamIndex == -1){
                            let teamConsecutiveDefeatStreak = {
                                "teamId": teamPlayed2,
                                "record": consecutiveDefeatStreak,
                                "endingRound": i
                            }
                            if(DefeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatStreak)}) == false){
                                DefeatStreak.push(teamConsecutiveDefeatStreak) 
                            }
                        }
                        else{
                            DefeatStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                            DefeatStreak[teamIndex].record++;
                        }
                    }
                }
                else{
                    let teamConsecutiveDefeatStreak = {
                        "teamId": teamPlayed2,
                        "record": consecutiveDefeatStreak,
                        "endingRound": i - 1 - matchesNonPlayed
                    }
                    if(DefeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveDefeatStreak)}) == false){
                        DefeatStreak.push(teamConsecutiveDefeatStreak) 
                    }
                    consecutiveDefeatStreak = 0
                }
                matchesNonPlayed = 0;
            }
        }
        if(teamHasPlayed == false){
            matchesNonPlayed++;
        }
    }

    DefeatStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    DefeatStreak.length = 5;
}

function consecutiveNoDefeatsStreaks(gameData, season, round, teamPlayed1, teamPlayed2){
    let teamPlayedList = [teamPlayed1, teamPlayed2]

    let NoDefeatStreak = gameData.seasons[season].records.regularSeason.defeats.consecutiveNoLossMatches.teams;

    for(let k = 0; k < teamPlayedList.length; k++){
        let consecutiveNoDefeatStreak = 0;
        let matchesNonPlayed = 0;
        for(let i = 0; i <= round; i++){
            let gamesRound = gameData.seasons[season].schedule[i].games;
            let teamHasPlayed = false;
            for(let j = 0; j < gamesRound.length; j++){
                if(gamesRound[j].team1Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals >= gamesRound[j].team2Goals){
                        consecutiveNoDefeatStreak++;
                        if(i == round){
                            let teamIndex = NoDefeatStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveNoDefeatStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveNoDefeatStreak,
                                    "endingRound": i
                                }
                                if(NoDefeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoDefeatStreak)}) == false){
                                    NoDefeatStreak.push(teamConsecutiveNoDefeatStreak) 
                                }
                            }
                            else{
                                NoDefeatStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                NoDefeatStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveNoDefeatStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveNoDefeatStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(NoDefeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoDefeatStreak)}) == false){
                            NoDefeatStreak.push(teamConsecutiveNoDefeatStreak) 
                        }
                        consecutiveNoDefeatStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
                if(gamesRound[j].team2Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals <= gamesRound[j].team2Goals){
                        consecutiveNoDefeatStreak++;
                        if(i == round){
                            let teamIndex = NoDefeatStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveNoDefeatStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveNoDefeatStreak,
                                    "endingRound": i
                                }
                                if(NoDefeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoDefeatStreak)}) == false){
                                    NoDefeatStreak.push(teamConsecutiveNoDefeatStreak) 
                                }
                            }
                            else{
                                NoDefeatStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                NoDefeatStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveNoDefeatStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveNoDefeatStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(NoDefeatStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveNoDefeatStreak)}) == false){
                            NoDefeatStreak.push(teamConsecutiveNoDefeatStreak) 
                        }
                        consecutiveNoDefeatStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
            }
            if(teamHasPlayed == false){
                matchesNonPlayed++;
            }
        }
    }

    NoDefeatStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    NoDefeatStreak.length = 5;
}

//ties

function checkTies(gameData, season, round, teamPlayed1, teamPlayed2){
    let tieRecords = gameData.seasons[season].records.regularSeason.ties;
    let standingsSeasonT = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "D");
    let standingsSeasonTH = standingsHome(gameData, gameData.seasons[season].teams.allTeams, season, round, "D");
    let standingsSeasonTA = standingsAway(gameData, gameData.seasons[season].teams.allTeams, season, round, "D");
    let mostTies = [];
    let lessTies = [];
    let mostTiesHome = [];
    let lessTiesHome = [];
    let mostTiesAway = [];
    let lessTiesAway = [];
    for(let i = 0; i < 5; i++){ //5 teams in standing
        let teamMostTies = {
            "teamId": standingsSeasonT[i].id,
            "record": standingsSeasonT[i].ties()
        }
        mostTies.push(teamMostTies);
        let teamLessTies = {
            "teamId": standingsSeasonT[standingsSeasonT.length - 1 - i].id,
            "record": standingsSeasonT[standingsSeasonT.length - 1 - i].ties()
        }
        lessTies.push(teamLessTies);

        let teamMostTiesHome = {
            "teamId": standingsSeasonTH[i].id,
            "record": standingsSeasonTH[i].tiesHome
        }
        mostTiesHome.push(teamMostTiesHome);
        let teamLessTiesHome = {
            "teamId": standingsSeasonTH[standingsSeasonTH.length - 1 - i].id,
            "record": standingsSeasonTH[standingsSeasonTH.length - 1 - i].tiesHome
        }
        lessTiesHome.push(teamLessTiesHome);

        let teamMostTiesAway = {
            "teamId": standingsSeasonTA[i].id,
            "record": standingsSeasonTA[i].tiesAway
        }
        mostTiesAway.push(teamMostTiesAway);
        let teamLessTiesAway = {
            "teamId": standingsSeasonTA[standingsSeasonTA.length - 1 - i].id,
            "record": standingsSeasonTA[standingsSeasonTA.length - 1 - i].tiesAway
        }
        lessTiesAway.push(teamLessTiesAway);
    }
    tieRecords.mostTies.teams = mostTies;
    tieRecords.lessTies.teams = lessTies;
    tieRecords.mostTiesHome.teams = mostTiesHome;
    tieRecords.lessTiesHome.teams = lessTiesHome;
    tieRecords.mostTiesAway.teams = mostTiesAway;
    tieRecords.lessTiesAway.teams = lessTiesAway;

    //consecutive
    consecutiveTiesStreaks(gameData, season, round, teamPlayed1, teamPlayed2)
    consecutiveTiesStreaksHome(gameData, season, round, teamPlayed1)
    consecutiveTiesStreaksAway(gameData, season, round, teamPlayed2)
}

function consecutiveTiesStreaks(gameData, season, round, teamPlayed1, teamPlayed2){
    let teamPlayedList = [teamPlayed1, teamPlayed2]

    let TieStreak = gameData.seasons[season].records.regularSeason.ties.mostConsecutiveTies.teams;

    for(let k = 0; k < teamPlayedList.length; k++){
        let consecutiveTieStreak = 0;
        let matchesNonPlayed = 0;
        for(let i = 0; i <= round; i++){
            let gamesRound = gameData.seasons[season].schedule[i].games;
            let teamHasPlayed = 0;
            for(let j = 0; j < gamesRound.length; j++){
                if(gamesRound[j].team1Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals == gamesRound[j].team2Goals){
                        consecutiveTieStreak++;
                        if(i == round){
                            let teamIndex = TieStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveTieStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveTieStreak,
                                    "endingRound": i
                                }
                                if(TieStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTieStreak)}) == false){
                                    TieStreak.push(teamConsecutiveTieStreak) 
                                }
                            }
                            else{
                                TieStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                                TieStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveTieStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveTieStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(TieStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTieStreak)}) == false){
                            TieStreak.push(teamConsecutiveTieStreak) 
                        }
                        consecutiveTieStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
                else if(gamesRound[j].team2Id == teamPlayedList[k] && gamesRound[j].team1Goals != ""){
                    teamHasPlayed = true;
                    if(gamesRound[j].team1Goals == gamesRound[j].team2Goals){
                        consecutiveTieStreak++;
                        if(i == round){
                            let teamIndex = TieStreak.findIndex(team => team.teamId == teamPlayedList[k] && team.endingRound == i - 1 - matchesNonPlayed);
                            if(teamIndex == -1){
                                let teamConsecutiveTieStreak = {
                                    "teamId": teamPlayedList[k],
                                    "record": consecutiveTieStreak,
                                    "endingRound": i
                                }
                                if(TieStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTieStreak)}) == false){
                                    TieStreak.push(teamConsecutiveTieStreak) 
                                }
                            }
                            else{
                                TieStreak[teamIndex].endingRound += matchesNonPlayed;
                                TieStreak[teamIndex].record++;
                            }
                        }
                    }
                    else{
                        let teamConsecutiveTieStreak = {
                            "teamId": teamPlayedList[k],
                            "record": consecutiveTieStreak,
                            "endingRound": i - 1 - matchesNonPlayed
                        }
                        if(TieStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTieStreak)}) == false){
                            TieStreak.push(teamConsecutiveTieStreak) 
                        }
                        consecutiveTieStreak = 0
                    }
                    matchesNonPlayed = 0;
                }
            }
            if(teamHasPlayed == false){
                matchesNonPlayed++;
            }
        }
    }

    TieStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    TieStreak.length = 5;
}

function consecutiveTiesStreaksHome(gameData, season, round, teamPlayed1){
    let TiesStreak = gameData.seasons[season].records.regularSeason.ties.mostConsecutiveTiesHome.teams;

    let consecutiveTiesStreak = 0;
    let matchesNonPlayed = 0;
    for(let i = 0; i <= round; i++){
        let gamesRound = gameData.seasons[season].schedule[i].games;
        let teamHasPlayed = 0;
        for(let j = 0; j < gamesRound.length; j++){
            if(gamesRound[j].team1Id == teamPlayed1 && gamesRound[j].team1Goals != ""){
                teamHasPlayed = true;
                if(gamesRound[j].team1Goals == gamesRound[j].team2Goals){
                    consecutiveTiesStreak++;
                    if(i == round){
                        let teamIndex = TiesStreak.findIndex(team => team.teamId == teamPlayed1 && team.endingRound == i - 1 - matchesNonPlayed);
                        if(teamIndex == -1){
                            let teamConsecutiveTiesStreak = {
                                "teamId": teamPlayed1,
                                "record": consecutiveTiesStreak,
                                "endingRound": i
                            }
                            if(TiesStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTiesStreak)}) == false){
                                TiesStreak.push(teamConsecutiveTiesStreak) 
                            }
                        }
                        else{
                            TiesStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                            TiesStreak[teamIndex].record++;
                        }
                    }
                }
                else{
                    let teamConsecutiveTiesStreak = {
                        "teamId": teamPlayed1,
                        "record": consecutiveTiesStreak,
                        "endingRound": i - 1 - matchesNonPlayed
                    }
                    if(TiesStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTiesStreak)}) == false){
                        TiesStreak.push(teamConsecutiveTiesStreak) 
                    }
                    consecutiveTiesStreak = 0
                }
                matchesNonPlayed = 0;
            }
        }
        if(teamHasPlayed == false){
            matchesNonPlayed++;
        }
    }

    TiesStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    TiesStreak.length = 5;
}

function consecutiveTiesStreaksAway(gameData, season, round, teamPlayed2){
    let TieStreak = gameData.seasons[season].records.regularSeason.ties.mostConsecutiveTiesAway.teams;

    let consecutiveTieStreak = 0;
    let matchesNonPlayed = 0;
    for(let i = 0; i <= round; i++){
        let gamesRound = gameData.seasons[season].schedule[i].games;
        let teamHasPlayed = false;
        for(let j = 0; j < gamesRound.length; j++){
            if(gamesRound[j].team2Id == teamPlayed2 && gamesRound[j].team1Goals != ""){
                teamHasPlayed = true;
                if(gamesRound[j].team1Goals == gamesRound[j].team2Goals){
                    consecutiveTieStreak++;
                    if(i == round){
                        let teamIndex = TieStreak.findIndex(team => team.teamId == teamPlayed2 && team.endingRound == i - 1 - matchesNonPlayed);
                        if(teamIndex == -1){
                            let teamConsecutiveTieStreak = {
                                "teamId": teamPlayed2,
                                "record": consecutiveTieStreak,
                                "endingRound": i
                            }
                            if(TieStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTieStreak)}) == false){
                                TieStreak.push(teamConsecutiveTieStreak) 
                            }
                        }
                        else{
                            TieStreak[teamIndex].endingRound += 1 + matchesNonPlayed;
                            TieStreak[teamIndex].record++;
                        }
                    }
                }
                else{
                    let teamConsecutiveTieStreak = {
                        "teamId": teamPlayed2,
                        "record": consecutiveTieStreak,
                        "endingRound": i - 1 - matchesNonPlayed
                    }
                    if(TieStreak.some((team) => {return JSON.stringify(team) == JSON.stringify(teamConsecutiveTieStreak)}) == false){
                        TieStreak.push(teamConsecutiveTieStreak) 
                    }
                    consecutiveTieStreak = 0
                }
                matchesNonPlayed = 0;
            }
        }
        if(teamHasPlayed == false){
            matchesNonPlayed++;
        }
    }

    TieStreak.sort(function(left,right){    //ca marche (-1 = true? et 1 = false?)
        if(left.record > right.record){
            return -1;
        }
        else if (left.record > right.record){
            return 1;
        }
    });
    TieStreak.length = 5;
}

//goals

function checkGoals(gameData, season, round, teamPlayed1, teamPlayed2){
    let goalRecords = gameData.seasons[season].records.regularSeason.goals;
    let standingsSeasonGS = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "GF");
    let standingsSeasonGSH = standingsHome(gameData, gameData.seasons[season].teams.allTeams, season, round, "GF");
    let standingsSeasonGSA = standingsAway(gameData, gameData.seasons[season].teams.allTeams, season, round, "GF");
    let mostGoalsScored = [];
    let lessGoalsScored = [];
    let mostGoalsScoredHome = [];
    let lessGoalsScoredHome = [];
    let mostGoalsScoredAway = [];
    let lessGoalsScoredAway = [];
    let standingsSeasonGA = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "GA");
    let standingsSeasonGAH = standingsHome(gameData, gameData.seasons[season].teams.allTeams, season, round, "GA");
    let standingsSeasonGAA = standingsAway(gameData, gameData.seasons[season].teams.allTeams, season, round, "GA");
    let mostGoalsAgainst = [];
    let lessGoalsAgainst = [];
    let mostGoalsAgainstHome = [];
    let lessGoalsAgainstHome = [];
    let mostGoalsAgainstAway = [];
    let lessGoalsAgainstAway = [];
    let standingsSeasonGD = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "GD");
    let standingsSeasonGDH = standingsHome(gameData, gameData.seasons[season].teams.allTeams, season, round, "GD");
    let standingsSeasonGDA = standingsAway(gameData, gameData.seasons[season].teams.allTeams, season, round, "GD");
    let bestGoalDifference = [];
    let worstGoalDifference = [];
    let bestGoalDifferenceHome = [];
    let worstGoalDifferenceHome = [];
    let bestGoalDifferenceAway = [];
    let worstGoalDifferenceAway = [];
    let standingsSeasonSO = standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "SO");
    let standingsSeasonSOH = standingsHome(gameData, gameData.seasons[season].teams.allTeams, season, round, "SO");
    let standingsSeasonSOA = standingsAway(gameData, gameData.seasons[season].teams.allTeams, season, round, "SO");
    let mostShutouts = [];
    let lessShutouts = [];
    let mostShutoutsHome = [];
    let lessShutoutsHome = [];
    let mostShutoutsAway = [];
    let lessShutoutsAway = [];
    for(let i = 0; i < 5; i++){ //5 teams in standing
        //goals Scored
        let teamMostGoalsScored = {
            "teamId": standingsSeasonGS[i].id,
            "record": standingsSeasonGS[i].goalsScored()
        }
        mostGoalsScored.push(teamMostGoalsScored);
        let teamLessGoalsScored = {
            "teamId": standingsSeasonGS[standingsSeasonGS.length - 1 - i].id,
            "record": standingsSeasonGS[standingsSeasonGS.length - 1 - i].goalsScored()
        }
        lessGoalsScored.push(teamLessGoalsScored);

        let teamMostGoalsScoredHome = {
            "teamId": standingsSeasonGSH[i].id,
            "record": standingsSeasonGSH[i].goalsScoredHome
        }
        mostGoalsScoredHome.push(teamMostGoalsScoredHome);
        let teamLessGoalsScoredHome = {
            "teamId": standingsSeasonGSH[standingsSeasonGSH.length - 1 - i].id,
            "record": standingsSeasonGSH[standingsSeasonGSH.length - 1 - i].goalsScoredHome
        }
        lessGoalsScoredHome.push(teamLessGoalsScoredHome);

        let teamMostGoalsScoredAway = {
            "teamId": standingsSeasonGSA[i].id,
            "record": standingsSeasonGSA[i].goalsScoredAway
        }
        mostGoalsScoredAway.push(teamMostGoalsScoredAway);
        let teamLessGoalsScoredAway = {
            "teamId": standingsSeasonGSA[standingsSeasonGSA.length - 1 - i].id,
            "record": standingsSeasonGSA[standingsSeasonGSA.length - 1 - i].goalsScoredAway
        }
        lessGoalsScoredAway.push(teamLessGoalsScoredAway);

        //goals against
        let teamMostGoalsAgainst = {
            "teamId": standingsSeasonGA[i].id,
            "record": standingsSeasonGA[i].goalsAgainst()
        }
        mostGoalsAgainst.push(teamMostGoalsAgainst);
        let teamLessGoalsAgainst = {
            "teamId": standingsSeasonGA[standingsSeasonGA.length - 1 - i].id,
            "record": standingsSeasonGA[standingsSeasonGA.length - 1 - i].goalsAgainst()
        }
        lessGoalsAgainst.push(teamLessGoalsAgainst);

        let teamMostGoalsAgainstHome = {
            "teamId": standingsSeasonGAH[i].id,
            "record": standingsSeasonGAH[i].goalsAgainstHome
        }
        mostGoalsAgainstHome.push(teamMostGoalsAgainstHome);
        let teamLessGoalsAgainstHome = {
            "teamId": standingsSeasonGAH[standingsSeasonGAH.length - 1 - i].id,
            "record": standingsSeasonGAH[standingsSeasonGAH.length - 1 - i].goalsAgainstHome
        }
        lessGoalsAgainstHome.push(teamLessGoalsAgainstHome);

        let teamMostGoalsAgainstAway = {
            "teamId": standingsSeasonGAA[i].id,
            "record": standingsSeasonGAA[i].goalsAgainstAway
        }
        mostGoalsAgainstAway.push(teamMostGoalsAgainstAway);
        let teamLessGoalsAgainstAway = {
            "teamId": standingsSeasonGAA[standingsSeasonGAA.length - 1 - i].id,
            "record": standingsSeasonGAA[standingsSeasonGAA.length - 1 - i].goalsAgainstAway
        }
        lessGoalsAgainstAway.push(teamLessGoalsAgainstAway);

        //goals differential
        let teamBestGoalDifference = {
            "teamId": standingsSeasonGD[i].id,
            "record": standingsSeasonGD[i].goalDifferential()
        }
        bestGoalDifference.push(teamBestGoalDifference);
        let teamWorstGoalDifference = {
            "teamId": standingsSeasonGD[standingsSeasonGD.length - 1 - i].id,
            "record": standingsSeasonGD[standingsSeasonGD.length - 1 - i].goalDifferential()
        }
        worstGoalDifference.push(teamWorstGoalDifference);

        let teamBestGoalDifferenceHome = {
            "teamId": standingsSeasonGDH[i].id,
            "record": standingsSeasonGDH[i].goalDifferentialHome()
        }
        bestGoalDifferenceHome.push(teamBestGoalDifferenceHome);
        let teamWorstGoalDifferenceHome = {
            "teamId": standingsSeasonGDH[standingsSeasonGDH.length - 1 - i].id,
            "record": standingsSeasonGDH[standingsSeasonGDH.length - 1 - i].goalDifferentialHome()
        }
        worstGoalDifferenceHome.push(teamWorstGoalDifferenceHome);

        let teamBestGoalDifferenceAway = {
            "teamId": standingsSeasonGDA[i].id,
            "record": standingsSeasonGDA[i].goalDifferentialAway()
        }
        bestGoalDifferenceAway.push(teamBestGoalDifferenceAway);
        let teamWorstGoalDifferenceAway = {
            "teamId": standingsSeasonGDA[standingsSeasonGDA.length - 1 - i].id,
            "record": standingsSeasonGDA[standingsSeasonGDA.length - 1 - i].goalDifferentialAway()
        }
        worstGoalDifferenceAway.push(teamWorstGoalDifferenceAway);

        //shutouts
        let teamMostShutouts = {
            "teamId": standingsSeasonSO[i].id,
            "record": standingsSeasonSO[i].shutouts()
        }
        mostShutouts.push(teamMostShutouts);
        let teamLessShutouts = {
            "teamId": standingsSeasonSO[standingsSeasonSO.length - 1 - i].id,
            "record": standingsSeasonSO[standingsSeasonSO.length - 1 - i].shutouts()
        }
        lessShutouts.push(teamLessShutouts);

        let teamMostShutoutsHome = {
            "teamId": standingsSeasonSOH[i].id,
            "record": standingsSeasonSOH[i].shutoutsHome
        }
        mostShutoutsHome.push(teamMostShutoutsHome);
        let teamLessShutoutsHome = {
            "teamId": standingsSeasonSOH[standingsSeasonSOH.length - 1 - i].id,
            "record": standingsSeasonSOH[standingsSeasonSOH.length - 1 - i].shutoutsHome
        }
        lessShutoutsHome.push(teamLessShutoutsHome);

        let teamMostShutoutsAway = {
            "teamId": standingsSeasonSOA[i].id,
            "record": standingsSeasonSOA[i].shutoutsAway
        }
        mostShutoutsAway.push(teamMostShutoutsAway);
        let teamLessShutoutsAway = {
            "teamId": standingsSeasonSOA[standingsSeasonSOA.length - 1 - i].id,
            "record": standingsSeasonSOA[standingsSeasonSOA.length - 1 - i].shutoutsAway
        }
        lessShutoutsAway.push(teamLessShutoutsAway);

    }
    goalRecords.mostGoalsScored.teams = mostGoalsScored;
    goalRecords.lessGoalsScored.teams = lessGoalsScored;
    goalRecords.mostGoalsScoredHome.teams = mostGoalsScoredHome;
    goalRecords.lessGoalsScoredHome.teams = lessGoalsScoredHome;
    goalRecords.mostGoalsScoredAway.teams = mostGoalsScoredAway;
    goalRecords.lessGoalsScoredAway.teams = lessGoalsScoredAway;

    goalRecords.mostGoalsAgainst.teams = mostGoalsAgainst;
    goalRecords.lessGoalsAgainst.teams = lessGoalsAgainst;
    goalRecords.mostGoalsAgainstHome.teams = mostGoalsAgainstHome;
    goalRecords.lessGoalsAgainstHome.teams = lessGoalsAgainstHome;
    goalRecords.mostGoalsAgainstAway.teams = mostGoalsAgainstAway;
    goalRecords.lessGoalsAgainstAway.teams = lessGoalsAgainstAway;

    goalRecords.bestGoalDifference.teams = bestGoalDifference;
    goalRecords.worstGoalDifference.teams = worstGoalDifference;
    goalRecords.bestGoalDifferenceHome.teams = bestGoalDifferenceHome;
    goalRecords.worstGoalDifferenceHome.teams = worstGoalDifferenceHome;
    goalRecords.bestGoalDifferenceAway.teams = bestGoalDifferenceAway;
    goalRecords.worstGoalDifferenceAway.teams = worstGoalDifferenceAway;

    goalRecords.mostShutouts.teams = mostShutouts;
    goalRecords.lessShutouts.teams = lessShutouts;
    goalRecords.mostShutoutsHome.teams = mostShutoutsHome;
    goalRecords.lessShutoutsHome.teams = lessShutoutsHome;
    goalRecords.mostShutoutsAway.teams = mostShutoutsAway;
    goalRecords.lessShutoutsAway.teams = lessShutoutsAway;
}

