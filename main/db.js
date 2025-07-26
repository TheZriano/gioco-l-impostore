const db = require("./postgresql");


async function cleanExpiredRows() {
  try {
    const result = await db.query("DELETE FROM games WHERE expires_at < NOW()");
    console.log(`Pulizia games scaduti dal database: ${result.rowCount} righe eliminate`);
  } catch (err) {
    console.error("Errore durante la pulizia:", err);
  }
}

cleanExpiredRows();

function generateSixDigitCode() {
  const num = Math.floor(Math.random() * 1000000); // numero da 0 a 999999
  return num.toString().padStart(6, '0'); // aggiunge zeri a sinistra se necessario
}


async function createGame(ownerName) {
  try {
    const code=generateSixDigitCode()
    const res = await db.query("INSERT INTO games (owner, code, players, status) VALUES ($1, $2, $3, 'lobby')", [ownerName, code, JSON.stringify([ownerName])]);
    return code;
  } catch (err) {
    if (err.code === '23505') {
        return createGame(ownerName)
    } else {
      console.error(err);
      return false;
  }
  }
}

async function addPlayerToGame(name, game) {
  try {
    const res = await db.query("UPDATE games SET players = players || to_jsonb($1) WHERE code = $2 AND NOT players @> to_jsonb(ARRAY[$1]);", [name, game]);
  } catch (err) {

    console.error(err);
    return false;

  }
}


setInterval(cleanExpiredRows, 1000*60*60*6);



module.exports = {
 createGame

};


