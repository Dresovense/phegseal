let gameData = JSON.parse(sessionStorage.getItem("gameData"));
const Standings = require("../functions/standings.js");
const fs = require('fs');

let records = gameData.records;

records.regularSeason.ties.lessTies.teams = [];
records.regularSeason.ties.lessTiesAway.teams = [];
records.regularSeason.ties.lessTiesHome.teams = [];
records.regularSeason.ties.mostConsecutiveTiesAway.teams = [];
records.regularSeason.ties.mostConsecutiveTies.teams = [];
records.regularSeason.ties.mostConsecutiveTiesHome.teams = [];
records.regularSeason.ties.mostTies.teams = [];

//Records all Time
for(let season = 0; season < gameData.seasons.length - 1; season++){   //seasons
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

            /* //Most consecutive no ties:
            consecutiveRun = []
            for(let round = 0; round < gameData.seasons[season].schedule.length; round++){
                for(let match = 0; match < gameData.seasons[season].schedule[round].games.length; match++){
                    let matchInfo = gameData.seasons[season].schedule[round].games[match];
                    if(matchInfo.team1Id == teamId){
                        if(matchInfo.team1Goals >= matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let consecutiveNoLoseMatches = records.regularSeason.ties.consecutiveNoLoseMatches.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(consecutiveNoLoseMatches[recordHolder]){
                                    if(consecutiveNoLoseMatches[recordHolder].record < consecutiveRun.length){
                                        consecutiveNoLoseMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    consecutiveNoLoseMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            consecutiveNoLoseMatches.length = 10;
                            consecutiveRun = [];
                        }
                    }
                    else if(matchInfo.team2Id == teamId){
                        if(matchInfo.team1Goals <= matchInfo.team2Goals){
                            consecutiveRun.push(round);
                        }
                        else{
                            let consecutiveNoLoseMatches = records.regularSeason.ties.consecutiveNoLoseMatches.teams;
                            for(let recordHolder = 0; recordHolder < 10; recordHolder++){
                                if(consecutiveNoLoseMatches[recordHolder]){
                                    if(consecutiveNoLoseMatches[recordHolder].record < consecutiveRun.length){
                                        consecutiveNoLoseMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                        break;
                                    }
                                }
                                else{
                                    consecutiveNoLoseMatches.splice(recordHolder, 0, {teamId: teamId, seasonId: season, record: consecutiveRun.length, endRound: consecutiveRun[consecutiveRun.length - 1]});
                                    break;
                                }
                            }
                            consecutiveNoLoseMatches.length = 10;
                            consecutiveRun = [];
                        }
                    }
                }
            } */
    }

}

let saveButton = document.createElement("button");
document.body.appendChild(saveButton);
saveButton.innerText = "Save";
saveButton.addEventListener("click", () => {
    fs.writeFile('../saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
        if(err){
            return console.log(err);
        }
    });
    sessionStorage.setItem("gameData", JSON.stringify(gameData));    
    window.location.reload(false);
})