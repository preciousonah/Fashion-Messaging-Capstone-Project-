
import * as React from "react";
import "./FashionItems.css";

export default function Outfits({ photos, noResults }) {
  return (
    <div className="photo-grid">
      {noResults ? <p>No results</p> : 
        photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <div className="photo-wrap">
              <img className= "photo-each"src={photo.src.original} alt="No pictures to show:(" />
              <a href={photo.photographer_url} className="photo-photographer">{photo.photographer}</a>
            </div>
            <p className="photo-alt">{photo.alt}</p>
          </div>
        ))
      }
    </div>
  );
}
