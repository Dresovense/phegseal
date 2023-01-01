let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let team = sessionStorage.getItem("team");
const Standings = require("../functions/standings.js");


//team Name
let teamName = document.createElement("h1");
teamName.innerText = gameData.teams[team].name;
teamName.className = "team_teamName";
document.body.appendChild(teamName);
//logo
let teamLogo = document.createElement("img");
teamLogo.src = ".." + gameData.teams[team].logo + ".png";
teamLogo.className = "team_teamLogo";
document.body.appendChild(teamLogo);

//teamInfoGrid
    //teamInfos Grid
    let teamInfos = document.createElement("grid");
    teamInfos.className = "team_teamInfos";
    document.body.appendChild(teamInfos);
    //date
    let teamDate0 = document.createElement("div");
    teamDate0.innerText = "First Season:";
    teamDate0.className = "team_teamInfosSquare";
    teamInfos.appendChild(teamDate0);
    let teamDate1 = document.createElement("div");
    teamDate1.innerText = gameData.seasons[gameData.teams[team].date].date;
    teamDate1.className = "team_teamInfosSquare";
    teamInfos.appendChild(teamDate1);
    //town
    let teamTown0 = document.createElement("div");
    teamTown0.innerText = "Town:";
    teamTown0.className = "team_teamInfosSquare";
    teamInfos.appendChild(teamTown0);
    let teamTown1 = document.createElement("div");
    teamTown1.innerText =gameData.teams[team].town;
    teamTown1.className = "team_teamInfosSquare";
    teamInfos.appendChild(teamTown1);
    //stadium
    let teamStadium0 = document.createElement("div");
    teamStadium0.innerText = "Stadium (attendance):";
    teamStadium0.className = "team_teamInfosSquare";
    teamInfos.appendChild(teamStadium0);
    let teamStadium1 = document.createElement("div");
    teamStadium1.innerText = gameData.teams[team].stadiumName + " (" + gameData.teams[team].stadiumAttendence + ")";
    teamStadium1.className = "team_teamInfosSquare";
    teamInfos.appendChild(teamStadium1);
    //expectations
    let expectationsDiv0 = document.createElement("div");
    expectationsDiv0.innerText = "Expectations:";
    expectationsDiv0.className = "team_teamInfosSquare";
    teamInfos.appendChild(expectationsDiv0);
    let expectationsDiv1 = document.createElement("div");
    let expectations;
    if(gameData.teams[team].power < 0.5){
        expectations = "Tank Mode";
    }
    else if(gameData.teams[team].power < 0.8){
        expectations = "None";
    }
    else if(gameData.teams[team].power < 1){
        expectations= "Be competitive";
    }
    else if (gameData.teams[team].power < 1.10){
        expectations = "Playoff Team";
    }
    else if(gameData.teams[team].power < 1.25){
        expectations = "Dark horse"
    }
    else{
        expectations = "Contender";
    }
    expectationsDiv1.innerText = expectations;
    expectationsDiv1.className = "team_teamInfosSquare";
    teamInfos.appendChild(expectationsDiv1);
    //Rivals
    let rivals0 = document.createElement("div");
    rivals0.innerText = "Rivals:";
    rivals0.className = "team_teamInfosSquare";
    teamInfos.appendChild(rivals0);
    let rivals1 = document.createElement("div");
    for(let i = 0; i < gameData.teams[team].rivalries.length; i++){
        if(gameData.teams[team].rivalries[i].rivalType != "Original6" && gameData.teams[team].rivalries[i].rivalType != ""){
            let rival = document.createElement("div");
            rival.innerText = `${gameData.teams[gameData.teams[team].rivalries[i].teamId].name} `;
            rivals1.appendChild(rival);
            let rivalLogo = document.createElement("img");
            rivalLogo.src = ".." + gameData.teams[gameData.teams[team].rivalries[i].teamId].logo + ".png";
            rivalLogo.style.height = "18px";
            rival.appendChild(rivalLogo);
        }
    }
    if(rivals1.childNodes.length == 0){
        rivals1.innerText = "None";
    }
    rivals1.className = "team_teamInfosSquare";
    teamInfos.appendChild(rivals1);

    //Number of cups
    let numberOfCups0 = document.createElement("div");
    numberOfCups0.innerText = "Number of Cups:";
    numberOfCups0.className = "team_teamInfosSquare";
    teamInfos.appendChild(numberOfCups0);
    let numberOfCups1 = document.createElement("div");
    let numberOfCups_number = -1;
    for(let i = 0; i < gameData.records.postSeason.titles.mostTitles.teams.length; i++){
        if(gameData.records.postSeason.titles.mostTitles.teams[i].teamId == team){
            numberOfCups_number = gameData.records.postSeason.titles.mostTitles.teams[i].record;
        }
    }
    if(numberOfCups_number == -1){
        numberOfCups1.innerText = `None`;
    }
    else{
        numberOfCups1.innerText = numberOfCups_number;
    }
    numberOfCups1.className = "team_teamInfosSquare";
    teamInfos.appendChild(numberOfCups1);

    //Last Win (play-off drought)
    let lastWin0 = document.createElement("div");
    lastWin0.innerText = "Last Win:";
    lastWin0.className = "team_teamInfosSquare";
    teamInfos.appendChild(lastWin0);
    let lastWin1 = document.createElement("div");
    let lastSeason = -1;
    for(let i = 0; i < gameData.records.postSeason.titles.mostTitles.teams.length; i++){
        if(gameData.records.postSeason.titles.mostTitles.teams[i].teamId == team){
            lastSeason = gameData.records.postSeason.titles.mostTitles.teams[i].seasonsId[gameData.records.postSeason.titles.mostTitles.teams[i].seasonsId.length - 1];
        }
    }
    if(lastSeason == -1){
        lastWin1.innerText = `None (${gameData.seasons.length - 1 - gameData.teams[team].date})`;
    }
    else{
        console.log(lastSeason)
        lastWin1.innerText = `${gameData.seasons[lastSeason].date} (${gameData.seasons.length - 1 - lastSeason})`;
    }
    lastWin1.className = "team_teamInfosSquare";
    teamInfos.appendChild(lastWin1);


