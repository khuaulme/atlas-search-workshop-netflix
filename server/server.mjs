// Load environment variables
import "./loadEnvironment.mjs";
import express from "express";
import cors from "cors";
import routes from "./routes/movies.mjs";

const PORT = process.env.PORT || 5050;


const app = express();
app.use(cors());
app.use(express.json());
app.use("/movies", routes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
