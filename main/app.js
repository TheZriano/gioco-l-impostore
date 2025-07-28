const express=require("express");
require('dotenv').config({ path: __dirname + '/.env' });
const path =require("path");
const cors=require("cors");
const db = require("./db.js")
const http = require("http")


const PORT=process.env.PORT || 3000


const app =express();

app.use(express.json());
app.use(cors({origin:`http://localhost:${PORT}` , credentials: true}));
app.use(express.static(path.join(__dirname, "frontend")));

const server= http.createServer(app)



const parole = [
  // Oggetti comuni 
  "sedia", "tavolo", "lampada", "bicchiere", "bottiglia", "libro", "penna", "ombrello", "telefono", "chiave",
  "zaino", "orologio", "cuscino", "tazza", "forbici", "specchio", "porta", "finestra", "divano", "tappeto",
  "scrivania", "carta", "computer", "calcolatrice", "cartella", "valigia", "cintura", "scarpa", "cappello", "giacca",
  "maglia", "pantaloni", "calze", "guanti", "cintura", "borsa", "ombrello", "orologio", "lampione", "campanello",
  "portaombrelli", "cesto", "mappa", "bottone", "ventaglio", "candela", "calice", "puzzle", "macchina fotografica",

  // Animali 
  "cane", "gatto", "pesce", "uccello", "elefante", "giraffa", "mucca", "pecora", "cavallo", "coniglio",
  "papera", "leone", "tigre", "scimmia", "orso", "volpe", "lupo", "cervo", "tartaruga", "serpente",
  "coccodrillo", "foca", "delfino", "balena", "pipistrello", "farfalla", "ape", "formica", "ragno", "granchio",
  "riccio", "porcospino", "pinguino", "aquila", "gabbiano", "cavalluccio marino", "lontra", "camoscio", "istrice",
  "cicala", "lucciola", "rondine", "passero", "cornacchia", "struzzo", "fenicottero", "cigno", "pellicano",

  // Natura e paesaggi 
  "albero", "montagna", "fiume", "mare", "lago", "sole", "luna", "nuvola", "pioggia", "neve",
  "deserto", "foresta", "prato", "isola", "vulcano", "cascata", "grotta", "spiaggia", "baia", "palude",
  "collina", "pianura", "valle", "ghiacciaio", "arcobaleno", "tornado", "temporale", "erba", "foglia", "radice",
  "fiore", "fungo", "pietra", "sasso", "seme", "corteccia", "ramo", "ghiaccio", "nebbia", "vento",
  "tuono", "fango", "lava", "cratere", "acqua", "mareggiata", "gelo", "brina", "bagno",

  // Mezzi di trasporto 
  "auto", "bicicletta", "moto", "autobus", "treno", "barca", "aereo", "elicottero", "nave", "trattore",
  "monopattino", "camion", "carrozza", "scooter", "taxi", "metrò", "funivia", "mongolfiera", "motoslitta", "carro armato",
  "vela", "gommone", "kayak", "canoa", "traghetto", "trolley", "barca a remi", "sottomarino",
  "bicicletta elettrica", "slitta", "carro trainato da cavalli", "auto sportiva", "camioncino",

  // Persone e mestieri
  "cuoco", "poliziotto", "dottore", "insegnante", "pompiere", "pittore", "musicista", "ballerino", "muratore", "astronauta",
  "idraulico", "elettricista", "farmacista", "giornalista", "avvocato", "attore", "bancario", "barbiere", "fotografo", "giornalaio",
  "meccanico", "parrucchiere", "pasticcere", "pescatore", "pilota", "poliziotta", "postino", "scienziato", "scrittore", "sindaco",
  "veterinario", "operaio", "cantante", "architetto", "giardiniere", "cuoca", "cuoco", "maestro", "medico", "infermiere",

  // Azioni e verbi
  "dormire", "correre", "mangiare", "saltare", "nuotare", "scrivere", "leggere", "cantare", "ballare", "ridere",
  "parlare", "camminare", "giocare", "ascoltare", "dipingere", "guidare", "lavorare", "viaggiare", "costruire", "pulire",
  "telefonare", "guardare", "sciare", "arrampicare", "nuotare", "cucinare", "urlare", "salire", "scendere", "cadere",

  // Sport e giochi
  "calcio", "basket", "tennis", "pallavolo", "scacchi", "dama", "nuoto", "boxe", "corsa", "golf",
  "pallanuoto", "rugby", "baseball", "hockey", "karate", "judo", "pattinaggio", "surf", "snowboard", "atletica",
  "biliardo", "ping pong", "pugilato", "ciclismo", "scherma", "sollevamento pesi", "yoga", "danza", "ginnastica", "arrampicata",

  //extra
  "impostore"
];




