import React, { useState } from "react";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

const CheckboxGenres = ({ genre, setGenre, showCodeBlock }) => {
  const movieGenresArray = [
    "Drama",
    "Comedy",
    "Romance",
    "Sport",
    "Action",
    "Adventure",
    "Horror",
    "Family",
    "Mystery",
  ];

  let genreObject = {
    text: {
      query: genre,
      path: "genres",
    },
  };
  let genreString = JSON.stringify(genreObject, null, 2);

  const [checkedState, setCheckedState] = useState(
    new Array(movieGenresArray.length).fill(false)
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
    let checkedGenres = [];
    for (let i = 0; i < movieGenresArray.length; i++) {
      if (updatedCheckedState[i] === true) {
        checkedGenres.push(movieGenresArray[i]);
      }
    }
    setGenre(checkedGenres);

    console.log(checkedGenres);
  };
  return (
    <div className="checkbox-container">
      <h3 className="">GENRES</h3>
      <Wrapper>
        <ul className="genres-list">
          {movieGenresArray.map((name, index) => {
            return (
              <div className="genre" key={index}>
                <input
                  type="checkbox"
                  id={`custom-checkbox-${index}`}
                  name={name}
                  value={name}
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index)}
                  style={{ opacity: 0, position: "absolute" }}
                />
                <div onClick={() => handleOnChange(index)}>
                  {checkedState[index] ? <div>✅</div> : <div>☐</div>}
                </div>

                <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
              </div>
            );
          })}
        </ul>
      </Wrapper>
      {showCodeBlock && (
        <CodeBlock>
          <SyntaxHighlighter language="javascript" style={nightOwl}>
            {genreString}
          </SyntaxHighlighter>
        </CodeBlock>
      )}
    </div>
  );
};

export default CheckboxGenres;

const Wrapper = styled.div`
  box-sizing: border-box;
  color: white;
  font-family: "Lexend Deca", sans-serif;
  font-weight: 300;
  font-size: 1.5rem;

  .genre {
    display: flex;
    align-items: center;
  }

  input {
    cursor: pointer;
    height: 28px;
    width: 28px;
    border-radius: 5px;
  }

  label {
    cursor: pointer;
    margin-left: 16px;
  }
`;
const CodeBlock = styled.div`
  margin: 8px;
  border: 2px solid #40158a;
`;
