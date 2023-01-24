import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import Header from "./Header";
import Grid from "./Grid/Grid";
import Thumb from "./Thumb/Thumb";
import Filter from "./Filter/Filter";

const Home = () => {
  // INSERT YOUR CREATED MOVIE ENDPOINTS

  const MOVIES_ENDPOINT_FILTERED =
    "https://us-east-1.aws.data.mongodb-api.com/app/atlassearchmovies-rsyxh/endpoint/moviesByPage";

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCodeBlock, setShowCodeBlock] = useState(false);
  const [dateStart, setDateStart] = useState(new Date(1970, 12, 1));
  const [dateEnd, setDateEnd] = useState(new Date(2022, 1, 4));
  const [genre, setGenre] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [showNeedEndpointMessage, setShowNeedEndpointMessage] = useState(false);

  const fetchMovies = async (searchTerm) => {
    console.log("HITTING FETCH MOVIES API");
    console.log("SEARCHTERM: ", searchTerm);

    let GET_MOVIES_ENDPOINT = MOVIES_ENDPOINT_FILTERED;

    try {
      let data = {
        searchTerm: searchTerm,
        start: dateStart,
        end: dateEnd,
        genre: genre,
        rating: sliderValue,
      };
      console.log("GENRES: ", genre);

      axios.post(GET_MOVIES_ENDPOINT, data).then((res) => {
        console.log(res.data);
        setMovies(res.data.results);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!submitted) return;
    if (MOVIES_ENDPOINT_FILTERED === "") {
      setShowNeedEndpointMessage(true);
      return;
    }

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
        showCodeBlock={showCodeBlock}
        setShowCodeBlock={setShowCodeBlock}
        setMovies={setMovies}
        setSubmitted={setSubmitted}
      />
      <div className="container">
        <Filter
          dateStart={dateStart}
          dateEnd={dateEnd}
          setDateStart={setDateStart}
          setDateEnd={setDateEnd}
          genre={genre}
          setGenre={setGenre}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          setSubmitted={setSubmitted}
          searchTerm={searchTerm}
          showCodeBlock={showCodeBlock}
          setShowCodeBlock={setShowCodeBlock}
        />

        {showNeedEndpointMessage ? (
          <div className="needEndpoint">Build Endpoint S'il Vous Plaît</div>
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

// const MOVIES_ENDPOINT =
//   "https://us-east-1.aws.data.mongodb-api.com/app/netflixclone-xwaaq/endpoint/movies";

// const MOVIES_ENDPOINT_FILTERED =
//   "https://us-east-1.aws.data.mongodb-api.com/app/netflixclone-xwaaq/endpoint/moviesFiltered";

// const MOVIES_ENDPOINT_ADVANCED =
//   "https://us-east-1.aws.data.mongodb-api.com/app/netflixclone-xwaaq/endpoint/getMoviesAdvanced";

// endpoint =
//   MOVIES_ENDPOINT_ADVANCED +
//   `?arg=${searchTerm}&start=${dateStart}&end=${dateEnd}&genre=${genre.value}&rating=${sliderValue}`;
