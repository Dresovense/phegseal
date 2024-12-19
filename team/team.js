let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let team = sessionStorage.getItem("team");
const Standings = require("../functions/standings.js");

let container = document.createElement("div");
document.body.appendChild(container)

printTeam(team, container);

function printTeam(team, container){
    container.innerHTML = "";

    //team Name
    let teamName = document.createElement("h1");
    teamName.innerText = gameData.teams[team].name;
    teamName.className = "team_teamName";
    container.appendChild(teamName);
    //logo
    let teamLogo = document.createElement("img");
    teamLogo.src = ".." + gameData.teams[team].logo + ".png";
    teamLogo.className = "team_teamLogo";
    container.appendChild(teamLogo);
    
    //teamInfoGrid
        //teamInfos Grid
        let teamInfos = document.createElement("grid");
        teamInfos.className = "team_teamInfos";
        container.appendChild(teamInfos);
        //date
        let teamDate0 = document.createElement("div");
        teamDate0.innerText = "First Season:";
        teamDate0.className = "team_teamInfosSquare";
        teamInfos.appendChild(teamDate0);
        let teamDate1 = document.createElement("div");
        if(gameData.teams[team].date >= gameData.seasons.length){
            teamDate1.innerText = "None";
        }
        else{
            teamDate1.innerText = `${gameData.seasons[gameData.teams[team].date].date} (${gameData.seasons.length - gameData.teams[team].date})`;
        }
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
        if(gameData.teams[team].power + gameData.teams[team].tradePower < 0.5){
            expectations = "Tanking";
        }
        else if(gameData.teams[team].power + gameData.teams[team].tradePower < 0.8){
            expectations = "None";
        }
        else if(gameData.teams[team].power + gameData.teams[team].tradePower < 1){
            expectations= "Be competitive";
        }
        else if (gameData.teams[team].power + gameData.teams[team].tradePower < 1.10){
            expectations = "Playoff Team";
        }
        else if(gameData.teams[team].power + gameData.teams[team].tradePower < 1.25){
            expectations = "Dark horse"
        }
        else if(gameData.teams[team].power + gameData.teams[team].tradePower < 1.6){
            expectations = "Contender"
        }
        else if(gameData.teams[team].power + gameData.teams[team].tradePower < 2){
            expectations = "Favourite"
        }
        else{
            expectations = "Broken";
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
            lastWin1.innerText = `${gameData.seasons[lastSeason].date} (${gameData.seasons.length - 1 - lastSeason})`;
        }
        lastWin1.className = "team_teamInfosSquare";
        teamInfos.appendChild(lastWin1);
    
    
    //other Info (records, previous standings, previous matches)
    let otherInfoFlex = document.createElement("div");
    otherInfoFlex.className = "team_otherInfoFlex";
    container.appendChild(otherInfoFlex);
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
                let teamPointsPct = 0;
                let teamChoiceScope = "league";
                for(let j = 0; j < standingsLeague.length; j++){
                    if(standingsLeague[j].id == team){
                        teamPlaceLeague = j + 1;
                        teamPoints = standingsLeague[j].points();
                        teamPointsPct = (standingsLeague[j].points() / (standingsLeague[j].gamesPlayed() * 3)).toFixed(3)
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
                    league.innerText = `${teamPlaceLeague}th overall (${gameData.seasons[i].teams.allTeams.length})`;
                    regularSeason.appendChild(league);
                    let points = document.createElement("div");
                    points.innerText = `(${teamPoints} pts / ${teamPointsPct} pts%)`;
                    regularSeason.appendChild(points);
                }
                else if(teamChoiceScope == "conference"){
                    let league = document.createElement("div");
                    league.innerText = `${teamPlaceLeague}th overall (${gameData.seasons[i].teams.allTeams.length})`;
                    regularSeason.appendChild(league);
                    let conference = document.createElement("div");
                    conference.innerText = `${teamPlaceConference}th conference (${gameData.seasons[i].teams.conference[0].teamsInConference.length})`;
                    regularSeason.appendChild(conference);
                    let points = document.createElement("div");
                    points.innerText = `(${teamPoints} pts / ${teamPointsPct} pts%)`;
                    regularSeason.appendChild(points);
                }
                else{
                    let league = document.createElement("div");
                    league.innerText = `${teamPlaceLeague}th overall (${gameData.seasons[i].teams.allTeams.length})`;
                    regularSeason.appendChild(league);
                    let conference = document.createElement("div");
                    conference.innerText = `${teamPlaceConference}th conference (${gameData.seasons[i].teams.conference[0].teamsInConference.length})`;
                    regularSeason.appendChild(conference);
                    let division = document.createElement("div");
                    division.innerText = `${teamPlaceDivision}th division (${gameData.seasons[i].teams.conference[0].divisions[0].teams.length})`;
                    regularSeason.appendChild(division);
                    let points = document.createElement("div");
                    points.innerText = `(${teamPoints} pts / ${teamPointsPct} pts%)`;
                    regularSeason.appendChild(points);
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
                else if (i < 78){
                    if(gameData.seasons[i].postSeasonSchedule.seeds.length == 1){
                        if(teamChoiceScope == "conference"){
                            teamPlaceLeague = teamPlaceConference;
                        }
                        if(teamChoiceScope == "division"){
                            teamPlaceLeague = teamPlaceDivision;
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
                else if (i < gameData.seasons.length - 1){
                    if(teamChoiceScope == "conference"){
                        teamPlaceLeague = teamPlaceConference;
                    }
                    if(teamChoiceScope == "division"){
                        teamPlaceLeague = teamPlaceDivision;
                    }
                    //if(teamPlaceLeague <= gameData.seasons[i].postSeasonSchedule.rules.teamsQualifiedPerDivision){    //changer pour divisional playoff
                    if(gameData.seasons[i].postSeasonSchedule.teamsInPlayoffs.indexOf(team) >= 0){
                        inPlayoffs = true;
                        for(let j = 0; j < gameData.seasons[i].postSeasonSchedule.conference.length; j++){     //changer
                            for(let l = 0; l < gameData.seasons[i].postSeasonSchedule.conference[j].length; l++){
                                for(let k = 0; k < gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups.length; k++){
                                    if(gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups[k].loser == team){
                                        let teamInLastPlayoffMatch = document.createElement("img");
                                        teamInLastPlayoffMatch.style.height = "20px";
                                        teamInLastPlayoffMatch.src = ".." + gameData.teams[gameData.seasons[i].postSeasonSchedule.conference[j][l].matchups[k].winner].logo + ".png"
                                        playoff.appendChild(teamInLastPlayoffMatch)
                                        
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
    
                //coloring
                if(i < 28){
                    if(i % 2 == 1){
                        year.style.backgroundColor = "lightgray"
                        regularSeason.style.backgroundColor = "lightgray"
                        playoff.style.backgroundColor = "lightgray"
                    }
                }
                else{
                    for(let j = 0; j < gameData.seasons[i].teams.allTeams.length; j++){
                            if(gameData.seasons[i].teams.allTeams[j].id == team){
                                if(gameData.seasons[i].teams.allTeams[j].power < 0.5){      //tanking
                                    year.style.backgroundColor = "hsl(0,100%,68%)"
                                    regularSeason.style.backgroundColor = "hsl(0,100%,68%)"
                                    playoff.style.backgroundColor = "hsl(0,100%,68%)"
                                }
                                else if(gameData.seasons[i].teams.allTeams[j].power < 0.8){ //none
                                    year.style.backgroundColor = "hsl(10,58%,64%)"
                                    regularSeason.style.backgroundColor = "hsl(10,58%,64%)"
                                    playoff.style.backgroundColor = "hsl(10,58%,64%)"
                                }
                                else if(gameData.seasons[i].teams.allTeams[j].power < 1){   //be competitive
                                    year.style.backgroundColor = "hsl(27,58%,64%)"
                                    regularSeason.style.backgroundColor = "hsl(27,58%,64%)"
                                    playoff.style.backgroundColor = "hsl(27,58%,64%)"
                                }
                                else if (gameData.seasons[i].teams.allTeams[j].power < 1.10){   //playoff team
                                    year.style.backgroundColor = "hsl(52,58%,64%)"
                                    regularSeason.style.backgroundColor = "hsl(52,58%,64%)"
                                    playoff.style.backgroundColor = "hsl(52,58%,64%)"
                                }
                                else if(gameData.seasons[i].teams.allTeams[j].power < 1.25){    //dark horse
                                    year.style.backgroundColor = "hsl(80,58%,64%)"
                                    regularSeason.style.backgroundColor = "hsl(80,58%,64%)"
                                    playoff.style.backgroundColor = "hsl(80,58%,64%)"
                                }
                                else if(gameData.seasons[i].teams.allTeams[j].power < 1.6){     //contender
                                    year.style.backgroundColor = "hsl(100,58%,64%)"
                                    regularSeason.style.backgroundColor = "hsl(100,58%,64%)"
                                    playoff.style.backgroundColor = "hsl(100,58%,64%)"
                                }
                                else{                                                           //favourite
                                    year.style.backgroundColor = "hsl(143,58%,64%)"
                                    regularSeason.style.backgroundColor = "hsl(143,58%,64%)"
                                    playoff.style.backgroundColor = "hsl(143,58%,64%)"
                                }
                            }
                    }
                }
            }
        }
        
        //previous matches (last 5, last 5 against particular team + next 5)
        let matchesContainers = document.createElement("div");
        matchesContainers.className = "team_matchesContainers";
        otherInfoFlex.appendChild(matchesContainers);
    
        let lastFiveMatchesTitle = document.createElement("div");
        lastFiveMatchesTitle.innerText = "Last matches played";
        lastFiveMatchesTitle.style.textAlign = "center"
        matchesContainers.appendChild(lastFiveMatchesTitle)
    
        let lastFiveMatchesContainer = document.createElement("div");
        lastFiveMatchesContainer.className = "team_lastFiveMatches";
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
        
        let season = gameData.seasons.length - 2;
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
    
        //teams's picks per year
        let teamsPicksPerYearContainer = document.createElement("div");
        teamsPicksPerYearContainer.className = "team_prospectPoolContainer";
        otherInfoFlex.appendChild(teamsPicksPerYearContainer);
    
        let picksInfo = document.createElement("div");
        picksInfo.className = "team_draftInfo"
        teamsPicksPerYearContainer.appendChild(picksInfo)
        
        let seasonPicks = 0;
        picksPerYear(team, seasonPicks, picksInfo);
        
        let previousSeasonPicks = document.createElement("button");
        previousSeasonPicks.innerText = "Previous Season";
        teamsPicksPerYearContainer.appendChild(previousSeasonPicks);
        previousSeasonPicks.addEventListener("click", () => {
            seasonPicks--;
            if(seasonPicks < 0){
                seasonPicks++;
            }
            picksPerYear(team, seasonPicks, picksInfo);
        });
    
        let nextSeasonPicks = document.createElement("button");
        nextSeasonPicks.innerText = "Next Season";
        teamsPicksPerYearContainer.appendChild(nextSeasonPicks);
        nextSeasonPicks.addEventListener("click", () => {
            seasonPicks++;
            if(seasonPicks > 2){
                seasonPicks--;
            }
            picksPerYear(team, seasonPicks, picksInfo);
        })
    
        //prospect pool
        let prospectPoolContainer = document.createElement("div");
        prospectPoolContainer.className = "team_prospectPoolContainer";
        otherInfoFlex.appendChild(prospectPoolContainer);
    
        prospectPool(team, prospectPoolContainer)
}

let previousTeam = document.createElement("button");
previousTeam.innerText = "Previous Team";
previousTeam.addEventListener("click", () => {
    if(team > 0){
        team--;
        team = String(team)
        printTeam(team, container);
    }
})
document.body.appendChild(previousTeam)


let nextTeam = document.createElement("button");
nextTeam.innerText = "Next Team";
nextTeam.addEventListener("click", () => {
    if(team < gameData.teams.length - 1){
        team++;
        team = String(team)
        printTeam(team, container)
    }
})
document.body.appendChild(nextTeam);

    

function lastFiveMatches(teamId){
    if(gameData.seasons.length != 0){
        let matchesNodes = [];
        let currentSeason = gameData.seasons.length - 1;
                //finals
                for(let j = gameData.seasons[currentSeason].postSeasonSchedule.finals.length - 1; j >= 0; j--){
                    for(let k = gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups.length - 1; k >= 0; k--){
                        for(let l = gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games.length - 1; l >= 0; l--){
                            if(teamId == -1){
                                if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team || gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team){
                                    if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals != ""){
                                        matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                        matchesNodes[matchesNodes.length - 1].round = "F";
                                    }
                                }
                            }
                            else{
                                if((gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team && gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == teamId) || (gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == teamId && gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team)){
                                    if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals != ""){
                                        matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                        matchesNodes[matchesNodes.length - 1].round = "F";
                                    }
                                }
                            }
                        }
                    }
                }
                //rest of post-season
                for(let j = gameData.seasons[currentSeason].postSeasonSchedule.conference.length - 1; j >= 0; j--){
                    for(let k = gameData.seasons[currentSeason].postSeasonSchedule.conference[j].length - 1; k >= 0; k--){
                        for(let l = gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups.length - 1; l >= 0; l--){
                            for(let m = gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games.length - 1; m >= 0; m--){
                                if(teamId == -1){
                                    if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team || gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team){
                                        if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals != ""){
                                            matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                            matchesNodes[matchesNodes.length - 1].round = `R${k+1}`;
                                        }
                                    }
                                }
                                else{
                                    if((gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team && gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == teamId) || (gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == teamId && gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team)){
                                        if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals != ""){
                                            matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                            matchesNodes[matchesNodes.length - 1].round = `R${k+1}`;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            
            //regularSeason
            let currentRound = gameData.seasons[currentSeason].schedule.length - 1; 
            for(let j = currentRound; j >= 0; j--){
                //if(gameData.seasons[i].schedule[j].completed == "yes"){
                    for(let k = 0; k < gameData.seasons[currentSeason].schedule[j].games.length; k++){
                        if(teamId == -1){
                            if(gameData.seasons[currentSeason].schedule[j].games[k].team1Id == team || gameData.seasons[currentSeason].schedule[j].games[k].team2Id == team){
                                if(gameData.seasons[currentSeason].schedule[j].games[k].team1Goals != ""){
                                    matchesNodes.push(gameData.seasons[currentSeason].schedule[j].games[k]);
                                    matchesNodes[matchesNodes.length - 1].round = j + 1;
                                }
                            }
                        }
                        else{
                            if((gameData.seasons[currentSeason].schedule[j].games[k].team1Id == team && gameData.seasons[currentSeason].schedule[j].games[k].team2Id == teamId) || (gameData.seasons[currentSeason].schedule[j].games[k].team1Id == teamId && gameData.seasons[currentSeason].schedule[j].games[k].team2Id == team)){
                                if(gameData.seasons[currentSeason].schedule[j].games[k].team1Goals != ""){
                                    matchesNodes.push(gameData.seasons[currentSeason].schedule[j].games[k]);
                                    matchesNodes[matchesNodes.length - 1].round = j + 1;
                                }
                            }
                        }
                    }
            }
            
        return matchesNodes;
    }
}

function nextFiveMatches(teamId){
    if(gameData.seasons.length != 0){
        let matchesNodes = [];
        let currentSeason = gameData.seasons.length - 1;
        //regularSeason
        let maxRound = gameData.seasons[currentSeason].schedule.length - 1; 
        for(let j = 0; j <= maxRound; j++){
                for(let k = 0; k < gameData.seasons[currentSeason].schedule[j].games.length; k++){
                    if(teamId == -1){
                        if(gameData.seasons[currentSeason].schedule[j].games[k].team1Id == team || gameData.seasons[currentSeason].schedule[j].games[k].team2Id == team){
                            if(gameData.seasons[currentSeason].schedule[j].games[k].team1Goals == ""){
                                matchesNodes.push(gameData.seasons[currentSeason].schedule[j].games[k]);
                                matchesNodes[matchesNodes.length - 1].round = j + 1;
                            }
                        }
                    }
                    else{
                        if((gameData.seasons[currentSeason].schedule[j].games[k].team1Id == team && gameData.seasons[currentSeason].schedule[j].games[k].team2Id == teamId) || (gameData.seasons[currentSeason].schedule[j].games[k].team1Id == teamId && gameData.seasons[currentSeason].schedule[j].games[k].team2Id == team)){
                            if(gameData.seasons[currentSeason].schedule[j].games[k].team1Goals == ""){
                                matchesNodes.push(gameData.seasons[currentSeason].schedule[j].games[k]);
                                matchesNodes[matchesNodes.length - 1].round = j + 1;
                            }
                        }
                    }
                }
        }
        //post-season
        //rest of post-season
        for(let j = gameData.seasons[currentSeason].postSeasonSchedule.conference.length - 1; j >= 0; j--){
            for(let k = gameData.seasons[currentSeason].postSeasonSchedule.conference[j].length - 1; k >= 0; k--){
                for(let l = gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups.length - 1; l >= 0; l--){
                    if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].completed == "no"){
                        for(let m = gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games.length - 1; m >= 0; m--){
                            if(teamId == -1){
                                if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team || gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team){
                                    if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals == ""){
                                        matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                        matchesNodes[matchesNodes.length - 1].round = `R${k+1}`;
                                    }
                                }
                            }
                            else{
                                if((gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == team && gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == teamId) || (gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Id == teamId && gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team2Id == team)){
                                    if(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m].team1Goals == ""){
                                        matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.conference[j][k].matchups[l].games[m]);
                                        matchesNodes[matchesNodes.length - 1].round = `R${k+1}`;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //finals
        for(let j = gameData.seasons[currentSeason].postSeasonSchedule.finals.length - 1; j >= 0; j--){
            for(let k = gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups.length - 1; k >= 0; k--){
                if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].completed == "no"){
                    for(let l = gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games.length - 1; l >= 0; l--){
                        if(teamId == -1){
                            if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team || gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team){
                                if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals == ""){
                                    matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                    matchesNodes[matchesNodes.length - 1].round = "F";
                                }
                            }
                        }
                        else{
                            if((gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == team && gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == teamId) || (gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Id == teamId && gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team2Id == team)){
                                if(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l].team1Goals == ""){
                                    matchesNodes.push(gameData.seasons[currentSeason].postSeasonSchedule.finals[j].matchups[k].games[l]);
                                    matchesNodes[matchesNodes.length - 1].round = "F";
                                }
                            }
                        }
                    }
                }
            }
        }
        return matchesNodes;
    }
}

function printLastMatches(matchesNodes, container){
    if(gameData.seasons.length != 0){
        for(let j = matchesNodes.length - 1; j >= 0; j--){
            let previousMatchesContainers = document.createElement("grid");
            previousMatchesContainers.className = "team_previousMatchesContainers";
            container.appendChild(previousMatchesContainers);
    
            let round = document.createElement("div");
            round.innerText = matchesNodes[j].round
            round.className = "team_previousMatchesContainersSquare";
            previousMatchesContainers.appendChild(round)
    
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
    
    
            if(matchesNodes[j].team1Id == team){
                if(Number(matchesNodes[j].team1Goals) > Number(matchesNodes[j].team2Goals)){
                    previousMatchesContainers.style.backgroundColor = "lightgreen";
                }
                else if(Number(matchesNodes[j].team1Goals) < Number(matchesNodes[j].team2Goals)){
                    previousMatchesContainers.style.backgroundColor = "red";
                }
                else if(Number(matchesNodes[j].team1Goals) == Number(matchesNodes[j].team2Goals)){
                    previousMatchesContainers.style.backgroundColor = "orange";
                }
            }
            else if(matchesNodes[j].team2Id == team){
                if(Number(matchesNodes[j].team1Goals) < Number(matchesNodes[j].team2Goals)){
                    previousMatchesContainers.style.backgroundColor = "lightgreen";
                }
                else if(Number(matchesNodes[j].team1Goals) > Number(matchesNodes[j].team2Goals)){
                    previousMatchesContainers.style.backgroundColor = "red";
                }
                else if(Number(matchesNodes[j].team1Goals) == Number(matchesNodes[j].team2Goals)){
                    previousMatchesContainers.style.backgroundColor = "orange";
                }
            }
        }
    }
}

function printNextMatches(matchesNodes, container){
    if(gameData.seasons.length != 0){
        for(let j = 0; j < matchesNodes.length; j++){
            if(matchesNodes[j]){
                let previousMatchesContainers = document.createElement("grid");
                previousMatchesContainers.className = "team_previousMatchesContainers";
                container.appendChild(previousMatchesContainers);
    
                let round = document.createElement("div");
                round.innerText = matchesNodes[j].round
                round.className = "team_previousMatchesContainersSquare";
                previousMatchesContainers.appendChild(round)
        
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
}

function previousDraft(team, season, container){
    if(gameData.seasons.length != 0){
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
                    if(gameData.seasons[season].draft.picks[i].potential > 95){
                        draftPotential.style.backgroundColor = "green"
                    }
                    else if(gameData.seasons[season].draft.picks[i].potential > 80){
                        draftPotential.style.backgroundColor = "lime"
                    }
                    else if(gameData.seasons[season].draft.picks[i].potential > 70){
                        draftPotential.style.backgroundColor = "lightgreen"
                    }
                    else if(gameData.seasons[season].draft.picks[i].potential > 60){
                        draftPotential.style.backgroundColor = "yellow"
                    }
                    else if(gameData.seasons[season].draft.picks[i].potential >= 55){
                        draftPotential.style.backgroundColor = "orange"
                    }
                    else if(gameData.seasons[season].draft.picks[i].potential < 55){
                        draftPotential.style.backgroundColor = "red"
                    }
    
                    if(background == true){
                        draftRound.style.backgroundColor = "lightgray";
                        draftOverallPick.style.backgroundColor = "lightgray";
                        draftPlayer.style.backgroundColor = "lightgray";
                        //draftPotential.style.backgroundColor = "lightgray";
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
}

function prospectPool(team, container){
    if(gameData.seasons.length != 0){
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
                prospectYear.innerText = gameData.seasons[gameData.seasons.length - 1].endDate + i;
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
}

function picksPerYear(team, season, container){
    if(gameData.seasons.length != 0){
        container.innerHTML = "";
    
        let previousDraftTitle = document.createElement("div");
        previousDraftTitle.className = "team_teamTitle";
        previousDraftTitle.innerText = `${gameData.teams[team].name}' picks for the ${gameData.seasons[gameData.seasons.length - 1].endDate + season} draft`;
        container.appendChild(previousDraftTitle);
    
        let picksPerYearContainer = document.createElement("div");
        picksPerYearContainer.className = "team_picksPerYearContainer";
        container.appendChild(picksPerYearContainer);
    
        for(let i = 0; i < 7; i++){ //round
            let roundPicksTitle = document.createElement("div");
            roundPicksTitle.innerText = `${i + 1} round:`;
            roundPicksTitle.className = "team_roundPicksTitle";
            picksPerYearContainer.appendChild(roundPicksTitle);
    
            let roundPicks = document.createElement("div");
            roundPicks.className = "team_roundPicks";
            picksPerYearContainer.appendChild(roundPicks);
    
            for(let j = 0; j < gameData.teams.length; j++){ //teams
                if(gameData.teams[j].ownerOfTeamPicks[season][i] == team){
                    let teamLogo = document.createElement("img");
                    teamLogo.className = "team_teamLogoPicks";
                    teamLogo.src = ".." + gameData.teams[j].logo + ".png"
                    picksPerYearContainer.appendChild(teamLogo);
                }
            }
            if(gameData.teams[team].ownerOfTeamPicks[season][i] != team){
                let parentheses1 = document.createElement("div");
                parentheses1.className = "team_teamParenthesis";
                parentheses1.innerText = "(";
                picksPerYearContainer.appendChild(parentheses1)
    
                let teamLogo = document.createElement("img");
                teamLogo.className = "team_teamLogoPicks";
                teamLogo.src = ".." + gameData.teams[gameData.teams[team].ownerOfTeamPicks[season][i]].logo + ".png"
                picksPerYearContainer.appendChild(teamLogo);
    
                let parentheses2 = document.createElement("div");
                parentheses2.className = "team_teamParenthesis";
                parentheses2.innerText = ")";
                picksPerYearContainer.appendChild(parentheses2)
            }
        }
    }
}
    
