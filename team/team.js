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
    
    
