let gameData = JSON.parse(sessionStorage.getItem("gameData"));



let map = document.createElement("img");
map.src = "../graphics/map/Phegsael.png";
map.style.width = "900px";
map.style.margin = "auto";
document.body.appendChild(map);

for(let i = 0; i < gameData.teams.length; i++){
  let team = document.createElement("img");
  team.className = "teamChoice_team";
  team.src = ".." + gameData.teams[i].logo + ".png";
  team.addEventListener("click", () => {
      sessionStorage.setItem("team", i);
      location.href = "../team/team.html";
  }); 
  team.style.left = gameData.teams[i].teamPlacement.left;
  team.style.top = gameData.teams[i].teamPlacement.top;
  document.body.appendChild(team);
}


let button = document.createElement("button");
button.innerText = "New Team";
button.addEventListener("click", () => {
  gameData = JSON.stringify(gameData);
  sessionStorage.setItem("gameData", gameData);
  location.href = "../newTeam/newTeam.html";
});
document.body.appendChild(button);
