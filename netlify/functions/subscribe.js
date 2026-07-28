// Fonction Netlify : reçoit un email depuis le formulaire newsletter du site
// et l'ajoute à une liste de contacts Brevo (ex-Sendinblue).
//
// Réglages nécessaires sur Netlify (Project configuration > Environment variables) :
//   BREVO_API_KEY  -> la clé API générée dans Brevo (SMTP & API > API Keys)
//   BREVO_LIST_ID  -> l'identifiant numérique de la liste de contacts Brevo

exports.handler = async function (event) {
  // On n'accepte que les requêtes POST (envoi de formulaire)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée." }),
    };
  }

  let email;
  try {
    const body = JSON.parse(event.body || "{}");
    email = (body.email || "").trim();
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Requête invalide." }),
    };
  }

  // Petite vérification basique du format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Adresse email invalide." }),
    };
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    // Cas où les réglages n'ont pas encore été faits sur Netlify
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "Configuration manquante côté serveur (clé API ou identifiant de liste Brevo).",
      }),
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(listId, 10)],
        updateEnabled: true, // si l'email existe déjà, on le rattache juste à la liste
      }),
    });

    // Brevo renvoie 201 (créé) ou 204 (déjà existant, mis à jour) en cas de succès
    if (response.status === 201 || response.status === 204) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    const data = await response.json().catch(() => ({}));
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: "Erreur lors de l'inscription.",
        details: data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur : " + err.message }),
    };
  }
};
