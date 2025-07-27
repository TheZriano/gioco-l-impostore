const params = new URLSearchParams(window.location.search);

const clientName= params.get('name');      // "Marco"
const game = params.get('game'); // "1234"

const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`);

//set leader yellow
    const el = Array.from(document.querySelectorAll('*')).find(el => el.innerText === "leader");
    if (el) {
        el.style.backgroundColor = "#ffc640";
        el.style.color="black"
        el.style.border="3px solid #946c0d"
    }
        
//set you green
    const x = Array.from(document.querySelectorAll('*')).find(el => el.innerText === "you");
    if (x) {
        x.style.backgroundColor = "#88cf72";
        x.style.color="black"
        x.style.border="3px solid #3b6e2b"
    }

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

socket.send(JSON.stringify({ type: 'register', name:owner, game:data.gameId }));

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.type="word"){
    newWord(data.word)
  }
});

socket.addEventListener('close', () => {
  window.location.href="/"
});

socket.addEventListener('error', (error) => {
  window.location.href=`/error?error="${error}"`
});