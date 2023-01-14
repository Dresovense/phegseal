let draftClass = [];

for(let i = 0; i < 10000; i++){
    let potential = Math.ceil(Math.pow(randn_bm(), 2.51) * 140);
    let developpmentYears = Math.floor(randn_bm() * 8);
    if(potential < 30){
        potential = 30;
    }
   // let randomName = firstName.data[Math.floor(Math.random() * firstName.data.length)] + " " + lastName.data[Math.floor(Math.random() * lastName.data.length)];
    draftClass.push({
        potential: potential,
        developpmentYears: developpmentYears,
    //    name: randomName
    });
}

draftClass.sort(function(left,right){
    if(left.potential > right.potential){
        return -1;
    }
    else if(left.potential < right.potential){
        return 1;
    }
    else{
        if(left.developpmentYears > right.developpmentYears){
            return 1;
        }
        else{
            return -1;
        }
    }
})

for(let i = 0; i < 75; i++){
    let random_player = draftClass.splice(Math.floor(Math.random() * 150), 1);
    let random_place = Math.floor(Math.random() * 150);
    draftClass.splice(random_place, 0, random_player[0]);
}

for(let i = 0; i < 200; i++){
    let random_player = draftClass.splice(Math.floor(Math.random() * 250) + 30, 1);
    let random_place = Math.floor(Math.random() * 250) + 30;
    draftClass.splice(random_place, 0, random_player[0]);
}

for(let i = 0; i < 200; i++){
    let random_player = draftClass.splice(Math.floor(Math.random() * 10000) + 50, 1);
    let random_place = Math.floor(Math.random() * 10000) + 50;
    draftClass.splice(random_place, 0, random_player[0]);
}

for(let i = 0; i < 18*7; i++){
    if(i % 18 == 0){
        console.log("------------------------------------------------")
    }
    let randomPotential = Math.round(Math.random() * 20 - 10);
    draftClass[i].potential += randomPotential
    console.log(draftClass[i])
}

function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}


