import React from "react";
import { useLocation } from "react-router-dom";
import "./ObjectDescription.css"; // Import the CSS file

function ObjectDescription() {
  const location = useLocation();
  const objectNumber = location.state?.objectNumber || "No object number";
  const score = location.state?.score || "No score";

  return (
    <div className="object-description-container">
      <h1>Object Description</h1>
      <div className="object-details">
        <div className="image-container">
          <img src="https://placekitten.com/400/300" alt="Object" />
        </div>
        <div className="text-container">
          <label>Object Number:</label>
          <input type="text" value={objectNumber} readOnly />
          <label>Score:</label>
          <input type="text" value={score} readOnly />
        </div>
      </div>
    </div>
  );
}

export default ObjectDescription;
