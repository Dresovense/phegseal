const { match } = require('assert');
const fs = require('fs');

let gameData = JSON.parse(sessionStorage.getItem("gameData"));

let startDate = gameData.seasons[gameData.seasons.length - 1].endDate;
let endDate = parseInt(gameData.seasons[gameData.seasons.length - 1].endDate) + 1;
let seasonTitle = document.createElement("h3");
seasonTitle.innerText = startDate + "-" + endDate + " season configuration";
document.body.appendChild(seasonTitle);

//choose type of schedule: - rounds; - conferences? post-season
let numberRounds = 0;
let postSeasonRounds = 0;

/* let divRoundsChoice = document.createElement("div");
divRoundsChoice.className = "scheduleChoice";
divRoundsChoice.innerText = "Number of Rounds:";
document.body.appendChild(divRoundsChoice);
let roundsChoice = document.createElement("input");
roundsChoice.type = "number";
roundsChoice.className = "scheduleChoice";
document.body.appendChild(roundsChoice); */

let divConferencesNumber = document.createElement("div");
divConferencesNumber.className = "scheduleChoice";
divConferencesNumber.innerText = "Number of conferences:";
document.body.appendChild(divConferencesNumber);
let conferencesNumber = document.createElement("input");
conferencesNumber.type = "number";
conferencesNumber.className = "scheduleChoice";
document.body.appendChild(conferencesNumber);

let divDivisionsPerConferenceNumber = document.createElement("div");
divDivisionsPerConferenceNumber.className = "scheduleChoice";
divDivisionsPerConferenceNumber.innerText = "Number of divisions per conference:";
document.body.appendChild(divDivisionsPerConferenceNumber);
let divisionsPerConferenceNumber = document.createElement("input");
divisionsPerConferenceNumber.type = "number";
divisionsPerConferenceNumber.className = "scheduleChoice";
document.body.appendChild(divisionsPerConferenceNumber);

let divDivisionMatches = document.createElement("div");
divDivisionMatches.className = "scheduleChoice";
divDivisionMatches.innerText = "Division rounds:";
document.body.appendChild(divDivisionMatches);
let divisionMatches = document.createElement("input");
divisionMatches.type = "number";
divisionMatches.className = "scheduleChoice";
document.body.appendChild(divisionMatches);

let divConferenceMatches = document.createElement("div");
divConferenceMatches.className = "scheduleChoice";
divConferenceMatches.innerText = "Conference rounds:";
document.body.appendChild(divConferenceMatches);
let conferenceMatches = document.createElement("input");
conferenceMatches.type = "number";
conferenceMatches.className = "scheduleChoice";
document.body.appendChild(conferenceMatches);

let divInterConferenceMatches = document.createElement("div");
divInterConferenceMatches.className = "scheduleChoice";
divInterConferenceMatches.innerText = "Inter-Conference rounds:";
document.body.appendChild(divInterConferenceMatches);
let interConferenceMatches = document.createElement("input");
interConferenceMatches.type = "number";
interConferenceMatches.className = "scheduleChoice";
document.body.appendChild(interConferenceMatches);

let divPostSeasonTeamsChoice = document.createElement("div");
divPostSeasonTeamsChoice.className = "scheduleChoice";
divPostSeasonTeamsChoice.innerText = "Number of teams in Post-Season:";    //changed to number of teams in post-season
document.body.appendChild(divPostSeasonTeamsChoice);
let postSeasonTeamsChoice = document.createElement("input");
postSeasonTeamsChoice.type = "number";
postSeasonTeamsChoice.className = "scheduleChoice";
document.body.appendChild(postSeasonTeamsChoice);

let divTeamsQualifiedPerDivision = document.createElement("div");
divTeamsQualifiedPerDivision.className = "scheduleChoice";
divTeamsQualifiedPerDivision.innerText = "Number of teams qualified in each division:";
document.body.appendChild(divTeamsQualifiedPerDivision);
let teamsQualifiedPerDivision = document.createElement("input");
teamsQualifiedPerDivision.type = "number";
teamsQualifiedPerDivision.min = "0";
teamsQualifiedPerDivision.className = "scheduleChoice";
document.body.appendChild(teamsQualifiedPerDivision);

