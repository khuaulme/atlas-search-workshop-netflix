import React from "react";

import { Wrapper, Content, Image, ScoreBadge } from "./Thumb.styles";

const Thumb = ({ movie, image, movieID, clickable }) => {
  console.log("rendeering thumbs");
  const score = movie.score.toString().slice(0, 5);

  let existingHighlights = false;

  let plot = movie.fullplot;
  if (movie.highlights) {
    existingHighlights = true;
    plot = buildPlotHighlights(movie.highlights);
  }
  const rating = movie.imdb.rating;

  return (
    <Wrapper>
      <Content>
        <h2>{movie.title}</h2>
        <Image src={image} alt="movie-thumb" />
        <ScoreBadge>Score: {score}</ScoreBadge>
        <h3>Year: {movie.year}</h3>
        <h3>Rating: {rating}</h3>
        {existingHighlights ? (
          <h4 dangerouslySetInnerHTML={{ __html: plot }}></h4>
        ) : (
          <h4>{plot}</h4>
        )}
      </Content>
    </Wrapper>
  );
};

function buildPlotHighlights(highlights) {
  let highlightString = "";

  highlights.forEach((highlight) => {
    let texts = highlight.texts;
    texts.forEach((text) => {
      if (text.type === "hit")
        highlightString += `<span style="color:yellow; font-weight:bold;"> ${text.value} </span>`;
      else highlightString += text.value;
    });
  });

  return highlightString;
}

export default Thumb;
