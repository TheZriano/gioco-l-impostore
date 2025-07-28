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
    const res = await db.query("INSERT INTO games (owner, code, players) VALUES ($1, $2, $3)", [ownerName, code, JSON.stringify([ownerName])]);
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
    const res = await db.query(
      `UPDATE games
       SET players = players || to_jsonb($1::text)
       WHERE code = $2
       AND NOT players ? $1`,
      [name, game]
    );
    return res.rowCount > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function removePlayerFromGame(name, game) {
  try {
    const res = await db.query(
      `UPDATE games
       SET players = players - $1
       WHERE code = $2`,
      [name, game]
    );
    return res.rowCount > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function removeGame(code) {
  try {
    const res = await db.query("DELETE FROM games WHERE code = $1;", [code]);
    return res.rowCount > 0; // true se è stato cancellato almeno 1 record
  } catch (err) {
    console.error(err);
    return false;
  }
}


//getGame
async function getGame(game) {
  try {
    const res = await db.query("SELECT owner, players FROM games WHERE code = $1;", [game]);
    if (res.rows.length === 0) return false;

    const { owner, players } = res.rows[0];
    return { owner, players };
  } catch (err) {
    console.error(err);
    return false;
  }
}


setInterval(cleanExpiredRows, 1000*60*60*6);



module.exports = {
 createGame, getGame, addPlayerToGame, removePlayerFromGame, removeGame

};


