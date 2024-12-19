module.exports = {
    testAllTimeRecords: function(gameData, season){
        checkPoints(gameData, season)
        checkPointsPer(gameData, season)
        checkVictories(gameData, season)
    }
}

const Standings = require("../functions/standings.js");


function checkPoints(gameData, season){
    let records = gameData.records
    let standings = Standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "Pts");
    for(let team = 0; team < standings.length; team++){
        //set records:
            //most Points:
            let mostPoints = records.regularSeason.points.mostPoints.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostPoints[recordHolder]){
                    if(mostPoints[recordHolder].record < standings[team].points()){
                        mostPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].points()});
                        break;
                    }
                }
                else{
                    mostPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].points()});
                    break;
                }
            }
            mostPoints.length = 10;
            //less Points:
            let lessPoints = records.regularSeason.points.lessPoints.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessPoints[recordHolder]){
                    if(lessPoints[recordHolder].record > standings[team].points()){
                        lessPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].points()});
                        break;
                    }
                }
                else{
                    lessPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].points()});
                    break;
                }
            }
            lessPoints.length = 10;    
            //most Points No First:
            let mostPointsNoFirst = records.regularSeason.points.mostPointsNoFirst.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(team != 0){
                    if(mostPointsNoFirst[recordHolder]){
                        if(mostPointsNoFirst[recordHolder].record < standings[team].points()){
                            mostPointsNoFirst.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].points()});
                            break;
                        }
                    }
                    else{
                        mostPointsNoFirst.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].points()});
                        break;
                    }
                }
            }
            mostPointsNoFirst.length = 10;
    }

    //less Points First:
    let lessPointsFirst = records.regularSeason.points.lessPointsFirst.teams;
    for(let recordHolder = 0; recordHolder < 10; recordHolder++){
        if(lessPointsFirst[recordHolder]){
            if(lessPointsFirst[recordHolder].record > standings[0].points()){
                lessPointsFirst.splice(recordHolder, 0, {teamId: standings[0].id, seasonId: season, record: standings[0].points()});
                break;
            }
        }
        else{
            lessPointsFirst.splice(recordHolder, 0, {teamId: standings[0].id, seasonId: season, record: standings[0].points()});
            break;
        }
    }
    lessPointsFirst.length = 10;
}

function checkPointsPer(gameData, season){
    let records = gameData.records
    let standings = Standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "Pts");
    for(let team = 0; team < standings.length; team++){
        //set records:
            //most Points:
            let mostPoints = records.regularSeason.pointsPer.mostPoints.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostPoints[recordHolder]){
                    if(mostPoints[recordHolder].record < (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)){
                        mostPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)});
                        break;
                    }
                }
                else{
                    mostPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)});
                    break;
                }
            }
            mostPoints.length = 10;
            //less Points:
            let lessPoints = records.regularSeason.pointsPer.lessPoints.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessPoints[recordHolder]){
                    if(lessPoints[recordHolder].record > (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)){
                        lessPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)});
                        break;
                    }
                }
                else{
                    lessPoints.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)});
                    break;
                }
            }
            lessPoints.length = 10;    
            //most Points No First:
            let mostPointsNoFirst = records.regularSeason.pointsPer.mostPointsNoFirst.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(team != 0){
                    if(mostPointsNoFirst[recordHolder]){
                        if(mostPointsNoFirst[recordHolder].record < (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)){
                            mostPointsNoFirst.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)});
                            break;
                        }
                    }
                    else{
                        mostPointsNoFirst.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: (standings[team].points() / (standings[team].gamesPlayed() * 3)).toFixed(3)});
                        break;
                    }
                }
            }
            mostPointsNoFirst.length = 10;
    }

    //less Points First:
    let lessPointsFirst = records.regularSeason.pointsPer.lessPointsFirst.teams;
    for(let recordHolder = 0; recordHolder < 10; recordHolder++){
        if(lessPointsFirst[recordHolder]){
            if(lessPointsFirst[recordHolder].record > (standings[0].points() / (standings[0].gamesPlayed() * 3)).toFixed(3)){
                lessPointsFirst.splice(recordHolder, 0, {teamId: standings[0].id, seasonId: season, record: (standings[0].points() / (standings[0].gamesPlayed() * 3)).toFixed(3)});
                break;
            }
        }
        else{
            lessPointsFirst.splice(recordHolder, 0, {teamId: standings[0].id, seasonId: season, record: (standings[0].points() / (standings[0].gamesPlayed() * 3)).toFixed(3)});
            break;
        }
    }
    lessPointsFirst.length = 10;
}

