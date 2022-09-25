const fs = require('fs');

let saveButton = document.createElement("button");
saveButton.innerText = "Save game";
saveButton.id = "saveButton";
saveButton.addEventListener("click", () => {
    fs.writeFile('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
        if(err){
            return console.log(err);
        }
    });
    gameData = JSON.stringify(gameData);
    sessionStorage.removeItem("gameData");
    sessionStorage.setItem("gameData", gameData);
    gameData = JSON.parse(gameData);
    window.location.reload(false);
});
document.body.appendChild(saveButton);