let divWildCardsPerConference = document.createElement("div");
divWildCardsPerConference.className = "scheduleChoice";
divWildCardsPerConference.innerText = "Number of wild cards qualified in each conference:";
document.body.appendChild(divWildCardsPerConference);
let wildCardsPerConference = document.createElement("input");
wildCardsPerConference.type = "number";
wildCardsPerConference.min = "0";
wildCardsPerConference.className = "scheduleChoice";
document.body.appendChild(wildCardsPerConference);

let divplayOffOrganisation = document.createElement("div");
divplayOffOrganisation.className = "scheduleChoice";
divplayOffOrganisation.innerText = "Playoff Seeding:";
document.body.appendChild(divplayOffOrganisation);
let select = document.createElement("select");
select.className = "scheduleChoice";
document.body.appendChild(select);
let divisionalPlayoff = document.createElement("option");
divisionalPlayoff.innerText = "Divisional Playoff";
divisionalPlayoff.value = "divisionalPlayoff";
divisionalPlayoff.className = "scheduleChoice";
select.appendChild(divisionalPlayoff);
let conferencePlayoff = document.createElement("option");
conferencePlayoff.innerText = "Conference Playoff";
conferencePlayoff.value = "conferencePlayoff";
conferencePlayoff.className = "scheduleChoice";
select.appendChild(conferencePlayoff);


let roundsChoiceButton = document.createElement("button");
roundsChoiceButton.className = "scheduleChoice";
roundsChoiceButton.innerText = "Confirm settings";
roundsChoiceButton.addEventListener("click", () => {
    if(conferencesNumber.value <= 0 || postSeasonTeamsChoice.value <= 0 || divisionsPerConferenceNumber.value <= 0 || divisionMatches.value < 0 || conferenceMatches < 0 || interConferenceMatches < 0){
        window.alert("Invalid number(s)");
    }
    else{
        let divsTeam = document.getElementsByClassName("teamChoice");
        conferenceColorJump = 300 / (conferencesNumber.value - 1);
        divisionColorJump = 50 / (divisionsPerConferenceNumber.value - 1);
        for(let i = 0; i < divsTeam.length; i++){
            teamList = [[]]
            divsTeam[i].style.display = "block";
            for(let i = 0; i < gameData.teams.length; i++){
                teamList[0].push(i);
            }
            for(let i = 0; i < conferencesNumber.value; i++){
                let conference = [];
                for(let j = 0; j < divisionsPerConferenceNumber.value; j++){
                    let division = [];
                    conference.push(division);
                }
                teamList.push(conference);
                console.log(teamList);
            }
            
        }
        //create divisions divs
        for(let k = 0; k < conferencesNumber.value; k++){
            let conferenceContainer = document.createElement("div");
            document.body.appendChild(conferenceContainer);
            let conferenceDiv = document.createElement("div");
            conferenceDiv.classList = "teamChoice";
            conferenceDiv.style.width = "120px";
            conferenceDiv.innerText = `Conference ${k + 1}`;
            conferenceDiv.style.backgroundColor = `hsl(${conferenceColorJump * (k)}, 100%, 50%)`;
            conferenceContainer.appendChild(conferenceDiv);
            let conferenceName = document.createElement("input");
            conferenceName.classList = "teamChoice conference";
            conferenceContainer.appendChild(conferenceName);

            for(let j = 0; j < divisionsPerConferenceNumber.value; j++){
                if(divisionsPerConferenceNumber.value > 1){
                    let divisionDiv = document.createElement("div");
                    divisionDiv.classList = "teamChoice";
                    divisionDiv.style.backgroundColor = `hsl(${conferenceColorJump * (k)}, 100%, ${30 + divisionColorJump * (j)}%)`;
                    divisionDiv.innerText = `Division ${j + 1}`;
                    divisionDiv.style.width = "100px";
                    conferenceContainer.appendChild(divisionDiv);
                    let divisionName = document.createElement ("input");
                    divisionName.classList = "teamChoice division";
                    divisionDiv.appendChild(divisionName);
                }
            }
        }
        let divsSchedule = document.getElementsByClassName("scheduleChoice");
        for(let i = 0; i < divsSchedule.length; i++){
            divsSchedule[i].style.display = "none";
        }
    }
});
document.body.appendChild(roundsChoiceButton);

//chose teams

//team List per division and conference
let teamList = [[],[[]]];
let conferenceColorJump;
let divisionColorJump;

