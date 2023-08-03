
import React from 'react';
import './Recommendations.css';

export default function Recommendations({ recommendations }) {
    if (!recommendations) {
      return <p>Loading recommendations...</p>;
    }
  
    const headers = {
      "lastSearch": "Psst, you were searching for these, would you like to see them again?",
      "mostFrequent": "You've been looking at these a lot, check these other ones",
      "posts": "Based on your recent posts...",
      "popularSearch": "Look at some of the outfits the other users are looking at, wanna check them out?"
    };
  
    return (
      <div className="recommendations">
        {Object.keys(recommendations).map(key => (
          <div className="key" key={key}>
            <h2>{headers[key] || key}</h2>
            {recommendations[key].map((photo, index) => (
              <div className='photo' key={index}>
                   <img src={photo.src.original} alt={photo.title} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
