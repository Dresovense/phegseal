let gameData = JSON.parse(sessionStorage.getItem("gameData"));
let team = sessionStorage.getItem("team");


//info
    //team Name
    let teamName = document.createElement("h1");
    teamName.innerText = gameData.teams[team].name;
    document.body.appendChild(teamName);
    teamName.style.display = "inline-block";
    //logo
    let teamLogo = document.createElement("img");
    teamLogo.src = ".." + gameData.teams[team].logo + ".png";
    document.body.appendChild(teamLogo);
    teamLogo.style.display = "inline-block";
    //teamInfos Div
    let teamInfos = document.createElement("div");
    document.body.appendChild(teamInfos);
    //date
    let teamDate = document.createElement("div");
    teamDate.innerText = "First Season: " + gameData.teams[team].date;
    teamInfos.appendChild(teamDate);
    //town
    let teamTown = document.createElement("div");
    teamTown.innerText = "Town: " + gameData.teams[team].town;
    teamInfos.appendChild(teamTown);
    //stadium
    let teamStadium = document.createElement("div");
    teamStadium.innerText = "Stadium (attendance): " + gameData.teams[team].stadiumName + " (" + gameData.teams[team].stadiumAttendence + ")";
    teamInfos.appendChild(teamStadium);
    //expectations
    let expectationsDiv = document.createElement("div");
    let expectations;
    if(gameData.teams[team].power < 0.8){
        expectations = "None";
    }
    else if (gameData.teams[team].power < 1.05){
        expectations = "Playoff Team";
    }
    else if(gameData.teams[team].power < 1.3){
        expectations = "Challenge for title"
    }
    else{
        expectations = "Contender";
    }
    expectationsDiv.innerText = "Expectations: " + expectations;
    teamInfos.appendChild(expectationsDiv);
    
    
