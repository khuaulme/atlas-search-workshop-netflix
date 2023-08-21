import React from "react";
import searchIcon from "../../images/search-icon.svg";

import { Wrapper, Content } from "./SearchBar.styles";

const SearchBar = ({ searchTerm, setSearchTerm, setSubmitted }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Wrapper>
      <Content>
        <img src={searchIcon} alt="searchicon" />
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
        </form>
      </Content>
    </Wrapper>
  );
};

export default SearchBar;
