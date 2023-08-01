
import "./App.css";
import { useEffect, useState } from "react";
import { UserContext } from './UserContext';
import Main from './components/Main/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Homepage from './components/Homepage/Homepage';

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
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/photos?search=${searchQuery}`, {
      credentials: 'include', 
    })
      .then(response => response.json())
      .then(photos => {
        setLoading(false);
        setPhotos(photos);
        setNoResults(photos.length === 0);
      })
      .catch(error => {
        console.error("Error fetching photos:", error);
        setLoading(false);
      });
  
    localStorage.setItem('user', JSON.stringify(user));
  }, [searchQuery]);

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
          <Route path="/" element={ <Homepage photos={photos} handleSearch={handleSearch} noResults={noResults}  /> } />
          <Route path="/post" element={ <Main /> } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </BrowserRouter>
      </UserContext.Provider>

    </div>
  );
}