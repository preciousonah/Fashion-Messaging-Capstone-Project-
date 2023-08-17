
import React, { useState } from "react";
import "./Search.css";
import { FaSearch} from "react-icons/fa";

export default function Search({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInput = event => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="searchBtn">
       <form className= "search-form" onSubmit={handleSubmit}>
      <input
       className="searchInput"
        type="text"
        value={searchQuery}
        onChange={handleSearchInput}
        placeholder="Search your outfits!"
      />
      <button type="submit"className="submitBtn"><FaSearch/></button>
    </form>
    </div>
  );
}
