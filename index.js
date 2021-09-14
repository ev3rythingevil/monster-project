//Monster Card Display Properties
    //Name
    //Image
    //Armor Class
    //HitPoints
    //Action
    
    
    // so when we fect the info from the API, we need to add a click event that takes the fetched information and feeds it into the monster-card div
    // we will make a function to call at the end of the fetch that does all this 
    // hardcode a monster to load in with the HTML so that there is always visible content
    
    // step one: Create our DOMContentLoaded function 
    // Is this our list filler?
    // so on DOMContentLoad: Fetch the api and append the monster names to a list, also add the click functionality
    // put everything involving the API in the DOMContentLoad function
    
    // if a monster has legendary actions, create a element for it, otherwise ignore
    
    document.addEventListener('DOMContentLoaded', init);
    const BASE_URL = 'http://localhost:3000/monsters'
    
    function init(){
        fetch(BASE_URL)
        .then(resp => resp.json())
        .then(monsters => getMonsters(monsters))
        
    const createBttn = document.querySelector('#monster-form')
    createBttn.addEventListener('submit', newMonster)

    const diceBtn = document.querySelector('#dice-button-d20')
    diceBtn.addEventListener('click', () => diceRoller(diceNum))

        
    
}

function getMonsters(monsters){
    
    monsters.forEach(obj => {
        const monsterItem = document.createElement('button')
        monsterItem.textContent = obj.name
        const monsterList = document.querySelector('#monster-name-list')
        monsterList.append(monsterItem)
        monsterItem.addEventListener('click', () => testOne(obj))
    })
}


function testOne(obj){
    const monsterName = document.querySelector('#monster-name')
    const monsterImage = document.querySelector('#monster-image')
    const monsterHP = document.querySelector('#hit-points')
    const monsterAC = document.querySelector('#armor-class')
    const monsterActions = document.querySelector('#monster-actions')
    monsterName.textContent = obj.name
    monsterImage.src = obj.img_url
    monsterHP.innerHTML = '<strong><em>HP: </em></strong>' + obj['Hit Points'] 
    monsterAC.innerHTML = '<strong><em>AC: </em></strong>' + obj['Armor Class']
    monsterActions.innerHTML = obj.Actions
    if(!!obj['Legendary Actions'] === true){
        const legendary = document.createElement('p')
        const legendHeader = document.createElement('h3')
        legendHeader.textContent = 'Legendary Actions'
        monsterActions.append(legendHeader)
        legendary.innerHTML = obj['Legendary Actions']
        monsterActions.append(legendary)
    }
}

// Dice Roller goes here:


function diceRoller(diceNum){
    const d20Num = Math.floor(Math.random() * diceNum);
    const numSpan = document.querySelector('#d20-span')
    if(d20Num === 0){
        numSpan.innerHTML ='<em><strong>1</em></strong>' }
    else{ 
    numSpan.innerHTML= `<em><strong>${d20Num}</em></strong>`
    }
}





//started work on Monster Create Section
//had to defer script to get this working.  Consider if this is necessary or if we should include this with DOMContentLoaded
//Create monster needs a button immediately
//add delete more new monsters
//create another block for newly created monsters
//larger text input box for Actions

function newMonster(event){
    event.preventDefault()
    const newName = event.target['new-name'].value
    const newImg = event.target['new-image'].value
    const monsterObj = {
        name: newName,
        img_url: newImg,
    }
    testOne(monsterObj)
}
