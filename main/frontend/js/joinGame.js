function joinGame(){
    const code=document.getElementById("code-input").value
    const name=document.getElementById("name-input").value

    if (!code || !name){
        document.getElementById("error-message").innerText="Riempi tutt ii campi"
    }
    window.location.href=`/game?id=${code}&name=${name}`
}