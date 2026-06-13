const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();

    localStorage.setItem("username", username);

    window.location.href = "matches.html";
});