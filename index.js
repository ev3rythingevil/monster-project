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
    const HOMEBREW_URL = 'http://localhost:3000/homebrew'
    
    function init(){
        fetch(BASE_URL)
        .then(resp => resp.json())
        .then(monsters => getMonsters(monsters))
        

    fetchHomebrew();

    const createBttn = document.querySelector('#monster-form')
    createBttn.addEventListener('submit', newMonster)
     
    const diceBtn20 = document.querySelector('#dice-button-d20')
    const diceBtn100 = document.querySelector('#dice-button-d100')
    const diceBtn12 = document.querySelector('#dice-button-d12')
    const diceBtn10 = document.querySelector('#dice-button-d10')
    const diceBtn8 = document.querySelector('#dice-button-d8')
    const diceBtn6 = document.querySelector('#dice-button-d6')    
    diceBtn20.addEventListener('click', () => diceRoller(20))
    diceBtn100.addEventListener('click', () => diceRoller(100))
    diceBtn12.addEventListener('click', () => diceRoller(12))
    diceBtn10.addEventListener('click', () => diceRoller(10))
    diceBtn8.addEventListener('click', () => diceRoller(8))
    diceBtn6.addEventListener('click', () => diceRoller(6)) 
}

function getMonsters(monsters){  
    monsters.forEach(obj => {
        const monsterItem = document.createElement('button')
        monsterItem.textContent = obj.name
        const monsterList = document.querySelector('#monster-name-list')
        monsterList.append(monsterItem)
        monsterItem.addEventListener('click', () => monsterCardMaker(obj))
    })
}


function monsterCardMaker(obj){
    if(!!document.querySelector('#monster-card') === true){ 
        document.querySelector('#monster-card').remove() 
    }

    const monsterBody = document.querySelector('#monster-body')
    const monsterCardDiv = document.createElement('div')
    const monsterName = document.createElement('h1')
    const monsterImage = document.createElement('img')
    const monsterHP = document.createElement('span')
    const monsterAC = document.createElement('span')
    const monsterActions = document.createElement('p')
    
    monsterName.textContent = obj.name
    monsterImage.src = obj.img_url
    monsterHP.innerHTML = '<strong><em>HP: </em></strong>' + obj['Hit Points'] 
    monsterAC.innerHTML = '<strong><em>AC: </em></strong>' + obj['Armor Class']
    monsterActions.innerHTML = obj.Actions // This is probably dangerous 
    monsterCardDiv.id = "monster-card"

    monsterCardDiv.append(monsterName, monsterImage, monsterHP, monsterAC, monsterActions)
    monsterBody.append(monsterCardDiv)
    
    if(!!obj['Legendary Actions'] === true){
        const legendary = document.createElement('p')
        const legendHeader = document.createElement('h3')
        legendHeader.textContent = 'Legendary Actions'
        monsterActions.append(legendHeader)
        legendary.innerHTML = obj['Legendary Actions']
        monsterActions.append(legendary) 
    }
    if(!!obj.id === true){
        const deleteBtn = document.createElement('button')
        const monForm = document.querySelector('#monster-card')
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => deleteMon(monsterCardDiv, obj))
        monForm.append(deleteBtn)
    }
}

 function deleteMon(card, obj){
     fetch(`${HOMEBREW_URL}/${obj.id}`,{
         method:'DELETE',
    })

    card.remove()
    document.getElementById(`${obj.id}`).remove()
}

function diceRoller(diceNum){
    const dNum = Math.floor(Math.random() * diceNum);
    const numSpan = document.querySelector('#d20-span')
    if(dNum === 0){
        numSpan.innerHTML =`<em><strong>D${diceNum} = 1</em></strong>` }
    else{ 
    numSpan.innerHTML= `<em><strong>D${diceNum} = ${dNum}</em></strong>`
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
    const newArmor = event.target['new-armor'].value
    const newHit = event.target['new-hit'].value
    const newAction = event.target['new-action'].value
    const monsterObj = {
        name: newName,
        img_url: newImg,
        "Armor Class": newArmor,
        "Hit Points": newHit,
        Actions: newAction,
    }

    postObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(monsterObj),
    }

    fetch(HOMEBREW_URL, postObj)
    .then(resp => resp.json())
    .then(data => monsterCardMaker(data))

    
    makeHomebrewBttn(monsterObj)
    
}

function fetchHomebrew(){
    fetch(HOMEBREW_URL)
    .then(resp => resp.json())
    .then(data => {
        data.forEach(obj => makeHomebrewBttn(obj))
    })
}

function makeHomebrewBttn(monster){
        const homebrewBttn = document.createElement('button')
        homebrewBttn.textContent = monster.name
        homebrewBttn.id = monster.id
        const homebrewList = document.querySelector('#homebrew-monsters')
        homebrewList.append(homebrewBttn)
        homebrewBttn.addEventListener('click', () => monsterCardMaker(monster))
}