let divTeams = document.createElement("div");
document.body.appendChild(divTeams);
divTeams.className = "teamChoice";
divTeams.style.width = "150px";
divTeams.style.display = "none";
for(let i = 0; i < gameData.teams.length; i++){
    let team = document.createElement("div");
    team.innerText = gameData.teams[i].name;
    if(teamList[0].includes(i)){
        team.style.backgroundColor = "white";
    }
    for(let k = 1; k < teamList.length; k++){
        for(let j = 0; j < teamList[1].length; j++){
            if(teamList[k][j].includes(i)){
                team.style.backgroundColor = `hsl(${conferenceColorJump * (k - 1)}, 100%, ${30 + divisionColorJump * (j - 1)}%)`;
            }
        }
    }
    team.addEventListener("click", () => {
        /* if(!teamList.includes(i)){
            teamList.push(i);
            team.style.backgroundColor = "lightblue";
        }
        else{
            const index = teamList.indexOf(i);
            if (index > -1){
                teamList.splice(index, 1);
                team.style.backgroundColor = "white";
            }
        } */
        if(teamList[0].includes(i)){
            const index = teamList[0].indexOf(i);
            if(index > -1){
                teamList[0].splice(index, 1);
            }
            teamList[1][0].push(i);
            console.log(teamList);
            team.style.backgroundColor = `hsl(0, 100%, 30%)`;
        }
        else{
            for(let k = 1; k < teamList.length; k++){
                for(let j = 0; j < teamList[1].length; j++){
                    if(teamList[k][j].includes(i)){
                        const index = teamList[k][j].indexOf(i);
                        if(index > -1){
                            teamList[k][j].splice(index, 1);
                        }
                        if(j == teamList[1].length - 1 && k == teamList.length - 1){
                            teamList[0].push(i);
                            team.style.backgroundColor = `white`;
                        }
                        else if (j == teamList[1].length - 1){
                            teamList[k + 1][0].push(i);
                            team.style.backgroundColor = `hsl(${conferenceColorJump * (k)}, 100%, 30%)`;
                        }
                        else{
                            teamList[k][j + 1].push(i);
                            team.style.backgroundColor = `hsl(${conferenceColorJump * (k - 1)}, 100%, ${30 + divisionColorJump * (j + 1)}%)`;
                        }
                        k = teamList.length;
                        j = teamList[1].length;
                    }
                }
            }
            console.log(teamList);
        }
    });
    divTeams.appendChild(team);
}

/* let selectAllButton = document.createElement("button");     //display
selectAllButton.style.display = "none";
selectAllButton.innerText = "Select All";
selectAllButton.className = "teamChoice";
selectAllButton.addEventListener("click", () => {
    teamList = [];
    let teams = document.querySelectorAll("div")
    for(let i = 0; i < gameData.teams.length; i++){
        teamList.push(i);
        teams[i + 2].style.backgroundColor = "lightblue";
    }
});
document.body.appendChild(selectAllButton); */

let confirmChoicebutton = document.createElement("button");     //display
confirmChoicebutton.style.display = "none";
confirmChoicebutton.innerText = "Confirm Choice";
confirmChoicebutton.className = "teamChoice";
confirmChoicebutton.addEventListener("click", () => {

        numberOfConferences = conferencesNumber.value;
        numberOfDivisionsPerConference = divisionsPerConferenceNumber.value;
        divisionRounds = divisionMatches.value;
        conferenceRounds = conferenceMatches.value;
        interConferenceRounds = interConferenceMatches.value;
        let divsSchedule = document.getElementsByClassName("scheduleChoice");
        for(let i = 0; i < divsSchedule.length; i++){
            divsSchedule[i].style.display = "none";     //display
        }
        createSchedule(teamList, numberOfConferences, numberOfDivisionsPerConference, divisionRounds, conferenceRounds, interConferenceRounds);   //changer endroit ou c'est fait
        gameData.seasons.push(newSeason);
        //save data + go to season
        fs.writeFile('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
            if(err){
                return console.log(err);
            }
        });
        sessionStorage.setItem("season", gameData.seasons.length - 1);
        gameData = JSON.stringify(gameData);
        sessionStorage.setItem("gameData", gameData);
        location.href = "../season/season.html";
    
});
document.body.appendChild(confirmChoicebutton);

