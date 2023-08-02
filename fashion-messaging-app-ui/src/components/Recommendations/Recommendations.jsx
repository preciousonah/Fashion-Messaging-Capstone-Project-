
import * as React from "react";

export default function Recommendations({ recommendations }) {
  return (
    <div className="photo">
      <h1>Welcome to the recommendations page!!</h1>
      <h2>Recommendations</h2>
      {recommendations.length === 0 ? (
        <p>No recommendations at the moment.</p>
      ) : (
        recommendations.map(photo => (
          <div key={photo.id}>
            <img src={photo.src.original} alt="" />
            <p>{`Source: ${photo.source}`}</p>
          </div>
        ))
      )}
    </div>
  );
}
