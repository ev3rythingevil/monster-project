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
        
    filterMonsterMenu();
    fetchHomebrew();

    let i = 0
    const modHeader = document.querySelector('#mod-header')
    const plus = document.querySelector('#plus')
    const minus = document.querySelector('#minus')
    plus.addEventListener('click', ()=> {
        i++
        modHeader.textContent = `+${i}`
        })
    minus.addEventListener('click', ()=>{
        i--
        modHeader.textContent = `${i}`
    })    
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
   
            
            function diceRoller(diceNum){
                const dNum = Math.floor(Math.random() * diceNum+1);
                const numSpan = document.querySelector('#d20-span')
                    if(i != 0){
                        const modRoll = i + dNum
                        numSpan.innerHTML = `<em><strong>D${diceNum}+${i} = ${modRoll} `
                    }
                else{ 
                numSpan.innerHTML= `<em><strong>D${diceNum} = ${dNum}</em></strong>`
                }
            i = 0
            modHeader.textContent = 'Modifier';    
            }
        
}

function getMonsters(monsters){  
    monsters.forEach(obj => {
        const monsterItem = document.createElement('li')
        const monBtn = document.createElement('button')
        monBtn.textContent  = obj.name
        monsterItem.append(monBtn)
        const monsterList = document.querySelector('#monster-name-list')
        monsterList.append(monsterItem)
        monBtn.addEventListener('click', () => monsterCardMaker(obj))
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
    monsterActions.append(monsterHP, monsterAC)
    monsterCardDiv.append(monsterName, monsterImage, monsterActions)
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
    .then(data => {
        makeHomebrewBttn(data)
        monsterCardMaker(data)
    })
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

function filterMonsterMenu() {
    const selectionMenu = document.querySelector('#selection-menu')
    selectionMenu.addEventListener('change', filterMonsters)
}

function filterMonsters(event){
    const selection = event.target.value

    fetch(BASE_URL)
        .then(resp => resp.json())
        .then(monsters => {
            if(selection === 'Show All'){
                getMonsters(monsters)
            }
            else{
                let challengeList = monsters.filter(obj => obj.Challenge === selection)
                const list = document.querySelector('#monster-name-list')
                
                while(document.querySelector('li')){
                    document.querySelector('li').remove()
                }

                getMonsters(challengeList)
            }
        })
}
