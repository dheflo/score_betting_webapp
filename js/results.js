import { scoreOfficial } from "./score_official.js";

const SUPABASE_URL = "https://ondxyxdpszgixnxdzmqg.supabase.co";
const SUPABASE_KEY = 'sb_publishable_znqfXElADeyxotjuaumZ-Q__WFRrKiK';

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const BONUS_DEADLINE = new Date("2026-06-30T18:00:00+02:00");

const rankingList = document.getElementById("rankingList");

function calculPoints(scoreHomeReal, scoreAwayReal, scoreHomeBet, scoreAwayBet) {
    if (scoreHomeReal === scoreHomeBet && scoreAwayReal === scoreAwayBet) {
        return 6;
    }

    const resultReal =
        scoreHomeReal > scoreAwayReal ? "home" :
        scoreHomeReal < scoreAwayReal ? "away" : "draw";

    const resultBet =
        scoreHomeBet > scoreAwayBet ? "home" :
        scoreHomeBet < scoreAwayBet ? "away" : "draw";

    return resultReal === resultBet ? 3 : 0;
}

async function loadRanking() {
    const { data: pronostics, error } = await supabaseClient
        .from("pronostics")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    const ranking = {};

    pronostics.forEach((prono) => {
        const officialResult = scoreOfficial[prono.match_id];

        if (!officialResult || !officialResult.finished) {
            return;
        }

        const points = calculPoints(
            officialResult.home,
            officialResult.away,
            prono.score_home,
            prono.score_away
        );

        if (!ranking[prono.player_id]) {
            ranking[prono.player_id] = {
                username: prono.username,
                points: 0
            };
        }

        ranking[prono.player_id].points += points;
    });

    const sortedRanking = Object.values(ranking)
        .sort((a, b) => b.points - a.points);

    rankingList.innerHTML = "";

    sortedRanking.forEach((player, index) => {
        rankingList.innerHTML += `
            <div class="ranking_row">
                <div>#${index + 1}</div>
                <div>${player.username}</div>
                <div>${player.points} pts</div>
            </div>
        `;
    });
}

loadRanking();

function isBonusClosed() {
    return new Date() >= BONUS_DEADLINE;
}

if (isBonusClosed()) {

    document.querySelectorAll(".bonus_input_field").forEach(input => {
        input.disabled = true;
    });

    document.querySelectorAll(".bonus_button").forEach(button => {
        button.disabled = true;
        button.textContent = "Bonus clôturés";
        button.classList.add("bet_done");
    });

}