
const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`);

// Quando la connessione è aperta
socket.addEventListener('open', () => {
  console.log('✅ WebSocket connesso a', wsUrl);

  // Esempio: registrazione automatica con nome
  const name = prompt("Inserisci il tuo nome:");
  socket.send(JSON.stringify({ type: 'register', name }));
});

// Quando arriva un messaggio
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('📩 Ricevuto:', data);
});

// Quando la connessione si chiude
socket.addEventListener('close', () => {
  console.log('❌ Connessione chiusa');
});

// Gestione errori
socket.addEventListener('error', (error) => {
  console.error('Errore WebSocket:', error);
});
