const params = new URLSearchParams(window.location.search);

const error= params.get('error');

document.getElementById("error-message").innerText=error