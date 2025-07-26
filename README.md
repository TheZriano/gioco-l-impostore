# Sito di To-Do list

Questo sito permette la creazione di To-Do lists associate ad utenti.

## Funzionalità

- login e signin
- creazione di task con titolo e descrizione !!DA IMPLEMENTARE
- possibilità di marcare completate le task !!DA IMPLEMENTARE

## Requisiti

- node.js vers 22.14+
- posgreSQL vers 17+

## Il database

- trovate il dump SQL per la creazione delle tabelle [qui](main/databaseSetup.sql) e dovete mettere le credenziali del database nel file .env da inserire vicino all'[esempio](main/.env.example) (togliete .example e compilate i dati che richiede, SONO TUTTI INDISPENSABILI).
- Il database ha due tabelle:
- - Users: id username name surname email created_at
- - Todos: id user_id title description done created_at

## Avviare il server
Per avviare il backend sul localhost occorre avviare con node il file [app.js](main/app.js) dopo aver collegato il databse, la porta di default è la 3000 ma puo essere impostata nel file .env"# gioco-l-impostore" 