function checkVictories(gameData, season){
    let records = gameData.records
    let standings = Standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "V");
    for(let team = 0; team < standings.length; team++){
        //set records:
            //most Victories:
            let mostVictories = records.regularSeason.victories.mostVictories.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostVictories[recordHolder]){
                    if(mostVictories[recordHolder].record < standings[team].victories()){
                        mostVictories.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victories()});
                        break;
                    }
                }
                else{
                    mostVictories.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victories()});
                    break;
                }
            }
            mostVictories.length = 10;

            //most Victories Home:
            let mostVictoriesHome = records.regularSeason.victories.mostVictoriesHome.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostVictoriesHome[recordHolder]){
                    if(mostVictoriesHome[recordHolder].record < standings[team].victoriesHome){
                        mostVictoriesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesHome});
                        break;
                    }
                }
                else{
                    mostVictoriesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesHome});
                    break;
                }
            }
            mostVictoriesHome.length = 10;

            //most Victories Away:
            let mostVictoriesAway = records.regularSeason.victories.mostVictoriesAway.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostVictoriesAway[recordHolder]){
                    if(mostVictoriesAway[recordHolder].record < standings[team].victoriesAway){
                        mostVictoriesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesAway});
                        break;
                    }
                }
                else{
                    mostVictoriesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesAway});
                    break;
                }
            }
            mostVictoriesAway.length = 10;

            //less Victories:
            let lessVictories = records.regularSeason.victories.lessVictories.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessVictories[recordHolder]){
                    if(lessVictories[recordHolder].record > standings[team].victories()){
                        lessVictories.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victories()});
                        break;
                    }
                }
                else{
                    lessVictories.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victories()});
                    break;
                }
            }
            lessVictories.length = 10;

            //less Victories Home:
            let lessVictoriesHome = records.regularSeason.victories.lessVictoriesHome.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessVictoriesHome[recordHolder]){
                    if(lessVictoriesHome[recordHolder].record > standings[team].victoriesHome){
                        lessVictoriesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesHome});
                        break;
                    }
                }
                else{
                    lessVictoriesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesHome});
                    break;
                }
            }
            lessVictoriesHome.length = 10;

            //less Victories Away:
            let lessVictoriesAway = records.regularSeason.victories.lessVictoriesAway.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessVictoriesAway[recordHolder]){
                    if(lessVictoriesAway[recordHolder].record > standings[team].victoriesAway){
                        lessVictoriesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesAway});
                        break;
                    }
                }
                else{
                    lessVictoriesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].victoriesAway});
                    break;
                }
            }
            lessVictoriesAway.length = 10;


            //consecutives:

            let teamId = standings[team].id;
            
            //Most consecutive victories:
            let consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team1Id == teamId){
                        if(matchInfo.team1Goals > matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveVictories = records.regularSeason.victories.mostConsecutiveVictories.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveVictories[recordHolder]){
                                    if(mostConsecutiveVictories[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveVictories.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveVictories.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveVictories.length = 10;
                            consecutiveRun = [];
                        }
                    }
                    else if(matchInfo.team2Id == teamId){
                        if(matchInfo.team1Goals < matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveVictories = records.regularSeason.victories.mostConsecutiveVictories.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveVictories[recordHolder]){
                                    if(mostConsecutiveVictories[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveVictories.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveVictories.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveVictories.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            }

            //Most consecutive victories Home:
            consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team1Id == teamId){
                        if(matchInfo.team1Goals > matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveVictoriesHome = records.regularSeason.victories.mostConsecutiveVictoriesHome.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveVictoriesHome[recordHolder]){
                                    if(mostConsecutiveVictoriesHome[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveVictoriesHome.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveVictoriesHome.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveVictoriesHome.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            }

            //Most consecutive victories away:
            consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team2Id == teamId){
                        if(matchInfo.team1Goals < matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveVictoriesAway = records.regularSeason.victories.mostConsecutiveVictoriesAway.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveVictoriesAway[recordHolder]){
                                    if(mostConsecutiveVictoriesAway[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveVictoriesAway.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveVictoriesAway.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveVictoriesAway.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            }

            //Most consecutive no victories:
            consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team1Id == teamId){
                        if(matchInfo.team1Goals <= matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let consecutiveNoWinMatches = records.regularSeason.victories.consecutiveNoWinMatches.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(consecutiveNoWinMatches[recordHolder]){
                                    if(consecutiveNoWinMatches[recordHolder].record < consecutiveRun.length){
                                        consecutiveNoWinMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    consecutiveNoWinMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            consecutiveNoWinMatches.length = 10;
                            consecutiveRun = [];
                        }
                    }
                    else if(matchInfo.team2Id == teamId){
                        if(matchInfo.team1Goals >= matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let consecutiveNoWinMatches = records.regularSeason.victories.consecutiveNoWinMatches.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(consecutiveNoWinMatches[recordHolder]){
                                    if(consecutiveNoWinMatches[recordHolder].record < consecutiveRun.length){
                                        consecutiveNoWinMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    consecutiveNoWinMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            consecutiveNoWinMatches.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            }
    }
}

function checkTies(gameData, season){
    let records = gameData.records
    let standings = Standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, gameData.seasons[season].schedule.length - 1, "L");
    for(let team = 0; team < standings.length; team++){
        //set records:
            //most ties:
            let mostTies = records.regularSeason.ties.mostTies.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostTies[recordHolder]){
                    if(mostTies[recordHolder].record < standings[team].ties()){
                        mostTies.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].ties()});
                        break;
                    }
                }
                else{
                    mostTies.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].ties()});
                    break;
                }
            }
            mostTies.length = 10;

            //most ties Home:
            let mostTiesHome = records.regularSeason.ties.mostTiesHome.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostTiesHome[recordHolder]){
                    if(mostTiesHome[recordHolder].record < standings[team].tiesHome){
                        mostTiesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesHome});
                        break;
                    }
                }
                else{
                    mostTiesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesHome});
                    break;
                }
            }
            mostTiesHome.length = 10;

            //most ties Away:
            let mostTiesAway = records.regularSeason.ties.mostTiesAway.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(mostTiesAway[recordHolder]){
                    if(mostTiesAway[recordHolder].record < standings[team].tiesAway){
                        mostTiesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesAway});
                        break;
                    }
                }
                else{
                    mostTiesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesAway});
                    break;
                }
            }
            mostTiesAway.length = 10;

            //less ties:
            let lessTies = records.regularSeason.ties.lessTies.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessTies[recordHolder]){
                    if(lessTies[recordHolder].record > standings[team].ties()){
                        lessTies.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].ties()});
                        break;
                    }
                }
                else{
                    lessTies.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].ties()});
                    break;
                }
            }
            lessTies.length = 10;

            //less ties Home:
            let lessTiesHome = records.regularSeason.ties.lessTiesHome.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessTiesHome[recordHolder]){
                    if(lessTiesHome[recordHolder].record > standings[team].tiesHome){
                        lessTiesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesHome});
                        break;
                    }
                }
                else{
                    lessTiesHome.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesHome});
                    break;
                }
            }
            lessTiesHome.length = 10;

            //less ties Away:
            let lessTiesAway = records.regularSeason.ties.lessTiesAway.teams;
            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                if(lessTiesAway[recordHolder]){
                    if(lessTiesAway[recordHolder].record > standings[team].tiesAway){
                        lessTiesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesAway});
                        break;
                    }
                }
                else{
                    lessTiesAway.splice(recordHolder, 0, {teamId: standings[team].id, seasonId: season, record: standings[team].tiesAway});
                    break;
                }
            }
            lessTiesAway.length = 10;


            //consecutives:

            let teamId = standings[team].id;
            
            //Most consecutive ties:
            let consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team1Id == teamId){
                        if(matchInfo.team1Goals == matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveTies = records.regularSeason.ties.mostConsecutiveTies.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveTies[recordHolder]){
                                    if(mostConsecutiveTies[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveTies.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveTies.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveTies.length = 10;
                            consecutiveRun = [];
                        }
                    }
                    else if(matchInfo.team2Id == teamId){
                        if(matchInfo.team1Goals == matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveTies = records.regularSeason.ties.mostConsecutiveTies.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveTies[recordHolder]){
                                    if(mostConsecutiveTies[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveTies.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveTies.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveTies.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            }

            //Most consecutive ties Home:
            consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team1Id == teamId){
                        if(matchInfo.team1Goals == matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveTiesHome = records.regularSeason.ties.mostConsecutiveTiesHome.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveTiesHome[recordHolder]){
                                    if(mostConsecutiveTiesHome[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveTiesHome.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveTiesHome.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveTiesHome.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            }

            //Most consecutive ties away:
            consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team2Id == teamId){
                        if(matchInfo.team1Goals == matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let mostConsecutiveTiesAway = records.regularSeason.ties.mostConsecutiveTiesAway.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(mostConsecutiveTiesAway[recordHolder]){
                                    if(mostConsecutiveTiesAway[recordHolder].record < consecutiveRun.length){
                                        mostConsecutiveTiesAway.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    mostConsecutiveTiesAway.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            mostConsecutiveTiesAway.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            }
    }
}