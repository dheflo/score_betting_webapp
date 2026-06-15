const SUPABASE_URL = 'https://ondxyxdpszgixnxdzmqg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_znqfXElADeyxotjuaumZ-Q__WFRrKiK';

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const existingUsername = localStorage.getItem("username");
const existingPlayerId = localStorage.getItem("playerId");

if (existingUsername && existingPlayerId) {
    window.location.href = "matches.html";
}

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    if (!username) return;

    // Recherche du joueur
    const { data: existingPlayer } = await supabaseClient
        .from("players")
        .select("*")
        .eq("username", username)
        .maybeSingle();

    // Joueur déjà existant
    if (existingPlayer) {

        localStorage.setItem("username", existingPlayer.username);
        localStorage.setItem("playerId", existingPlayer.id);

        window.location.href = "matches.html";
        return;
    }

    // Création du joueur
    const { data, error } = await supabaseClient
        .from("players")
        .insert([
            {
                username: username,
                points: 0
            }
        ])
        .select()
        .single();

    if (error) {
        console.error(error);
        alert("Erreur lors de la création du joueur.");
        return;
    }

    localStorage.setItem("username", data.username);
    localStorage.setItem("playerId", data.id);

    window.location.href = "matches.html";
});