
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
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "c8dd1e873a6bde14651aa42ee44752f41c8da53b0aa4bfb5205d25805826f628");
    
    var formdata = new FormData();
    formdata.append("image_url", "https://cdn.shopify.com/s/files/1/0266/6276/4597/products/300936541TANGERINE_2_1024x1024.jpg?v=1682513958");
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
    };
    
    fetch('https://cloudapi.lykdat.com/v1/detection/items', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  

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