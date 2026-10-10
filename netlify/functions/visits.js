const { connectLambda, getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  // Netlify Blobs needs the Lambda context when using the classic handler format.
  connectLambda(event);

  const store = getStore({ name: "site-analytics", consistency: "strong" });
  const key = "visits";

  try {
    if (event.httpMethod === "GET") {
      const current = await store.get(key, { type: "json" });
      const visits = Number(current?.visits || 0);
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ visits })
      };
    }

    if (event.httpMethod === "POST") {
      const current = await store.get(key, { type: "json" });
      const visits = Number(current?.visits || 0) + 1;

      await store.setJSON(key, {
        visits,
        updatedAt: new Date().toISOString()
      });

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ visits })
      };
    }

    return {
      statusCode: 405,
      headers: { "Allow": "GET, POST" },
      body: JSON.stringify({ error: "Méthode non autorisée." })
    };
  } catch (error) {
    console.error("Compteur de visites:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Compteur indisponible." })
    };
  }
};
