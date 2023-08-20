// Load environment variables
import "./loadEnvironment.mjs";

import express from "express";

import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

//import routes from "./routes/api.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());
// initialize routes
//app.use(routes);

const connectionString = process.env.ATLAS_URI || "";

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

//Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("You successfully connected to MongoDB!");

  const database = client.db("sample_mflix");
  const collection = database.collection("movies");
  // ------------------- API ROUTES-------------------------

  app.get("/getMovie", async (req, res) => {
    console.log("in /getMovie endpoint");
    const title = req.query.arg;
    try {
      const findOneResult = await collection.findOne({ title: title });
      if (findOneResult === null) {
        console.log("Couldn't find.\n");
      } else {
        console.log(`Found:\n${JSON.stringify(findOneResult.title)}\n`);
        res.json(findOneResult);
      }
    } catch (err) {
      console.error(
        `Something went wrong trying to find one document: ${err}\n`
      );
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
