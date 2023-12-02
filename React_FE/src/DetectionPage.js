import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";

import "./DetectionPage.css";

function DetectionPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [, setNet] = useState(null);

  const detect = useCallback(
    async (net) => {
      // Check data is available
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Make Detections
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeBilinear(img, [640, 480]);
        const casted = resized.cast("int32");
        const expanded = casted.expandDims(0);
        const obj = await net.executeAsync(expanded);

        const boxes = await obj[6].array();
        const classes = await obj[4].array();
        const scores = await obj[3].array();

        // Main label detected
        const confidence = 0.9;
        if (scores[0][0] > confidence) {
          const objectNumber = classes[0][0];
          const score = scores[0][0];

          navigate("/ObjectDescription", { state: { objectNumber, score } });
        }

        const canvas = canvasRef.current;

        if (canvas) {
          // Draw mesh
          const ctx = canvas.getContext("2d");

          if (ctx) {
            requestAnimationFrame(() => {
              drawRect(
                boxes[0],
                classes[0],
                scores[0],
                0.7, //confidence
                videoWidth,
                videoHeight,
                ctx
              );
            });
          } else {
            console.error("Canvas context not available");
          }
        } else {
          console.error("Canvas element not available");
        }

        tf.dispose(img);
        tf.dispose(resized);
        tf.dispose(casted);
        tf.dispose(expanded);
        tf.dispose(obj);
      }
    },
    [navigate]
  );

  const runCoco = useCallback(async () => {
    // Load network
    const loadedNet = await tf.loadGraphModel(
      "https://musuemtfod.s3.us-south.cloud-object-storage.appdomain.cloud/model.json"
    );
    setNet(loadedNet);

    // Loop and detect hands
    const intervalId = setInterval(() => {
      detect(loadedNet);
    }, 16.7);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [detect]);

  useEffect(() => {
    runCoco();
  }, [runCoco]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Museum</h1>
        <div className="Webcam-container">
          <Webcam ref={webcamRef} muted={true} className="Webcam" />
          <canvas ref={canvasRef} className="Canvas" />
        </div>
      </header>
    </div>
  );
}

export default DetectionPage;
