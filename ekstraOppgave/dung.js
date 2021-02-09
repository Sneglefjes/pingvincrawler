
const player = document.querySelector('#sprite');
const moveButtons = document.querySelector('.movement');
const button = document.getElementById('showPlayer');
const popup = document.querySelector('.popups');
const lootmsg = document.querySelector('body > div > div.loots > div > p');
const lootpopup = document.querySelector('.loots');
const yes = document.getElementById('yes');
const healthbar = document.querySelector('.health');
const weaponbar = document.querySelector('.weapon');
const stats = document.querySelector('.stats')



button.addEventListener('click', () => {
    popup.style.display = 'block';
    button.style.visibility = 'hidden';
})

popup.addEventListener('click', () => {
    player.style.visibility = 'visible';
    popup.style.display = 'none';
    moveButtons.style.display = 'block';
    stats.style.display = 'block';
})

yes.addEventListener('click', () => {
    lootpopup.style.display = 'none';
})


const playerObject = {
    positionX: 22,
    positionY: 10,
    weapon: {name: 'slap', attack: 1},
    get currentWeapon() {
        return this.weapon;
    },
    health: 3
};


function weaponGenerator() {
    const names = ['sword', 'axe', 'gun'];
    return {
        name: names[Math.floor(Math.random()*names.length)],
        attack: Math.ceil(Math.random()*5),
    };
}

function randomLoot() {
    const loots = ['fish', 'potion', weaponGenerator(), 'fish', 'potion', 0, 0, 0]
    return loots[Math.floor(Math.random()*loots.length)];
}




moveButtons.addEventListener('click', event => {
    try {
        if (event.target.innerText.includes('down'))
            player.style.top = `${playerObject.positionY += 100}px`;
        else if (event.target.innerText.includes('up'))
            player.style.top = `${playerObject.positionY -= 100}px`;
        else if (event.target.innerText.includes('left'))
            player.style.left = `${playerObject.positionX -= 104}px`;
        else if ((event.target.innerText.includes('right')))
            player.style.left = `${playerObject.positionX += 104}px`;

        let placeY = playerObject.positionY;
        let placeX = playerObject.positionX;

        // Utrolig dårlig løsning for å passe på at spriten ikke går på veggene eller utenfor brettet.
        if (placeY < 0 || placeY > 600 || placeX < 0 || placeX > 600 || (placeY < 50 && (placeX < 300 && placeX > 80) || ((placeY > 100 && placeY < 120) && (placeX > 400 && placeX < 500)) || ((placeY < 250 && placeY > 200) && (placeX < 500)) || ((placeY > 300 && placeY < 320) && (placeX > 400 && placeX < 500)) || ((placeY > 400 && placeY < 450) && (placeX > 100 && placeX < 250)) || ((placeY > 500) && (placeX > 100))))
            throw new Error('You died trying to push your head against the wall');
        if ((placeY > 500 && placeY < 600) && (placeX > 0 && placeX < 100))
            throw new Error('You won! Hurra!');
        
        let found = findLoot();
        console.log(playerObject.health, playerObject.weapon);

        let enemy = 0;
        if (found === 0) {
            console.log(found)
            enemy = enemySpawn();
        }
        console.log(enemy);
        console.log(playerObject.health);

        if (enemy !== 0) {
            do {
                console.log(playerObject.health);
                getHit(enemy);
                if (playerObject.health < 1) {
                    throw new Error('Oh no - you died!')             
                }
                hitEnemy(enemy);
            } while (enemy.health > 0)
            if (enemy.health <= 0) {
                yes.innerText = 'Hurrah!';
                lootmsg.innerText += ` You managed to kill the ${enemy.name}!`;
                lootpopup.style.display = 'block';
            }
        }

        healthbar.innerHTML = `<p>Health: ${playerObject.health}</p>`;
        weaponbar.innerHTML = `<p>${playerObject.weapon.name}: ${playerObject.weapon.attack} damage</p>`;

    } catch (e) {
        alert(e);
        playerObject.health = 3;
        playerObject.weapon = {name: 'slap', attack: 1};
        playerObject.positionX = 22;
        playerObject.positionY = 10;
        player.style.top = `${playerObject.positionY}px`;
        player.style.left = `${playerObject.positionX}px`;
        healthbar.innerHTML = `<p>Health: ${playerObject.health}</p>`;
        weaponbar.innerHTML = `<p>${playerObject.weapon.name}: ${playerObject.weapon.attack} damage</p>`;
    }
})
    
    
    
function findLoot() {
    let newItem = randomLoot();
    if (newItem !== 0) {
        lootpopup.style.display = 'block';
        if (newItem === 'fish') {
            lootmsg.innerText = `You flaps felt something in the dark  - it's a fish!`;
            yes.innerText = 'eat';
            playerObject.health++;
        } else if (newItem === 'potion') {
            lootmsg.innerText = `You flaps felt something in the dark  - it's a potion!`;
            yes.innerText = 'drink';
            playerObject.health++;
            playerObject.weapon.attack++;
        } else if (typeof newItem === 'object') {
            lootmsg.innerText = `You flaps felt something in the dark  - it's a weapon!`;
            yes.innerText = 'equip';
            newItem.attack += playerObject.weapon.attack;
            playerObject.weapon = newItem;
        }
    }
    return newItem;
}
    
function enemySpawn() {
    const enemies = [{name: 'shark', attack: 2, health: 5}, {name: 'seal', attack: 1, health: 4}, {name: 'killer whale', attack: 4, health: 7}, {name: 'turtle', attack: 0, health: 2}, 0, 0, 0, 0];
    const enemy = enemies[Math.floor(Math.random()*enemies.length)];

    if (enemy !== 0) {
        yes.innerText = 'ok';
        lootmsg.innerText = `Suddenly something attacks you in the dark  - it's a ${enemy.name}! Your health: ${playerObject.health} The ${enemy.name}'s health: ${enemy.health}`;
        lootpopup.style.display = 'block';
    }
    return enemy; 
}
    
function getHit(fiend) {
    lootpopup.style.display = 'block';
    console.log(playerObject.health);
    let damage = (Math.floor(Math.random()*3) + fiend.attack);
    playerObject.health -= damage;
    console.log(playerObject.health);
    yes.innerText = 'ok';
    lootmsg.innerText += ` The ${fiend.name} attacked and inflicted ${damage} damage!
    Your health: ${playerObject.health} The ${fiend.name}'s health: ${fiend.health}`;
}

function hitEnemy(fiend) {
    lootpopup.style.display = 'block';
    fiend.health -= playerObject.weapon.attack;
    yes.innerText = 'ok';
    lootmsg.innerText += ` You attacked ${fiend.name} with your ${playerObject.weapon.name} and inflicted ${playerObject.weapon.attack} damage! Your health: ${playerObject.health} The ${fiend.name}'s health: ${fiend.health}`;
}
    
    

