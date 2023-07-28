
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
const PHOTOS = 1;

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

  const query = searchQuery || defaultQuery;
  clientAPI.photos
    .search({ query, per_page: PHOTOS })
    .then(async response => { 

      var myHeaders = new Headers();
      myHeaders.append("x-api-key", "4d552e9f30522b1dec7c712f83c67c235be86e25ec14b4ba3493383ec7b81d3f");

      let fetchPromises = await Promise.all(response.photos.map(async photo => { 
        var formdata = new FormData();
        formdata.append("image_url", photo.src.original);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
        };

        try {
          const fetchResponse = await fetch('https://cloudapi.lykdat.com/v1/detection/items', requestOptions);
          const result = await fetchResponse.json();

          if (result.data.detected_items.length !== 0) {
            return photo;
          }
          
        } catch (error) {
          console.error('error', error);
        }
      }));

      const fashionPhotos = fetchPromises.filter(photo => photo !== undefined);
      setPhotos(fashionPhotos);
      setNoResults(fashionPhotos.length === 0);
      setLoading(false);
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