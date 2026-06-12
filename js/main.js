export function getCurrentPlayer() {
    return JSON.parse(localStorage.getItem("player"));
}

export function saveCurrentPlayer(player) {
    localStorage.setItem("player", JSON.stringify(player));
}

export function redirectIfNotLoggedIn() {
    const player = getCurrentPlayer();

    if (!player) {
        window.location.href = "index.html";
    }

    return player;
}