import express from "express";
const router = express.Router();

// This will help us connect to the database
import db from "../db/conn.mjs";

// Get a list of 50 posts
router.get("/", async (req, res) => {
  let collection = await db.collection("movies");
  let results = await collection.find({}).limit(2).toArray();

  res.json(results);

  // res.send({ title: "The Matrix" }).status(200);
});

// get movies from database
// router.get("/getMovie", async (req, res) => {
//   console.log("in /getMovie endpoint");

//   // res.send({ type: "GET" });

//   //  const title = req.query.arg;
//   let collection = db.collection("movies");
//   // res.send({ type: "GET", url_parameter: req.query.arg });

//   try {
//     const findOneResult = await collection.findOne({ title: "The Matrix" });
//     if (findOneResult === null) {
//       console.log("Couldn't find.\n");
//     } else {
//       console.log(`Found:\n${JSON.stringify(findOneResult.title)}\n`);
//       res.json(findOneResult);
//     }
//   } catch (err) {
//     console.error(`Something went wrong trying to find one document: ${err}\n`);
//     res.json(err);
//   }
// });

router.post("/searchMovies", async (req, res) => {
  console.log("In search POST");
  console.log(req.body);

  res.json({
    msg: "Success",
    movies: ["World War Z", "Pet Detective"],
    body: req.body,
  });
});

export default router;
