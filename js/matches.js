const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "index.html";
}

document.getElementById("welcomeMessage").textContent =
    `Bonjour, ${username}`;

document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();

    localStorage.removeItem("username");

    window.location.href = "index.html";
});