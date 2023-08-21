import db from "../db/conn.mjs";

export default class MovieController {
  /*--------------------------------------------------------
  VECTORSEARCHFORMOVIES RUNS $SEARCH AGGREGATION
  returns movies array
  ---------------------------------------------------------*/
  async vectorSearch(embeddedSearchTerms) {
    const movies = await db.collection("movies")
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
  async vectorSearchAdvanced(embeddedSearchTerms, data) {
    const collection = db.collection("movies");
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

}