const express=require("express");
require('dotenv').config({ path: __dirname + '/.env' });
const jwt =require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const path =require("path");
const cors=require("cors");
const fs = require("fs").promises;
const db = require("./db.js")
const http = require("http")

const PORT=process.env.PORT || 3000


const app =express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:`http://localhost:${PORT}` , credentials: true}));
app.use(express.static(path.join(__dirname, "frontend")));

const server= http.createServer(app)



//scermata home
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


//schermata newgame
app.get("/newGame", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "newGame.html"));
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


const WebSocket = require('ws');
const wss = new WebSocket.Server({server});

const clients = new Map(); // nome => ws

wss.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);
    
    if (data.type === 'register') {
      // Cliente si registra con un nome
      clients.set(data.game, data.name, ws);
      console.log(`Registrato: ${data.game + data.name}`);
    }
  });

  ws.on('close', () => {
    // Rimuovi la connessione chiusa dalla mappa
    for (const [name, socket] of clients.entries()) {
      if (socket === ws) {
        clients.delete(name);
        console.log(`Disconnesso: ${name}`);
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