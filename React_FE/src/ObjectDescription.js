import React from "react";
import { useLocation } from "react-router-dom";

function ObjectDescription() {
  const location = useLocation();
  const objectNumber = location.state?.objectNumber || "No object number";
  const score = location.state?.score || "No score";
  console.log("objectNumber: ", objectNumber);
  console.log("score: ", score);
  return (
    <div>
      <h1>New Page</h1>
      <label>Object Number:</label>
      <input type="text" value={objectNumber} readOnly />
    </div>
  );
}

export default ObjectDescription;
