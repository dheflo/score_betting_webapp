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

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (!username || !password) {
        alert("Merci de remplir le pseudo et le mot de passe.");
        return;
    }

    if (password.length < 4) {
        alert("Le mot de passe doit contenir au moins 4 caractères.");
        return;
    }

    const { data: existingPlayer, error: searchError } = await supabaseClient
        .from("players")
        .select("*")
        .eq("username", username)
        .maybeSingle();

    if (searchError) {
        console.error(searchError);
        alert("Erreur lors de la vérification du joueur.");
        return;
    }

    if (existingPlayer) {
        if (existingPlayer.password !== password) {
            alert("Mot de passe incorrect.");
            return;
        }

        localStorage.setItem("username", existingPlayer.username);
        localStorage.setItem("playerId", existingPlayer.id);

        window.location.href = "matches.html";
        return;
    }

    const { data, error } = await supabaseClient
        .from("players")
        .insert([
            {
                username: username,
                password: password,
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