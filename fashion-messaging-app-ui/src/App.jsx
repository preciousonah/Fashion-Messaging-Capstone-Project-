import "./App.css";
import Search from "./components/Search/Search";
import Navbar from "./components/Navbar/Navbar";
import FashionItems from "./components/FashionItems/FashionItems";
import { useEffect, useState } from "react";
import { createClient } from "pexels";
import { UserContext } from './UserContext';
import Main from './components/Main/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';


const API_KEY = "06ZcwjgbmJBM8T2TxLUZ5iwdXXGxiAgz0Z018b7QPKwR1ExipkFjaAuw";
const clientAPI = createClient(API_KEY);
const defaultQuery = "Fashion";
const PHOTOS = 100;

export default function App() {
  
  const [user, setUser] = useState(() => {
    return null;
});

  const updateUser = (newUser) => {
    setUser(newUser);
  };
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
      localStorage.setItem('user', JSON.stringify(user));
  },[searchQuery]);

  const handleSearch = query => {
    setSearchQuery(query);
  };

  return (
    <div className="app">
        <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Main /> } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
      <div className="container">
      <Search onSearch={handleSearch} />
        <h1>Aesthetik.</h1>
        <Navbar />
      </div>
      <FashionItems photos={photos} />
    </div>
  );
}