//scermata home
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


//schermata newgame
app.get("/newGame", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "newGame.html"));
});


//schermata /game
app.get("/game", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "game.html"));
});

//error
app.get("/error", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "error.html"));
});

//schermata /joinGame
app.get("/joinGame", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "joinGame.html"));
});

//* API
app.post("/api/createGame", async (req,res)=>{
  const ownerName=req.body.owner
  if(!ownerName){
    return res.sendStatus(400)
  }
  const gameId= await db.createGame(ownerName)
  if (gameId){
    res.send({ok:true,gameId})
  }else{
    res.sendStatus(500)
  }
 
});

app.get("/api/gameInfo", async (req,res)=>{
  const game=req.query.game
  if (!game) return res.sendStatus(400)
  const gameData= await db.getGame(game)
  res.json(gameData)
});


const WebSocket = require('ws');
const { send } = require("process");
const wss = new WebSocket.Server({server});

const clients = new Map();
const sockets = new Map();

wss.on('connection', async ws => {
  ws.on('message', async message => {
    const data = JSON.parse(message);
    
    //CONNESSIONE
    if (data.type === 'register') {
      if (clients.has(data.game + data.name)) {
        ws.send(JSON.stringify({ type: 'error', message: 'Nome già in uso' }));
      }else{

        clients.set(data.game + data.name, ws);
        sockets.set(ws, data.game + data.name);

        await db.addPlayerToGame(data.name,data.game)
        const gameData= await db.getGame(data.game)
        if(!gameData) return ws.send(JSON.stringify({ type: 'error', message: 'Non esiste questa partita' }));
        gameData.players.forEach(playerName => {
          

          if(true){//){
            
            sendToPlayer(data.game,playerName,{type:"newPlayer", players:gameData.players, owner:gameData.owner})
          }
        })
        
        //console.log(`Registrato: ${data.game + data.name}`);
      }
    }

    //NUOVA PAROLA
    if (data.type === 'word') {
      const sender=sockets.get(ws)
      const senderName=sender.slice(6)
      const senderGame=sender.slice(0, 6)
      const gameInfo=await db.getGame(senderGame)
      
      if (gameInfo && gameInfo.owner==senderName){
        const word=parole[Math.floor(Math.random() * parole.length)]
        const impostor= gameInfo.players[Math.floor(Math.random() * gameInfo.players.length)];
        gameInfo.players.forEach(playerName => {
          
          sendToPlayer(senderGame,playerName,{type:"word",word:(playerName==impostor)?"impostore":word})

        });

      }else{
        ws.send(JSON.stringify({ type: 'error', message: "Non sei l'owner di quella partita" }));
      }
      
    }

  });

  ws.on('close', async () => {
  for (const [name, socket] of clients.entries()) {
    if (socket === ws) {
      clients.delete(name);

      const gameCode = name.slice(0, 6);
      const playerName = name.slice(6);

      const gameData = await db.getGame(gameCode);

      if ((gameData) && (gameData.owner == playerName)) {
        await db.removeGame(gameCode);

        
        gameData.players.forEach(playerName => {
          sendToPlayer(gameCode, playerName, {
            type: "error",
            message: "La partita è stata chiusa"
          });
        });
      } else {
        await db.removePlayerFromGame(playerName, gameCode);
      }

      break;
    }
  }
});

});


function sendToPlayer(game,name, msg) {
  const ws = clients.get(game+name);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}



server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});