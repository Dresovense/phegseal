const fs = require('fs');

let saveButton = document.createElement("button");
saveButton.innerText = "Save game";
saveButton.id = "saveButton";
saveButton.addEventListener("click", () => {
    fs.writeFile('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
        if(err){
            return console.log(err);
        }
    })
});
document.body.appendChild(saveButton);
