let draftClass = [];

for(let i = 0; i < 10000; i++){
    //let potential = Math.ceil(Math.pow(randn_bm(), 2.51) * 140);
    let potential = randomPotential()
    let developpmentYears = Math.floor(randn_bm() * 8);
    /* if(potential < 30){
        potential = 30;
    } */
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

for(let i = 0; i < 70; i++){
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

for(let i = 0; i < 32*7; i++){
    if(i % 32 == 0){
        console.log("------------------------------------------------")
    }
    /* let randomPotential = Math.round(Math.random() * 20 - 10);
    draftClass[i].potential += randomPotential */
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


function randomPotential(){
    let odds = [0.1,0.2,0.3,0.41,0.52,0.63,0.74,0.9,0.978,0.981,0.984,0.987,0.99,0.993,0.996,0.998,0.999,0.9999,0.99995,1]
    let random = Math.random()
    for(let j = 0; j < odds.length; j++){
        if(random < odds[j]){
            let potential = Math.random() * 5 + j * 5;
            return Math.round(potential)
        }    
    }
}
/* let results = []
let odds = [0.1,0.2,0.3,0.41,0.52,0.63,0.74,0.85,0.92,0.97,0.975,0.98,0.985,0.99,0.994,0.996,0.999,0.9995,0.9999,1]
for(let i = 0; i < 10000; i++){
    let random = Math.random();
    for(let j = 0; j < odds.length; j++){
        if(random < odds[j]){
            let potential = Math.random() * 0.05 + j * 0.05;
            results.push(potential)
            break;
        }
    }
    
}
results.sort();
console.log(results)
        //   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19
       //    05 10 15 20 25 30 35
       let range = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
for(let i = 0; i < results.length; i++){
    let index = Math.floor(results[i] * 100 / 5);
    range[index].push(results[i]);
}


for(let i = 0; i < range.length; i++){
    console.log(`${i*5} - ${(i+1)*5}: ${range[i].length} / ${range[i].length / results.length * 100}%`)
} */


        //   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19
       //    05 10 15 20 25 30 35
/*        let range = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
for(let i = 0; i < draftClass.length; i++){
    let index = Math.floor(draftClass[i].potential / 5);
    range[index].push(draftClass[i].potential);
}


for(let i = 0; i < range.length; i++){
    console.log(`${i*5} - ${(i+1)*5}: ${range[i].length} / ${range[i].length / draftClass.length * 100}%`)
} */