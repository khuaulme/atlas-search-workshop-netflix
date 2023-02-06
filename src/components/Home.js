import React, { useState, useEffect } from "react";
import Header from "./Header";
import Grid from "./Grid/Grid";
import Thumb from "./Thumb/Thumb";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showNeedEndpointMessage, setShowNeedEndpointMessage] = useState(false);

  // INSERT YOUR CREATED MOVIE ENDPOINT
  const MOVIES_ENDPOINT =
    "https://eu-west-2.aws.data.mongodb-api.com/app/netflixclone-toyzx/endpoint/movies";

  const fetchMovies = async (searchTerm) => {
    console.log("HITTING FETCH MOVIES API");
    console.log("SEARCHTERM: ", searchTerm);

    try {
      // BASIC SEARCH - append searchTerm as URL parameter to GET endpoint
      const endpoint = MOVIES_ENDPOINT + "?searchTerm=" + searchTerm;
      const returnedMovies = await (await fetch(endpoint)).json();
      setMovies(returnedMovies);
      console.log("MOVIES: ", returnedMovies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!submitted) return;
    if (MOVIES_ENDPOINT === "") {
      setShowNeedEndpointMessage(true);
      return;
    }
    setShowNeedEndpointMessage(false);
    fetchMovies(searchTerm);
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  return (
    <>
      {" "}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setMovies={setMovies}
        setSubmitted={setSubmitted}
      />
      <div className="container">
        {showNeedEndpointMessage ? (
          <div className="needEndpoint">Build Movie 📽️ Endpoint Please 🥺</div>
        ) : (
          <Grid header={searchTerm ? null : "Movie Search Results"}>
            {movies.map((movie) => (
              <Thumb
                key={movie._id}
                movie={movie}
                clickable
                movieID={movie._id}
                image={
                  movie.poster ? movie.poster : "http://bit.ly/AtlasMoviePoster"
                }
              ></Thumb>
            ))}
          </Grid>
        )}
      </div>{" "}
    </>
  );
};

export default Home;
