import { Router } from "express";
import getTermEmbeddings from "../embeddings/index.mjs";
import MovieController from "../controllers/movies.mjs";

const router = Router();
const movieController = new MovieController();

router.post("/semantic/advanced", async (req, res) => {
  console.log("POST CALL: ADVANCED VECTOR SEARCHING FOR MOVIES");
  const { semanticSearchTerms } = req.body;

  console.log("SEARCH TERMS FROM BODY: ", semanticSearchTerms);
  try {
    const embedding = await getTermEmbeddings(semanticSearchTerms);

    if (embedding !== null) {
      const movies = await movieController.vectorSearchAdvanced(
        embedding,
        req.body
      );

      res.json(movies);
    }
  } catch (err) {
    console.error(`Something went wrong from POST: ${err}\n`);
    res.json(err);
  }
});

router.get("/semantic", async (req, res) => {
  console.log("in sematic endpoint");
  const searchTerms = req.query.searchTerms;
  console.log(searchTerms);
  try {
    const embedding = await getTermEmbeddings(searchTerms);

    if (embedding !== null) {
      const movies = await movieController.vectorSearch(embedding);
      return res.json(movies);
    } else {
      return res.statusCode(401).send("No embedding found");
    }
  } catch (err) {
    console.error(`Something went wrong in semantic endpoint: ${err}\n`);
    res.json(err);
  }
});

export default router;
