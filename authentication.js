document.getElementById('in').addEventListener('click', () => {
    document.getElementById('sign-in').style.display = 'block';
    document.getElementById('sign-up').style.display = 'none';
    document.getElementById('up').classList.remove("unclicked");
    document.getElementById('in').classList.add("unclicked");
});

document.getElementById('up').addEventListener('click', () => {
    document.getElementById('sign-in').style.display = 'none';
    document.getElementById('sign-up').style.display = 'block';
    document.getElementById('in').classList.remove("unclicked");
    document.getElementById('up').classList.add("unclicked");
});