import fetch from "node-fetch";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/*--------------------------------------------------------
 GetTermEmbeddings FUNCTION RETURNS EMBEDDINGS FOR TERMS
---------------------------------------------------------*/
const getTermEmbeddings = async (query) => {
  console.log("GETTING EMBEDDINGS");

  const url = "https://api.openai.com/v1/embeddings";

  // Call OpenAI API to get the embeddings.
  let response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: query,
      model: "text-embedding-ada-002",
    })
  }).then((res) => res.json());

  return response.data[0].embedding;
};

export default getTermEmbeddings;