//other Info (records, previous standings, previous matches)
let otherInfoFlex = document.createElement("div");
otherInfoFlex.className = "team_otherInfoFlex";
document.body.appendChild(otherInfoFlex);
    //previous years (standings + playoffs)
    let previousYearsContainer = document.createElement("div");
    previousYearsContainer.className = "team_previousYearsContainer";
    otherInfoFlex.appendChild(previousYearsContainer);

    let previousYears = document.createElement("grid");
    previousYears.className = "team_previousYears";
    previousYearsContainer.appendChild(previousYears);
    for(let i = gameData.seasons.length; i >= gameData.teams[team].date; i--){
        if(i == gameData.seasons.length){
            let year = document.createElement("div");
            year.className = "team_previousYearsSquare";
            year.innerText = `Year`;
            previousYears.appendChild(year);
            let regularSeason = document.createElement("div");
            regularSeason.className = "team_previousYearsSquare";
            regularSeason.innerText = `Regular Season`;
            previousYears.appendChild(regularSeason);
            let playoff = document.createElement("div");
            playoff.className = "team_previousYearsSquare";
            playoff.innerText = `Playoffs`;
            previousYears.appendChild(playoff);
        }
        else{
            let year = document.createElement("div");
            year.className = "team_previousYearsSquare";
            year.innerText = `${gameData.seasons[i].date}`;
            previousYears.appendChild(year);

            //regular season
            let regularSeason = document.createElement("div");
            regularSeason.className = "team_previousYearsSquare";
            let standingsLeague = Standings.standings(gameData, gameData.seasons[i].teams.allTeams, i, gameData.seasons[i].schedule.length - 1, "Pts");
            let teamPlaceLeague = 0;
            let teamPlaceConference = 0;
            let teamPlaceDivision = 0;
            let teamPoints = 0;
            let teamChoiceScope = "league";
            for(let j = 0; j < standingsLeague.length; j++){
                if(standingsLeague[j].id == team){
                    teamPlaceLeague = j + 1;
                    teamPoints = standingsLeague[j].points();
                }
            }
            if(gameData.seasons[i].teams.conference.length > 1){
                for(let j = 0; j < gameData.seasons[i].teams.conference.length; j++){
                    let standingsConference = Standings.standings(gameData, gameData.seasons[i].teams.conference[j].teamsInConference, i, gameData.seasons[i].schedule.length - 1, "Pts");
                    for(let k = 0; k < standingsConference.length; k++){
                        if(standingsConference[k].id == team){
                            teamPlaceConference = k + 1;
                        }
                    }
                }
                teamChoiceScope = "conference";
            }
            if(gameData.seasons[i].teams.conference[0].divisions.length > 1){
                for(let j = 0; j < gameData.seasons[i].teams.conference.length; j++){
                    for(let l = 0; l < gameData.seasons[i].teams.conference[j].divisions.length; l++){
                        let standingsDivision = Standings.standings(gameData, gameData.seasons[i].teams.conference[j].divisions[l].teams, i, gameData.seasons[i].schedule.length - 1, "Pts");
                        for(let k = 0; k < standingsDivision.length; k++){
                            if(standingsDivision[k].id == team){
                                teamPlaceDivision = k + 1;
                            }
                        }
                    }
                }
                teamChoiceScope = "division";
            }
            previousYears.appendChild(regularSeason);
            if(teamChoiceScope == "league"){
                let league = document.createElement("div");
                league.innerText = `${teamPlaceLeague}th overall`;
                regularSeason.appendChild(league);
                let points = document.createElement("div");
                points.innerText = `(${teamPoints} pts)`;
                regularSeason.appendChild(points);
            }
            else if(teamChoiceScope == "conference"){
                let league = document.createElement("div");
                league.innerText = `${teamPlaceLeague}th overall`;
                regularSeason.appendChild(league);
                let conference = document.createElement("div");
                conference.innerText = `${teamPlaceConference}th conference`;
                regularSeason.appendChild(conference);
                let points = document.createElement("div");
                points.innerText = `(${teamPoints} pts)`;
                regularSeason.appendChild(points);
            }
            else{
                let league = document.createElement("div");
                league.innerText = `${teamPlaceLeague}th overall`;
                regularSeason.appendChild(league);
                let conference = document.createElement("div");
                conference.innerText = `${teamPlaceConference}th conference`;
                regularSeason.appendChild(conference);
                let division = document.createElement("div");
                division.innerText = `${teamPlaceDivision}th division`;
                regularSeason.appendChild(division);
                let points = document.createElement("div");
                points.innerText = `(${teamPoints} pts)`;
                regularSeason.appendChild(points);
                regularSeason.innerText = `${teamPlaceLeague}th overall, ${teamPlaceConference}th conference, ${teamPlaceDivision}th division (${teamPoints} pts)`;
            }

            //playoff
            let playoff = document.createElement("div");
            playoff.className = "team_previousYearsSquare";
            previousYears.appendChild(playoff);
            let playoffText = document.createElement("div")
            playoffText.style.display = "inline-block"
            playoff.appendChild(playoffText);
            let winner = false;
            let inPlayoffs = false;
            let roundLost = 0;
            if(i < 12){
                if(teamPlaceLeague <=4){
                    inPlayoffs = true;
                    for(let j = 0; j < gameData.seasons[i].postSeasonSchedule.length; j++){
                        for(let k = 0; k < gameData.seasons[i].postSeasonSchedule[j].matchups.length; k++){
                            if(gameData.seasons[i].postSeasonSchedule[j].matchups[k].loser == team){
                                let teamInLastPlayoffMatch = document.createElement("img");
                                teamInLastPlayoffMatch.style.height = "20px"
                                teamInLastPlayoffMatch.src = ".." + gameData.teams[gameData.seasons[i].postSeasonSchedule[j].matchups[k].winner].logo + ".png"
                                playoff.appendChild(teamInLastPlayoffMatch)

                                roundLost = j + 1;
                                k = gameData.seasons[i].postSeasonSchedule[j].matchups.length;
                            }
                            else if(gameData.seasons[i].postSeasonSchedule[j].matchups[k].winner == team){
                                let teamInLastPlayoffMatch = document.createElement("img");
                                teamInLastPlayoffMatch.style.height = "20px"
                                teamInLastPlayoffMatch.src = ".." + gameData.teams[gameData.seasons[i].postSeasonSchedule[j].matchups[k].loser].logo + ".png"
                                playoff.appendChild(teamInLastPlayoffMatch)
                            }
                        }
                    }
                    if(roundLost == 0){
                        winner = true;
                    }
                    }
                if(inPlayoffs){
                    if(winner){
                        playoffText.innerText = "Winner";
                    }
                    else{
                        if(roundLost == 1){
                            playoffText.innerText = "Lost in 1st round";
                        }
                        else if(roundLost == 2){
                            playoffText.innerText = "Finalist";
                        }
                    }
                }
                else{
                    playoffText.innerText = "Did not qualify";
                }
            }
            else{
                if(gameData.seasons[i].postSeasonSchedule.seeds.length == 1){
                    if(teamChoiceScope == "conference"){
                        teamPlaceLeague = teamPlaceConference;
                    }
                    if(teamPlaceLeague <= gameData.seasons[i].postSeasonSchedule.rules.teamsQualifiedPerDivision){    //changer pour divisional playoff
                        inPlayoffs = true;
                        for(let j = 0; j < gameData.seasons[i].postSeasonSchedule.conference.length; j++){     //changer
                            for(let l = 0; l < gameData.seasons[i].postSeasonSchedule.conference[j].length; l++){
                                for(let k = 0; k < gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups.length; k++){
                                    if(gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups[k].loser == team){
                                        let teamInLastPlayoffMatch = document.createElement("img");
                                        teamInLastPlayoffMatch.style.height = "20px";
                                        teamInLastPlayoffMatch.src = ".." + gameData.teams[gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups[k].winner].logo + ".png"
                                        playoff.appendChild(teamInLastPlayoffMatch)
                                        console.log(playoff.firstChild)
                                        console.log(teamInLastPlayoffMatch.parentNode)
                                        
                                        roundLost = l + 1;
                                        k = gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups.length;
                                    }
                                    else if(gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups[k].winner == team){
                                        let teamInLastPlayoffMatch = document.createElement("img");
                                        teamInLastPlayoffMatch.style.height = "20px";
                                        teamInLastPlayoffMatch.src = ".." + gameData.teams[gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups[k].loser].logo + ".png"
                                        playoff.appendChild(teamInLastPlayoffMatch)
                                    }
                                }
                            }
                        }
                        for(let j = 0; j < gameData.seasons[i].postSeasonSchedule.finals.length; j++){
                            for(let k = 0; k < gameData.seasons[i].postSeasonSchedule.finals[j].matchups.length; k++){
                                if(gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].loser == team){
                                    let teamInLastPlayoffMatch = document.createElement("img");
                                    teamInLastPlayoffMatch.src = ".." + gameData.teams[gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].winner].logo + ".png"
                                    teamInLastPlayoffMatch.style.height = "20px";
                                    playoff.appendChild(teamInLastPlayoffMatch)
                                    roundLost = j + gameData.seasons[i].postSeasonSchedule.conference[j].length + 1;
                                    k = gameData.seasons[i].postSeasonSchedule.finals[j].matchups.length;
                                }
                                else if(gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].winner == team){
                                    let teamInLastPlayoffMatch = document.createElement("img");
                                    teamInLastPlayoffMatch.src = ".." + gameData.teams[gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].loser].logo + ".png"
                                    teamInLastPlayoffMatch.style.height = "20px";
                                    playoff.appendChild(teamInLastPlayoffMatch)
                                }
                            }
                        }
                        if(roundLost == 0){
                            winner = true;
                        }
                    }
                    let roundsOfConferenceFinal = gameData.seasons[i].postSeasonSchedule.conference[0].length;
                    if(inPlayoffs){
                        console.log("Season:" + gameData.seasons[i].date + "roundLost: " + roundLost)
                        if(winner){
                            playoffText.innerText = "Winner";
                        }
                        else{
                            if(roundLost < roundsOfConferenceFinal){
                               playoffText.innerText = `Lost in ${roundLost}st round`;
                            }
                            else if(roundLost == roundsOfConferenceFinal){
                                if(gameData.seasons[i].teams.conference.length > 1){
                                    playoffText.innerText = "Conference Final"
                                }
                                else{
                                    playoff.innerText = `Lost in ${roundLost}st round`;
                                    playoffText.innerText = `Lost in ${roundLost}st round`;
                                }
                            }
                            else if(roundLost > roundsOfConferenceFinal){
                                playoffText.innerText = "Finalist";
                            }
                        }
                    }
                    else{
                        playoffText.innerText = "Did not qualify";
                    }
                }
                
            }

            if(i % 2 == 1){
                year.style.backgroundColor = "lightgray";
                regularSeason.style.backgroundColor = "lightgray";
                playoff.style.backgroundColor = "lightgray";
            }
        }
    }
    
    //previous matches (last 5, last 5 against particular team + next 5)
    let matchesContainers = document.createElement("div");
    matchesContainers.className = "team_matchesContainers";
    otherInfoFlex.appendChild(matchesContainers);

    let lastFiveMatchesTitle = document.createElement("div");
    lastFiveMatchesTitle.innerText = "Last 5 matches played";
    lastFiveMatchesTitle.style.textAlign = "center"
    matchesContainers.appendChild(lastFiveMatchesTitle)

    let lastFiveMatchesContainer = document.createElement("div");
    matchesContainers.appendChild(lastFiveMatchesContainer);

    let previousMatchesNodes = lastFiveMatches(-1);
    printLastMatches(previousMatchesNodes, lastFiveMatchesContainer);

        //change team last 5 matches
        let selectTeam = document.createElement("select");
        let allTeamsOption = document.createElement("option");
        allTeamsOption.innerText = "All teams";
        allTeamsOption.value = -1;
        selectTeam.appendChild(allTeamsOption)
        for(let i = 0; i < gameData.teams.length; i++){
            if(i != team){
                let optionTeam = document.createElement("option");
                optionTeam.innerText = gameData.teams[i].name;
                optionTeam.value = i;
                selectTeam.appendChild(optionTeam)
            }
        }
        matchesContainers.appendChild(selectTeam)
        let selectTeamButton = document.createElement("button");
        selectTeamButton.innerText = "Select Team";
        selectTeamButton.addEventListener("click", () => {
            lastFiveMatchesContainer.innerHTML = "";
            previousMatchesNodes = lastFiveMatches(selectTeam.value)
            printLastMatches(previousMatchesNodes, lastFiveMatchesContainer)
        });
        matchesContainers.appendChild(selectTeamButton)

    let nextFiveMatchesTitle = document.createElement("div");
    nextFiveMatchesTitle.innerText = "Next matches played";
    nextFiveMatchesTitle.style.textAlign = "center"
    matchesContainers.appendChild(nextFiveMatchesTitle)

    let nextFiveMatchesContainer = document.createElement("div");
    nextFiveMatchesContainer.className = "team_nextFiveMatches"
    matchesContainers.appendChild(nextFiveMatchesContainer);

    let nextMatchesNodes = nextFiveMatches(-1);
    printNextMatches(nextMatchesNodes, nextFiveMatchesContainer);
    
        //change team last 5 matches
        let selectTeamNext = document.createElement("select");
        let allTeamsOptionNext = document.createElement("option");
        allTeamsOptionNext.innerText = "All teams";
        allTeamsOptionNext.value = -1;
        selectTeamNext.appendChild(allTeamsOptionNext)
        for(let i = 0; i < gameData.teams.length; i++){
            if(i != team){
                let optionTeam = document.createElement("option");
                optionTeam.innerText = gameData.teams[i].name;
                optionTeam.value = i;
                selectTeamNext.appendChild(optionTeam)
            }
        }
        matchesContainers.appendChild(selectTeamNext)
        let selectTeamButtonNext = document.createElement("button");
        selectTeamButtonNext.innerText = "Select Team";
        selectTeamButtonNext.addEventListener("click", () => {
            nextFiveMatchesContainer.innerHTML = "";
            nextMatchesNodes = nextFiveMatches(selectTeamNext.value)
            printNextMatches(nextMatchesNodes, nextFiveMatchesContainer)
        });
        matchesContainers.appendChild(selectTeamButtonNext)


    //previous draft
    let previousDrafts = document.createElement("div");
    previousDrafts.className = "team_drafts";
    otherInfoFlex.appendChild(previousDrafts);

    let draftInfo = document.createElement("div");
    draftInfo.className = "team_draftInfo"
    previousDrafts.appendChild(draftInfo)
    
    let season = gameData.seasons.length - 1;
    previousDraft(team, season, draftInfo);
    
    let previousSeason = document.createElement("button");
    previousSeason.innerText = "Previous Season";
    previousDrafts.appendChild(previousSeason);
    previousSeason.addEventListener("click", () => {
        season--;
        if(season < 19 || season < gameData.teams[team].date){
            season++;
        }
        previousDraft(team, season, draftInfo)
    });

    let nextSeason = document.createElement("button");
    nextSeason.innerText = "Next Season";
    previousDrafts.appendChild(nextSeason);
    nextSeason.addEventListener("click", () => {
        season++;
        if(season > gameData.seasons.length - 1){
            season--;
        }
        previousDraft(team, season, draftInfo);
    })

    //prospect pool
    let prospectPoolContainer = document.createElement("div");
    prospectPoolContainer.className = "team_prospectPoolContainer";
    otherInfoFlex.appendChild(prospectPoolContainer);

    prospectPool(team, prospectPoolContainer)

    


