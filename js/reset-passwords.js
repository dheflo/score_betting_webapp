const SUPABASE_URL = 'https://ondxyxdpszgixnxdzmqg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_znqfXElADeyxotjuaumZ-Q__WFRrKiK';

const RESET_CODE = "WC26-ADMIN";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const resetForm = document.getElementById("resetForm");

resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const resetCode = document.getElementById("resetCode").value.trim();

    if (resetCode !== RESET_CODE) {
        alert("Code de réinitialisation incorrect.");
        return;
    }

    if (newPassword.length < 4) {
        alert("Le mot de passe doit contenir au moins 4 caractères.");
        return;
    }

    const { error } = await supabaseClient
        .from("players")
        .update({ password: newPassword })
        .eq("username", username);

    if (error) {
        console.error(error);
        alert("Erreur lors de la réinitialisation.");
        return;
    }

    alert("Mot de passe réinitialisé.");

    window.location.href = "index.html";
});