
import * as React from "react";
import "./FashionItems.css";

export default function Outfits({ photos, noResults }) {
    return (
      <div className="photo">
        {noResults ? <p>No results</p> : 
          photos.map(photo => (
            <img key={photo.id} src={photo.src.original} alt="" />
          ))
        }
      </div>
    );
}
