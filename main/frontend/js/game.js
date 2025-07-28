const params = new URLSearchParams(window.location.search);

const clientName= params.get('name');      // "Marco"
const game = params.get('id'); // "1234"

const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`);

let owner



//set h1
document.getElementById("game-code").innerText="#"+game


        


//word-card
function showWord(){
    document.getElementById("word-card").style.display="flex";
    document.getElementById("new-text").style.display="none";
}
function hideWord(){
    document.getElementById("word-card").style.display="none";
}

function newWord(word){
    document.getElementById("new-text").style.display="block";
    document.getElementById("word").innerText=word;
    if (word=="impostore"){
        document.getElementById("word").style.color="var(--color3)";
    }else{
        document.getElementById("word").style.color="green";
    }
}


socket.addEventListener("open",()=>{
    socket.send(JSON.stringify({ type: 'register', name:clientName, game:game }))
})

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.type=="word"){
    newWord(data.word)
  }else if(data.type=="error"){
    window.location.href=`/error?error=${data.message}`
  }else if(data.type=="newPlayer"){
    let playersButtons=document.getElementById("players")
    playersButtons.innerHTML=""

    data.players.forEach(player => {

        playersButtons.innerHTML+=`<button >${player}</button>`
    });
    owner=data.owner
    colorPlayers()
  }else if (data.type="word"){
    newWord(data.word)
  }
});

socket.addEventListener('close', () => {
  window.location.href="/"
});




function colorPlayers(){
    const el = Array.from(document.querySelectorAll('button')).find(el => el.innerText == owner);
    if (el) {
        el.style.backgroundColor = "#ffc640";
        el.style.color="black"
        el.style.border="3px solid #946c0d"
    }

    const x = Array.from(document.querySelectorAll('button')).find(el => el.innerText == clientName);
    if (x) {
        x.style.backgroundColor = "#88cf72";
        x.style.color="black"
        x.style.border="3px solid #3b6e2b"
    }

    if(owner==clientName){
            document.getElementById("new-button").style.display="block"
    }
}

function askWord(){
    socket.send(JSON.stringify({type:"word"}))
}