
import React, { useState, useEffect } from 'react';
import "./SavedImages.css";
import Navbar from '../Navbar/Navbar'; 

function SavedImages() {
  const [savedImages, setSavedImages] = useState([]);

  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        const response = await fetch('http://localhost:3000/saved-images', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch saved images.');
        }

        const data = await response.json();
        setSavedImages(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedImages();
  }, []);

  const handleUnsave = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:3000/saved-images/${imageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to unsave image.');
      }
      setSavedImages(prevImages => prevImages.filter(image => image.imageId !== imageId));


    } catch (error) {
      console.error(error);
    }
  };

return (
  <div>
    <Navbar />
    <div className="saved-images-grid">
      {savedImages.map(image => (
        <div key={image.id} className="saved-images-item">
          <img src={image.imageUrl} alt="Saved Fashion Item" />
          <button onClick={() => handleUnsave(image.imageId)}>Unsave</button>
        </div>
      ))}
    </div>
  </div>
);
}

export default SavedImages;