let goBackButton = document.createElement("button");
goBackButton.style.display = "none";     //display
goBackButton.className = "teamChoice";
goBackButton.innerText = "Go Back";     //changer fonctionnement go Back
goBackButton.addEventListener("click", () =>{
    let divsSchedule = document.getElementsByClassName("scheduleChoice");
    let divsTeam = document.getElementsByClassName("teamChoice");
    for(let i = 0; i < divsSchedule.length; i++){
        divsSchedule[i].style.display = "block";     //display
    }
    for(let i = 0; i < divsTeam.length; i++){
        divsTeam[i].style.display = "none";     //display
    }
});
document.body.appendChild(goBackButton);

//print schedule
let newSeason = {
    "date": startDate + "-" + endDate,
    "endDate": endDate,
    "teams": {
        "conference": [],
        "allTeams": []
    },
    "schedule": [],
    "postSeasonSchedule": {
        "rules": {
            "postSeasonTeams": "",
            "teamsQualifiedPerDivision": "",
            "wildCardsPerConference": "",
            "playOffOrganisation": ""
        },
        "conference": [],
        "finals": [],
        "seeds": []
    },
    "records": {
        "a completer": "..."
    }
};

function createSchedule(teamList, numberOfConferences, numberOfDivisionsPerConference, divisionRounds, conferenceRounds, interConferenceRounds, postSeasonRounds){
    allTeams = [];
    for(let i = 1; i < teamList.length; i++){
        for(let j = 0; j < teamList[1].length; j++){
            for(let k = 0; k < teamList[i][j].length; k++){
                allTeams.push(teamList[i][j][k]);
            }
        }
    }
    conferenceTeams = [];
    for(let i = 1; i < teamList.length; i++){
        let conference = [];
        for(let j = 0; j < teamList[1].length; j++){
            for(let k = 0; k < teamList[i][j].length; k++){
                conference.push(teamList[i][j][k]);
            }
        }
        conferenceTeams.push(conference);
    }
    divisionTeams = [];
    for(let i = 1; i < teamList.length; i++){
        let conference = [];
        for(let j = 0; j < teamList[1].length; j++){
            let division = []
            for(let k = 0; k < teamList[i][j].length; k++){
                division.push(teamList[i][j][k]);
            }
            conference.push(division);
        }
        divisionTeams.push(conference);
    }
    
    let interConferenceSchedule = roundRobin(allTeams, interConferenceRounds);
    for(let i = 0; i < interConferenceSchedule.length; i++){
        newSeason.schedule.push(interConferenceSchedule[i]);
    }

    interConferenceSchedule = roundRobin(conferenceTeams[0], conferenceRounds - interConferenceRounds);
    for(let i = 1; i < numberOfConferences; i++){
        let conferenceSchedule = roundRobin(conferenceTeams[i], conferenceRounds - interConferenceRounds);
        for(let j = 0; j < conferenceSchedule.length; j++){
            for(let l = 0; l < conferenceSchedule[j].games.length; l++){
                interConferenceSchedule[j].games.push(conferenceSchedule[j].games[l]);
                
            }
        }
    }
    for(let i = 0; i < interConferenceSchedule.length; i++){
        newSeason.schedule.push(interConferenceSchedule[i]);
    }

    interConferenceSchedule = roundRobin(divisionTeams[0][0], divisionRounds - interConferenceRounds - (conferenceRounds - interConferenceRounds))
    for(let i = 0; i < numberOfConferences; i++){
        for(let k = 0; k < numberOfDivisionsPerConference; k++){
            if(i!=0 || k!=0){
                let divisionSchedule = roundRobin(divisionTeams[i][k], divisionRounds - interConferenceRounds - (conferenceRounds - interConferenceRounds));
                for(let j = 0; j < divisionSchedule.length; j++){
                    for(let l = 0; l < divisionSchedule[j].games.length; l++){
                        interConferenceSchedule[j].games.push(divisionSchedule[j].games[l]);
                        
                    }
                }
            }
        }
    }
    for(let i = 0; i < interConferenceSchedule.length; i++){
        newSeason.schedule.push(interConferenceSchedule[i]);
    }
    console.log(newSeason);

    newSeason.schedule = shuffleArray(newSeason.schedule);

    //post-season       A CHANGER¨!!!!!!!

    newSeason.postSeasonSchedule.rules.postSeasonTeams = postSeasonTeamsChoice.value;
    newSeason.postSeasonSchedule.rules.teamsQualifiedPerDivision = teamsQualifiedPerDivision.value;
    newSeason.postSeasonSchedule.rules.wildCardsPerConference = wildCardsPerConference.value;
    newSeason.postSeasonSchedule.rules.playOffOrganisation = select.value;

    let teamsInPlayOffPerConference = postSeasonTeamsChoice.value / conferencesNumber.value;
    let postSeasonConferenceRounds = Math.log2(teamsInPlayOffPerConference);
    for(let l = 0; l < conferencesNumber.value; l++){
        let postSeasonConferenceSchedule = [];
        for(let i = 0; i < postSeasonConferenceRounds; i++){
            let matchups = {
                "matchups": [],
                "completed": "no",
            };
            for(let j = 0; j < Math.pow(2, postSeasonConferenceRounds - 1 - i); j++){
                let games = {
                    "games": [],
                    "winner": "",
                    "loser": "",
                    "completed": "no"
                }
                for(let k = 0; k < 3; k++){
                    let matches = {
                        "team1Id": "",
                        "team2Id": "",
                        "team1Goals": "",
                        "team2Goals": "",
                        "team1GoalsAddTime": "",
                        "team2GoalsAddTime": ""
                    }
                    games.games.push(matches);
                }
                matchups.matchups.push(games);
            }
            postSeasonConferenceSchedule.push(matchups);
            if(conferencesNumber.value == 1){
                i = postSeasonConferenceRounds;
            }
        }
        newSeason.postSeasonSchedule.conference.push(postSeasonConferenceSchedule);
    }
        //mettre matchs finales
    if(conferencesNumber.value == 1){
        let matchups = {
            "matchups": [{
                "games": [{
                    "team1Id": "",
                    "team2Id": "",
                    "team1Goals": "",
                    "team2Goals": "",
                    "team1GoalsAddTime": "",
                    "team2GoalsAddTime": ""
                },{
                    "team1Id": "",
                    "team2Id": "",
                    "team1Goals": "",
                    "team2Goals": "",
                    "team1GoalsAddTime": "",
                    "team2GoalsAddTime": ""
                },{
                    "team1Id": "",
                    "team2Id": "",
                    "team1Goals": "",
                    "team2Goals": "",
                    "team1GoalsAddTime": "",
                    "team2GoalsAddTime": ""
                }],
                "winner": "",
                "loser": "",
                "completed": "no"
            }],
            "completed": "no",
        };
        newSeason.postSeasonSchedule.finals.push(matchups);
    }
    else{
        let finalsSchedule = [];
        for(let i = 0; i < conferencesNumber.value/2; i++){
            let matchups = {
                "matchups": [],
                "completed": "no",
            };
            for(let j = 0; j < Math.pow(2, (conferencesNumber.value/2) - 1 - i); j++){
                let games = {
                    "games": [],
                    "winner": "",
                    "loser": "",
                    "completed": "no"
                }
                for(let k = 0; k < 3; k++){
                    let matches = {
                        "team1Id": "",
                        "team2Id": "",
                        "team1Goals": "",
                        "team2Goals": "",
                        "team1GoalsAddTime": "",
                        "team2GoalsAddTime": ""
                    }
                    games.games.push(matches);
                }
                matchups.matchups.push(games);
            }
            finalsSchedule.push(matchups);
        }
        newSeason.postSeasonSchedule.finals = finalsSchedule;
    }
    //teams
    let conferencesName = document.getElementsByClassName("conference");
    let divisionName = document.getElementsByClassName("division");
    for(let i = 1; i < teamList.length; i++){
        if(conferencesName[i-1].value == undefined){
            conferencesName[i-1].value = "";
        }
        let conference = {
            "name": `${conferencesName[i-1].value}`,
            "divisions":[],
            "teamsInConference": []
        }
        for(let j = 0; j < teamList[1].length; j++){
            let division = {
                "name": ``,
                "teams":[]
            }
            if (divisionName.length != 0){
                if(divisionName[j].value != undefined){
                    console.log(j + (teamList.length - 1) * (i - 1))
                    division.name = divisionName[j + (teamList.length - 1) * (i - 1)].value
                }
            }
            for(let k = 0; k < teamList[i][j].length; k++){
                if(teamList[i][j][k] != -1){
                    let team = {
                        "id": `${teamList[i][j][k]}`
                    }
                    division.teams.push(team);
                    conference.teamsInConference.push(team);
                    newSeason.teams.allTeams.push(team);
                }
            }
            conference.divisions.push(division);
        }
        newSeason.teams.conference.push(conference);
    }
}

