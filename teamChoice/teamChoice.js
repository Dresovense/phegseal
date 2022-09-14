let gameData = JSON.parse(sessionStorage.getItem("gameData"));

for(let i = 0; i < gameData.teams.length; i++){
    let button = document.createElement("button");
    button.style.width = "120px";
    button.innerText = `${gameData.teams[i].name}`;
    button.addEventListener("click", () => {
        sessionStorage.setItem("team", i);
        location.href = "../team/team.html";
    }); 
    button.style.display = "block";
    document.body.appendChild(button);
}

let button = document.createElement("button");
button.innerText = "New Team";
button.addEventListener("click", () => {
  gameData = JSON.stringify(gameData);
  sessionStorage.setItem("gameData", gameData);
  location.href = "../newTeam/newTeam.html";
});
document.body.appendChild(button);