function lastFiveMatches(teamId){
    let matchesNodes = [];
    let currentSeason = gameData.seasons.length - 1;
    for(let i = currentSeason; i > 0; i--){
        if(i > 12){
            //finals
            for(let j = gameData.seasons[i].postSeasonSchedule.finals.length - 1; j >= 0; j--){
                for(let k = gameData.seasons[i].postSeasonSchedule.finals[j].matchups.length - 1; k >= 0; k--){
                    for(let l = gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games.length - 1; l >= 0; l--){
                        if(teamId == -1){
                            if(gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team || gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team){
                                if(gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals != ""){
                                    matchesNodes.push(gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                }
                            }
                        }
                        else{
                            if((gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team && gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == teamId) || (gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == teamId && gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team)){
                                if(gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals != ""){
                                    matchesNodes.push(gameData.seasons[i].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                }
                            }
                        }
                    }
                }
            }
            //rest of post-season
            for(let j = gameData.seasons[i].postSeasonSchedule.conference.length - 1; j >= 0; j--){
                for(let k = gameData.seasons[i].postSeasonSchedule.conference[j].length - 1; k >= 0; k--){
                    for(let l = gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups.length - 1; l >= 0; l--){
                        for(let m = gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games.length - 1; m >= 0; m--){
                            if(teamId == -1){
                                if(gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team || gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team){
                                    if(gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals != ""){
                                        matchesNodes.push(gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                    }
                                }
                            }
                            else{
                                if((gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team && gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == teamId) || (gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == teamId && gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team)){
                                    if(gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals != ""){
                                        matchesNodes.push(gameData.seasons[i].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //regularSeason
        let currentRound = gameData.seasons[i].schedule.length - 1; 
        for(let j = currentRound; j >= 0; j--){
            //if(gameData.seasons[i].schedule[j].completed == "yes"){
                for(let k = 0; k < gameData.seasons[i].schedule[j].games.length; k++){
                    if(teamId == -1){
                        if(gameData.seasons[i].schedule[j].games[k].team1Id == team || gameData.seasons[i].schedule[j].games[k].team2Id == team){
                            if(gameData.seasons[i].schedule[j].games[k].team1Goals != ""){
                                matchesNodes.push(gameData.seasons[i].schedule[j].games[k]);
                            }
                        }
                    }
                    else{
                        if((gameData.seasons[i].schedule[j].games[k].team1Id == team && gameData.seasons[i].schedule[j].games[k].team2Id == teamId) || (gameData.seasons[i].schedule[j].games[k].team1Id == teamId && gameData.seasons[i].schedule[j].games[k].team2Id == team)){
                            if(gameData.seasons[i].schedule[j].games[k].team1Goals != ""){
                                matchesNodes.push(gameData.seasons[i].schedule[j].games[k]);
                            }
                        }
                    }
                }
            //}
        }
    }
    return matchesNodes;
}

function nextFiveMatches(teamId){
    let matchesNodes = [];
    let currentSeason = gameData.seasons.length - 1;
    //for(let i = currentSeason; i > 0; i--){
        //regularSeason
        let maxRound = gameData.seasons[currentSeason].schedule.length - 1; 
        for(let j = 0; j <= maxRound; j++){
            //if(gameData.seasons[i].schedule[j].completed == "yes"){
                for(let k = 0; k < gameData.seasons[currentSeason].schedule[j].games.length; k++){
                    if(teamId == -1){
                        if(gameData.seasons[currentSeason].schedule[j].games[k].team1Id == team || gameData.seasons[currentSeason].schedule[j].games[k].team2Id == team){
                            if(gameData.seasons[currentSeason].schedule[j].games[k].team1Goals == ""){
                                matchesNodes.push(gameData.seasons[currentSeason].schedule[j].games[k]);
                            }
                        }
                    }
                    else{
                        if((gameData.seasons[currentSeason].schedule[j].games[k].team1Id == team && gameData.seasons[currentSeason].schedule[j].games[k].team2Id == teamId) || (gameData.seasons[currentSeason].schedule[j].games[k].team1Id == teamId && gameData.seasons[currentSeason].schedule[j].games[k].team2Id == team)){
                            if(gameData.seasons[currentSeason].schedule[j].games[k].team1Goals == ""){
                                matchesNodes.push(gameData.seasons[currentSeason].schedule[j].games[k]);
                            }
                        }
                    }
                }
            //}
        }
        //post-season
        //if(i > 12){
            //finals
            //rest of post-season
            for(let j = gameData.seasons[currentSeason].postSeasonSchedule.conference.length - 1; j >= 0; j--){
                for(let k = gameData.seasons[currentSeason].postSeasonSchedule.conference[j].length - 1; k >= 0; k--){
                    for(let l = gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups.length - 1; l >= 0; l--){
                        for(let m = gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games.length - 1; m >= 0; m--){
                            if(teamId == -1){
                                if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team || gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team){
                                    if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals == ""){
                                        matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                    }
                                }
                            }
                            else{
                                if((gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team && gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == teamId) || (gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == teamId && gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team)){
                                    if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals == ""){
                                        matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for(let j = gameData.seasons[currentSeason].postSeasonSchedule.finals.length - 1; j >= 0; j--){
                for(let k = gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups.length - 1; k >= 0; k--){
                    for(let l = gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games.length - 1; l >= 0; l--){
                        if(teamId == -1){
                            if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team || gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team){
                                if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals == ""){
                                    matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                }
                            }
                        }
                        else{
                            if((gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team && gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == teamId) || (gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == teamId && gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team)){
                                if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals == ""){
                                    matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                }
                            }
                        }
                    }
                }
            }
        //}
    //}
    return matchesNodes;
}

function printLastMatches(matchesNodes, container){
    numberOfGames = 4
    if(matchesNodes.length < 5){
        numberOfGames = matchesNodes.length - 1
    }
    for(let j = numberOfGames; j >= 0; j--){
        let previousMatchesContainers = document.createElement("grid");
        previousMatchesContainers.className = "team_previousMatchesContainers";
        container.appendChild(previousMatchesContainers);

        let logo1 = document.createElement("img");
        logo1.src = ".." + gameData.teams[matchesNodes[j].team1Id].logo + ".png";
        logo1.style.height = "20px";
        logo1.className = "team_previousMatchesContainersSquare";
        previousMatchesContainers.appendChild(logo1);
        
        let name1 = document.createElement("div");
        name1.innerText = gameData.teams[matchesNodes[j].team1Id].shortName;
        name1.className = "team_previousMatchesContainersSquare";
        previousMatchesContainers.appendChild(name1);
        
        let goals1 = document.createElement("div");
        goals1.innerText = matchesNodes[j].team1Goals;
        goals1.className = "team_previousMatchesContainersSquare";
        previousMatchesContainers.appendChild(goals1);
        
        let vs = document.createElement("div");
        vs.innerText = "VS";
        vs.className = "team_previousMatchesContainersSquare";
        previousMatchesContainers.appendChild(vs);
        
        let goals2 = document.createElement("div");
        goals2.innerText = matchesNodes[j].team2Goals;
        goals2.className = "team_previousMatchesContainersSquare";
        previousMatchesContainers.appendChild(goals2);
        
        let name2 = document.createElement("div");
        name2.innerText = gameData.teams[matchesNodes[j].team2Id].shortName;
        name2.className = "team_previousMatchesContainersSquare";
        previousMatchesContainers.appendChild(name2);
        
        let logo2 = document.createElement("img");
        logo2.src = ".." + gameData.teams[matchesNodes[j].team2Id].logo + ".png";
        logo2.className = "team_previousMatchesContainersSquare";
        logo2.style.height = "20px";
        previousMatchesContainers.appendChild(logo2);


        if(j % 2 == 1){
            /* logo1.style.backgroundColor = "lightgray";
            name1.style.backgroundColor = "lightgray";
            goals1.style.backgroundColor = "lightgray";
            vs.style.backgroundColor = "lightgray";
            goals2.style.backgroundColor = "lightgray";
            name2.style.backgroundColor = "lightgray";
            logo2.style.backgroundColor = "lightgray"; */
            previousMatchesContainers.style.backgroundColor = "lightgray"
        }
    }
}

function printNextMatches(matchesNodes, container){
    for(let j = 0; j < matchesNodes.length; j++){
        if(matchesNodes[j]){
            let previousMatchesContainers = document.createElement("grid");
            previousMatchesContainers.className = "team_previousMatchesContainers";
            container.appendChild(previousMatchesContainers);
    
            let logo1 = document.createElement("img");
            logo1.src = ".." + gameData.teams[matchesNodes[j].team1Id].logo + ".png";
            logo1.style.height = "20px";
            logo1.className = "team_previousMatchesContainersSquare";
            previousMatchesContainers.appendChild(logo1);
            
            let name1 = document.createElement("div");
            name1.innerText = gameData.teams[matchesNodes[j].team1Id].shortName;
            name1.className = "team_previousMatchesContainersSquare";
            previousMatchesContainers.appendChild(name1);
            
            let goals1 = document.createElement("div");
            goals1.innerText = matchesNodes[j].team1Goals;
            goals1.className = "team_previousMatchesContainersSquare";
            previousMatchesContainers.appendChild(goals1);
            
            let vs = document.createElement("div");
            vs.innerText = "VS";
            vs.className = "team_previousMatchesContainersSquare";
            previousMatchesContainers.appendChild(vs);
            
            let goals2 = document.createElement("div");
            goals2.innerText = matchesNodes[j].team2Goals;
            goals2.className = "team_previousMatchesContainersSquare";
            previousMatchesContainers.appendChild(goals2);
            
            let name2 = document.createElement("div");
            name2.innerText = gameData.teams[matchesNodes[j].team2Id].shortName;
            name2.className = "team_previousMatchesContainersSquare";
            previousMatchesContainers.appendChild(name2);
            
            let logo2 = document.createElement("img");
            logo2.src = ".." + gameData.teams[matchesNodes[j].team2Id].logo + ".png";
            logo2.className = "team_previousMatchesContainersSquare";
            logo2.style.height = "20px";
            previousMatchesContainers.appendChild(logo2);
    
    
            if(j % 2 == 1){
                /* logo1.style.backgroundColor = "lightgray";
                name1.style.backgroundColor = "lightgray";
                goals1.style.backgroundColor = "lightgray";
                vs.style.backgroundColor = "lightgray";
                goals2.style.backgroundColor = "lightgray";
                name2.style.backgroundColor = "lightgray";
                logo2.style.backgroundColor = "lightgray"; */
                previousMatchesContainers.style.backgroundColor = "lightgray"
            }
        }
    }
}

function previousDraft(team, season, container){
    container.innerHTML = "";

    let previousDraftTitle = document.createElement("div");
    previousDraftTitle.className = "team_teamTitle";
    previousDraftTitle.innerText = `${gameData.teams[team].name}' ${gameData.seasons[season].endDate} draft`;
    container.appendChild(previousDraftTitle)

    let draftClass = document.createElement("div");
    draftClass.className = "team_draftClass";
    container.appendChild(draftClass);

    let background = true;
    for(let i = -1; i < gameData.seasons[season].draft.picks.length; i++){
        if(i == -1){
            let draftRound = document.createElement("div");
            draftRound.className = "team_draftedPlayer";
            draftRound.innerText = "Round";
            draftClass.appendChild(draftRound);

            let draftOverallPick = document.createElement("div");
            draftOverallPick.className = "team_draftedPlayer";
            draftOverallPick.innerText = "Pick";
            draftClass.appendChild(draftOverallPick);

            let draftPlayer = document.createElement("div");
            draftPlayer.className = "team_draftedPlayer";
            draftPlayer.innerText = "Player Name";
            draftClass.appendChild(draftPlayer);

            let draftPotential = document.createElement("div");
            draftPotential.className = "team_draftedPlayer";
            draftPotential.innerText = "Pot";
            draftClass.appendChild(draftPotential);
        }
        else{
            if(gameData.seasons[season].draft.picks[i].team == team){
                let draftRound = document.createElement("div");
                draftRound.className = "team_draftedPlayer";
                draftRound.innerText = `${Math.ceil((i + 1) / gameData.seasons[season].teams.allTeams.length)}`;
                draftClass.appendChild(draftRound);

                let draftOverallPick = document.createElement("div");
                draftOverallPick.className = "team_draftedPlayer";
                draftOverallPick.innerText = `#${i + 1}`;
                draftClass.appendChild(draftOverallPick);

                let draftPlayer = document.createElement("div");
                draftPlayer.className = "team_draftedPlayer";
                draftPlayer.innerText = gameData.seasons[season].draft.picks[i].player;
                draftClass.appendChild(draftPlayer);

                let draftPotential = document.createElement("div");
                draftPotential.className = "team_draftedPlayer";
                draftPotential.innerText = gameData.seasons[season].draft.picks[i].potential;
                draftClass.appendChild(draftPotential);

                if(background == true){
                    draftRound.style.backgroundColor = "lightgray";
                    draftOverallPick.style.backgroundColor = "lightgray";
                    draftPlayer.style.backgroundColor = "lightgray";
                    draftPotential.style.backgroundColor = "lightgray";
                    background = false;
                }
                else{
                    background = true;
                }
            }
            
        }
    }
    if(gameData.seasons[season].draft.picks.length == 0){
        let noDraft = document.createElement("div");
        noDraft.innerText = "The draft hasn't happenned yet";
        noDraft.className = "team_noDraft";
        container.appendChild(noDraft);
    }
}

function prospectPool(team, container){
    let prospectPoolName = document.createElement("div");
    prospectPoolName.innerText = "Prospect Pool";
    prospectPoolName.className = "team_teamTitle";
    container.appendChild(prospectPoolName);

    let prospectPoolGrid = document.createElement("div");
    prospectPoolGrid.className = "team_prospectPoolGrid";
    container.appendChild(prospectPoolGrid);

    for(let i = -1; i < 5; i++){
        if(i == -1){
            let prospectYear = document.createElement("div");
            prospectYear.innerText = "Year";
            prospectYear.className = "team_prospectPoolElement"
            prospectPoolGrid.appendChild(prospectYear);

            let prospectStrength = document.createElement("div");
            prospectStrength.innerText = "Strength of Prospect Class";
            prospectStrength.className = "team_prospectPoolElement"
            prospectPoolGrid.appendChild(prospectStrength);
        }
        else{
            let prospectYear = document.createElement("div");
            prospectYear.innerText = gameData.seasons[season].endDate + i;
            prospectYear.className = "team_prospectPoolElement"
            prospectPoolGrid.appendChild(prospectYear);

            let prospectStrength = document.createElement("div");
            prospectStrength.className = "team_prospectPoolElement"
            prospectPoolGrid.appendChild(prospectStrength);

            if(gameData.teams[team].projectedPowerNextSeasons[i] < 100){
                prospectStrength.innerText = "Abysmal";
            }
            else if(gameData.teams[team].projectedPowerNextSeasons[i] < 250){
                prospectStrength.innerText = "Bad";
            }
            else if(gameData.teams[team].projectedPowerNextSeasons[i] < 400){
                prospectStrength.innerText = "Medium";
            }
            else if(gameData.teams[team].projectedPowerNextSeasons[i] < 600){
                prospectStrength.innerText = "Good";
            }
            else if(gameData.teams[team].projectedPowerNextSeasons[i] < 800){
                prospectStrength.innerText = "Great";
            }
            else{
                prospectStrength.innerText = "Amazing";
            }

            if(i % 2 == 0){
                prospectStrength.style.backgroundColor = "lightgray";
                prospectYear.style.backgroundColor = "lightgray";
            }
        }
    }
}
    