function roundRobin (teamList, numberRounds){
    //make schedule + JSON object
    let firstPartOfRound = [];
    let schedule = [];
    for(let i = 0; i < numberRounds; i++){
        if(i % 2 == 0){
            firstPartOfRound = createFirstPartOfRound(shuffleArray(teamList));
        }
        else{
            firstPartOfRound = swapHomeAway(firstPartOfRound);
        }
        for(let j = 0; j < firstPartOfRound.length; j++){
            schedule.push(firstPartOfRound[j]);
        }
    }
    return schedule;
}

function createFirstPartOfRound(teamList){
    if(teamList.length % 2 == 0){ //if number of teams is odd we add a dummy team
        let firstPartOfRound = []; //schedule
        for(let i = 0; i < teamList.length - 1; i++){
            let fixtures = {    //schedule objects
                "games": [],
                "completed": "no"
            }
            for(let j = 0; j < teamList.length / 2; j++){
                if(i % 2 == 0){ //change Home-Away every match
                    let match = {
                        "team1Id": `${teamList[j]}`,
                        "team2Id": `${teamList[teamList.length - 1 - j]}`,
                        "team1Goals": "",
                        "team2Goals": ""
                    }
                    fixtures.games.push(match);
                }
                else{
                    let match = {
                        "team1Id": `${teamList[teamList.length - 1 - j]}`,
                        "team2Id": `${teamList[j]}`,
                        "team1Goals": "",
                        "team2Goals": ""
                    }    
                    fixtures.games.push(match);
                }
                fixtures.games = shuffleArray(fixtures.games);
            }
            firstPartOfRound.push(fixtures);
            //team rotation
            let pivot = teamList[teamList.length - 1];  
            for(let j = 0; j < teamList.length - 1; j++){
                teamList[teamList.length - 1 - j] = teamList [teamList.length - j - 2];
            }
            teamList[1] = pivot;
        }
        return firstPartOfRound;
    } 
    else{
        teamList.push(-1);
        let firstPartOfRound = []; //schedule
        for(let i = 0; i < teamList.length - 1; i++){
            let fixtures = {    //schedule objects
                "games": [],
                "completed": "no"
            }
            for(let j = 0; j < teamList.length / 2; j++){
                if(i % 2 == 0){ //change Home-Away every match
                    if(teamList[teamList.length - 1 - j] != -1 && teamList[j] != -1){
                        let match = {
                            "team1Id": `${teamList[j]}`,
                            "team2Id": `${teamList[teamList.length - 1 - j]}`,
                            "team1Goals": "",
                            "team2Goals": ""
                        }
                        fixtures.games.push(match);
                    }
                }
                else{
                    if(teamList[teamList.length - 1 - j] != -1 && teamList[j] != -1){
                        let match = {
                            "team1Id": `${teamList[teamList.length - 1 - j]}`,
                            "team2Id": `${teamList[j]}`,
                            "team1Goals": "",
                            "team2Goals": ""
                        }    
                        fixtures.games.push(match);
                    }
                }
            }
            firstPartOfRound.push(fixtures);
            //team rotation
            let pivot = teamList[teamList.length - 1];  
            for(let j = 0; j < teamList.length - 1; j++){
                teamList[teamList.length - 1 - j] = teamList [teamList.length - j - 2];

            }
            teamList[1] = pivot;
        }
        
        return firstPartOfRound;
    }
}

function swapHomeAway(firstPartOfRound){
    let secondPartOfRound = [];
    for(let i = 0; i < firstPartOfRound.length; i++){
        let fixtures = {
            "games": [],
            "completed": "no"
        };
        for(let j = 0; j < firstPartOfRound[i].games.length; j++){
            let match = {
                "team1Id": `${firstPartOfRound[i].games[j].team2Id}`,
                "team2Id": `${firstPartOfRound[i].games[j].team1Id}`,
                "team1Goals": "",
                "team2Goals": ""
            }    
            //console.log(match);
            fixtures.games.push(match);
        }
        secondPartOfRound.push(fixtures);
    }
    return secondPartOfRound;
}

function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
}

function powerOf2(n) {
    if (typeof n !== 'number'){
        return 'Not a number'; 
    }
    return n && (n & (n - 1)) === 0;
}