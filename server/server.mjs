// Load environment variables
import "./loadEnvironment.mjs";

import express from "express";
import axios from "axios";
import cors from "cors";
import { MongoClient } from "mongodb";

//import routes from "./routes/api.mjs";

const PORT = process.env.PORT || 5050;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
// initialize routes
//app.use(routes);

const connectionString = process.env.ATLAS_URI || "";

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

//Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(connectionString);

try {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("You successfully connected to MongoDB!");

  const database = client.db("sample_mflix");
  const collection = database.collection("embedded_movies");
  // ------------------- API ROUTES-------------------------

  app.get("/getSemanticMovieSearch", async (req, res) => {
    console.log("in sematic endpoint");
    const searchTerms = req.query.searchTerms;
    console.log(searchTerms);
    try {
      const embedding = await getTermEmbeddings(searchTerms);

      if (embedding !== null) {
        const movies = await vectorSearchForMovies(embedding, collection);
        console.log(movies);
        res.json({
          movies,
        });
      }
    } catch (err) {
      console.error(`Something went wrong: ${err}\n`);
      res.json(err);
    }
  });

  app.post("/searchMovies", async (req, res) => {
    console.log("In search POST");
    //req.body

    res.json({
      msg: "Success",
      movies: ["World War Z", "Pet Detective"],
      body: req.body,
    });
  });

  // ------------------- END API ROUTES-------------------------
} catch (error) {
  console.log(error);
}

// HELPER FUNCTIONS
const getTermEmbeddings = async (query) => {
  console.log("GETTING EMBEDDINGS");

  const url = "https://api.openai.com/v1/embeddings";

  // Call OpenAI API to get the embeddings.
  let response = await axios.post(
    url,
    {
      input: query,
      model: "text-embedding-ada-002",
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 200) {
    return response.data.data[0].embedding;
  } else {
    throw new Error(`Failed to get embedding. Status code: ${response.status}`);
  }
};

const vectorSearchForMovies = async (embeddedSearchTerms, collection) => {
  const movies = await collection
    .aggregate([
      {
        $search: {
          index: "default",
          knnBeta: {
            vector: embeddedSearchTerms,
            path: "plot_embedding",
            k: 20,
          },
        },
      },
      {
        $project: {
          title: 1,
          year: 1,
          "imdb.rating": 1,
          fullplot: 1,
          poster: 1,
          released: 1,
          genres: 1,
          score: { $meta: "searchScore" },
        },
      },
    ])
    .toArray();
  return movies;
};
