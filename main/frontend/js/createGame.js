

function newGame(){
    const owner=document.getElementById("name-input").value

    if (!owner){
        return document.getElementById("errorMessage").innerText="Inserisci un nome"
    }

    fetch('/api/createGame', {
    method: 'POST',           
    headers: {
        'Content-Type': 'application/json'  
    },
    body: JSON.stringify({
        owner
    })
    })
    .then(response => {
    if (!response.ok) throw new Error('Errore nella risposta');
    return response.json();
    })
    .then(data => {
        window.location.href=`/game?id=${data.gameId}&name=${owner}`
    })
    .catch(error => {
        console.error('Errore:', error);
    });

}
