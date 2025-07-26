const params = new URLSearchParams(window.location.search);

const clientName= params.get('name');      // "Marco"
const game = params.get('game'); // "1234"



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
