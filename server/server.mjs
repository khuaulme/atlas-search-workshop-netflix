// Load environment variables
import "./loadEnvironment.mjs";

import express from "express";
import axios from "axios";
import cors from "cors";
import { MongoClient } from "mongodb";

//import routes from "./routes/api.mjs";

const PORT = process.env.PORT || 5050;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(cors());

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

  app.post("/searchMoviesAdvanced", async (req, res) => {
    console.log("POST CALL: ADVANCED VECTOR SEARCHING FOR MOVIES");
    const { semanticSearchTerms } = req.body;

    console.log("SEARCH TERMS FROM BODY: ", semanticSearchTerms);
    try {
      const embedding = await getTermEmbeddings(semanticSearchTerms);

      if (embedding !== null) {
        const movies = await vectorSearchForMoviesAdvanced(
          embedding,
          req.body,
          collection
        );

        console.log(movies);
        res.json({
          movies,
        });
      }
    } catch (err) {
      console.error(`Something went wrong from POST: ${err}\n`);
      res.json(err);
    }
  });

  // ------------------- END API ROUTES-------------------------
} catch (error) {
  console.log(error);
}

// HELPER FUNCTIONS

/*--------------------------------------------------------
 GetTermEmbeddings FUNCTION RETURNS EMBEDDINGS FOR TERMS
---------------------------------------------------------*/
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

/*--------------------------------------------------------
VECTORSEARCHFORMOVIES RUNS $SEARCH AGGREGATION 
returns movies array
---------------------------------------------------------*/
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

/*-------------------------------------------------------------------
VECTORSEARCHFORMOVIESADVANCED RUNS $SEARCH AGGREGATION WITH FILTER
returns movies array
---------------------------------------------------------------------*/
const vectorSearchForMoviesAdvanced = async (
  embeddedSearchTerms,
  data,
  collection
) => {
  const { start, end, genre, rating } = data;
  const ratingInt = parseInt(rating);

  const ratingObject = {
    range: {
      path: "imdb.rating",
      gte: ratingInt,
      lte: 10,
    },
  };

  const genreObject = {
    text: {
      query: genre,
      path: "genres",
    },
  };
  const releaseObject = {
    range: {
      path: "released",
      gte: new Date(start),
      lte: new Date(end),
    },
  };

  let compoundFilterObject = {
    compound: {
      filter: [ratingObject, releaseObject],
    },
  };

  if (genre.length > 0) {
    compoundFilterObject = {
      compound: {
        filter: [ratingObject, genreObject, releaseObject],
      },
    };
  }
  //   console.log("COMPOUND OBJECT: ", JSON.stringify(compoundFilterObject));
  const filteredMovies = await collection
    .aggregate([
      {
        $search: {
          index: "default",
          knnBeta: {
            vector: embeddedSearchTerms,
            path: "plot_embedding",
            k: 3,
            filter: compoundFilterObject,
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
          score: {
            $meta: "searchScore",
          },
        },
      },
    ])
    .toArray();

  return filteredMovies;
};
