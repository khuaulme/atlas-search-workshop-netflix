import dotenv from "dotenv";

dotenv.config();

// Check for missing environment variables
let missingEnvVars = [];
if (!process.env.ATLAS_URI) missingEnvVars.push("ATLAS_URI");
if (!process.env.EMBEDDINGS_SOURCE) missingEnvVars.push("EMBEDDINGS_SOURCE");
if (!process.env.EMBEDDING_API_KEY && process.env.EMBEDDINGS_SOURCE === "openai") missingEnvVars.push("EMBEDDING_API_KEY");

if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
  console.log("Create a .env file in the server directory and add the missing variables.")
  console.log("`server/.env`");
  console.log(`PORT=5050`);
  console.log(`ATLAS_URI=<your MongoDB Atlas connection string>`);
  console.log(`EMBEDDINGS_SOURCE=<openai or serverlessEndpoint>`);
  console.log(`EMBEDDING_API_KEY=<your OpenAI API key if needed>`);
  process.exit();
}