// Import necessary dependencies
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DetectionPage from "./DetectionPage";
import ObjectDescription from "./ObjectDescription"; // Import your NewPage component
import "./App.css";

// Main component that sets up routes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DetectionPage />} />
        <Route path="/ObjectDescription" element={<ObjectDescription />} />
      </Routes>
    </Router>
  );
}

export default App;
