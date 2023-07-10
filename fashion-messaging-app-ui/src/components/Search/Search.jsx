import React, { useState } from "react";
import "./Search.css";
import { FaSearch} from "react-icons/fa";

export default function Search() {
  return (
    <div className="searchBtn">
      <form>
        <input
          className="searchInput"
          type="text"
          placeholder="Search for outfits!"   
        />
        <button type="submit" className="submitBtn"><FaSearch/></button>
      </form>
    </div>
  );
}
