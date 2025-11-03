// src/utils/userUtils.js
export function getEmailClient() {
  try {
    const userData = localStorage.getItem("user-data"); // ⚡ correspond à la clé
    if (!userData) return null;

    const user = JSON.parse(userData);
    return user.email || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'email :", error);
    return null;
  }
}
