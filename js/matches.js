const SUPABASE_URL = 'https://ondxyxdpszgixnxdzmqg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_znqfXElADeyxotjuaumZ-Q__WFRrKiK';

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const username = localStorage.getItem("username");
const playerId = localStorage.getItem("playerId");

if (!username || !playerId) {
    window.location.href = "index.html";
}

document.getElementById("welcomeMessage").textContent =
    `Bonjour, ${username}`;

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("playerId");

    window.location.href = "index.html";
});

document.querySelectorAll(".cta_confirm").forEach((button) => {
    button.addEventListener("click", async () => {
        const matchContainer = button.closest(".match_container");

        const matchId = matchContainer.dataset.matchId;
        const scoreHome = matchContainer.querySelector(".score_home").value;
        const scoreAway = matchContainer.querySelector(".score_away").value;

        if (scoreHome === "" || scoreAway === "") {
            alert("Merci d’indiquer les deux scores.");
            return;
        }

        const { data, error } = await supabaseClient
            .from("pronostics")
            .insert([
                {
                    player_id: Number(playerId),
                    username: username,
                    match_id: matchId,
                    score_home: Number(scoreHome),
                    score_away: Number(scoreAway)
                }
            ])
            .select();

        if (error) {
            console.error(error);
            alert("Erreur lors de l’enregistrement du pronostic.");
            return;
        }

        button.textContent = "Pari effectué";
        button.disabled = true;
        button.classList.add("bet_done");

        
    });
});


