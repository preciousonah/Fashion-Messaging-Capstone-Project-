
import "./App.css";
import { useEffect, useState } from "react";
import { createClient } from "pexels";
import { UserContext } from './UserContext';
import Main from './components/Main/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Homepage from './components/Homepage/Homepage';


const API_KEY = "06ZcwjgbmJBM8T2TxLUZ5iwdXXGxiAgz0Z018b7QPKwR1ExipkFjaAuw";
const clientAPI = createClient(API_KEY);
const defaultQuery = "Fashion";
const PHOTOS = 100;

export default function App() {
  
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    return null;
});

  const updateUser = (newUser) => {
    setUser(newUser);
  };
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {

    setLoading(true)
    
    const query = searchQuery || defaultQuery;
    clientAPI.photos
      .search({ query, per_page: PHOTOS })
      .then(response => {
        setPhotos(response.photos);
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching photos:", error);
        setLoading(false);
      });
      localStorage.setItem('user', JSON.stringify(user));

  },[searchQuery]);

  const handleSearch = query => {
    setSearchQuery(query);
  };


  if (loading) {
    return (
      <div className="app">
        <p>Loading...</p> 
      </div>
    );
  }


  return (
    <div className="app">
      <UserContext.Provider value={{ user, updateUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Homepage photos={photos} handleSearch={handleSearch} /> } />
          <Route path="/post" element={ <Main /> } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </BrowserRouter>
      </UserContext.Provider>

    </div>
  );
}