
import * as React from "react";

export default function Recommendations( { recommendations } ) {
    const { lastSearchPhotos, mostFrequentSearchPhotos } = recommendations;
  
    return (
      <div className= "photo" >
        <h2>Recommendations</h2>
        <h3>Last Search Photos</h3>
        {lastSearchPhotos.length === 0 ? (
          <p>No last search photos at the moment.</p>
        ) : (
          lastSearchPhotos.map(photo => (
            <div key={photo.id}>
              <img src={photo.src.original} alt="" />
            </div>
          ))
        )}
        <h3>Most Frequent Search Photos</h3>
        {mostFrequentSearchPhotos.length === 0 ? (
          <p>No most frequent search photos at the moment.</p>
        ) : (
          mostFrequentSearchPhotos.map(photo => (
            <div key={photo.id}>
              <img src={photo.src.original} alt="" />
            </div>
          ))
        )}
      </div>
    );
  }
  