
import * as React from "react";
import "./FashionItems.css";

export default function Outfits({ photos, noResults }) {
  const [savedImages, setSavedImages] = React.useState(new Set());

  const saveImage = async (imageUrl, imageId) => {
    try {
      const response = await fetch('http://localhost:3000/saved-images', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ imageUrl, imageId }), 
      });

      if (!response.ok) {
        throw new Error('Failed to save the image.');
      }
      const savedImage = await response.json();
      setSavedImages(prevSaved => new Set([...prevSaved, imageUrl]));

      return savedImage;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveClick = async (imageUrl, imageId) => {
    if (!savedImages.has(imageUrl)) {
      await saveImage(imageUrl, imageId);
    }
  };



  return (
    <div className="photo-grid">
      {noResults ? (
        <p>No results</p>
      ) : (
        photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <div className="photo-wrap">
              <img className="photo-each" src={photo.src.original} alt="No pictures to show:(" />
              <a href={photo.photographer_url} className="photo-photographer">{photo.photographer}</a>
          
              {savedImages.has(photo.src.original) ? (
                <div className="saved-label">Saved!</div>
              ) : (
               
                <button onClick={() => handleSaveClick(photo.src.original, photo.id)}>Save Image</button>

              )}
            </div>
            <p className="photo-alt">{photo.alt}</p>
          </div>
        ))
      )}
    </div>
  );
}
