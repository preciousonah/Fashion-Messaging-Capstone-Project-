
import "./App.css";
import { useEffect, useState } from "react";
import { UserContext } from './UserContext';
import Main from './components/Main/Main'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Homepage from './components/Homepage/Homepage';
import Recommendations from './components/Recommendations/Recommendations';
import RequireLogin from './RequireLogin';
import ClipLoader from "react-spinners/ClipLoader";
import SavedImages from './components/SavedImages/SavedImages';


export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]); 

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

  useEffect(() => { 
    fetch('http://localhost:3000/recommendations', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setRecommendations(data))
      .catch(error => console.error('Error fetching recommendations:', error));
  }, [searchQuery]); 

  const handleSearch = query => {
    setSearchQuery(query);
  };


  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);
  
  if (loading) {
    return (
      <div className="app">
        <ClipLoader
        color={"blue"}
        loading={loading}
        size={30}
      />
      </div>
    );
  } 

  return (
    <div className="app">
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <RequireLogin><Homepage photos={photos} handleSearch={handleSearch} noResults={noResults} /></RequireLogin> } />
            <Route path="/post" element={ <RequireLogin><Main /></RequireLogin> } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/recommendations" element={ <RequireLogin><Recommendations recommendations= {recommendations}/></RequireLogin> } />
            <Route path="/saved-images" element={ <RequireLogin><SavedImages /></RequireLogin> } />            
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}