import getOpenAiEmbeddings from "./openai.mjs";
import getServerlessEndpointEmbeddings from "./serverlessEndpoint.mjs";

const EMBEDDINGS_SOURCE = process.env.EMBEDDINGS_SOURCE;

async function getTermEmbeddings(query) {
  if (EMBEDDINGS_SOURCE === "openai") return await getOpenAiEmbeddings(query);
  if (EMBEDDINGS_SOURCE === "serverlessEndpoint") return await getServerlessEndpointEmbeddings(query);
}

export default getTermEmbeddings;