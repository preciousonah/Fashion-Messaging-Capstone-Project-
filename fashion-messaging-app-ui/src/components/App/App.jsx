import "./App.css";
import Search from "../Search/Search";
import Navbar from "../Navbar/Navbar";
import FashionItems from "../FashionItems/FashionItems";
import { useEffect, useState } from "react";
import { createClient } from "pexels";

const API_KEY = "06ZcwjgbmJBM8T2TxLUZ5iwdXXGxiAgz0Z018b7QPKwR1ExipkFjaAuw";
const clientAPI = createClient(API_KEY);
const defaultQuery = "Fashion";
const PHOTOS = 100;

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchQuery || defaultQuery;
    clientAPI.photos
      .search({ query, per_page: PHOTOS })
      .then(response => {
        setPhotos(response.photos);
      })
      .catch(error => {
        console.error("Error fetching photos:", error);
      });
  }, [searchQuery]);

  const handleSearch = query => {
    setSearchQuery(query);
  };

  return (
    <div>
      <div className="container">
      <Search onSearch={handleSearch} />
        <h1>Aesthetik.</h1>
        <Navbar />
      </div>
      <FashionItems photos={photos} />
    </div>
  );
}
