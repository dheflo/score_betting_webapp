import { matchSchedule } from "./match_schedule.js";

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

function disableBetButton(button) {
    button.textContent = "Pari effectué";
    button.disabled = true;
    button.classList.add("bet_done");
}

async function loadExistingBets() {
    const { data, error } = await supabaseClient
        .from("pronostics")
        .select("match_id")
        .eq("player_id", Number(playerId));

    if (error) {
        console.error(error);
        return;
    }

    data.forEach((bet) => {
        const matchContainer = document.querySelector(
            `.match_container[data-match-id="${bet.match_id}"]`
        );

        if (!matchContainer) return;

        const button = matchContainer.querySelector(".cta_confirm");
        disableBetButton(button);
    });
}

loadExistingBets();

document.querySelectorAll(".match_container").forEach((matchContainer) => {

    const matchId = matchContainer.dataset.matchId;

    if (isMatchStarted(matchId)) {
        lockMatch(matchContainer);
    }

});

document.querySelectorAll(".cta_confirm").forEach((button) => {
    button.addEventListener("click", async () => {
        if (isMatchStarted(matchId)) {
            alert("Ce match a déjà commencé.");
            return;
        }
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

        disableBetButton(button);
    });
});

function isMatchStarted(matchId) {
    const match = matchSchedule[matchId];

    if (!match) return false;

    const kickoff = new Date(match.kickoff);
    const now = new Date();

    return now >= kickoff;
}

function lockMatch(matchContainer) {
    const button = matchContainer.querySelector(".cta_confirm");
    const inputs = matchContainer.querySelectorAll("input");

    button.textContent = "Pari cloturé";
    button.disabled = true;
    button.classList.add("bet_done");

    inputs.forEach(input => {
        input.disabled = true;
    });
}


