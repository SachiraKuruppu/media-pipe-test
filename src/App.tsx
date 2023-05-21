import 'reflect-metadata';
import React, { useState } from 'react';
import './App.css';
import { DetectedObject } from './services';
import { DetectionMask } from './components/detection-mask';
import WebcamObjectDetector from './components/webcam-object-detector';
import { Button } from 'react-bootstrap';

function App() {
  const [isDetectionStarted, setDetectionStarted] = useState(false);
  const [detectionMasks, setDetectionMasks] = useState<JSX.Element[]>([]);

  const displayDetections = (baseX: number, baseY: number, ratio: number, detections: DetectedObject[]) => {
    const masks = detections.map(detection => 
      <DetectionMask 
        x={baseX + detection.x * ratio}
        y={baseY + detection.y * ratio}
        width={detection.width * ratio}
        height={detection.height * ratio}
        name={detection.name}
        score={detection.score}
      />
    );

    setDetectionMasks(masks);
  };

  const toggleDetection = () => {
    setDetectionStarted(!isDetectionStarted);
  }

  const enabledDetectionView = (
    <>
      {detectionMasks}
      <WebcamObjectDetector onDetect={displayDetections} />
      <Button onClick={toggleDetection}>Stop Detection</Button>
    </>
  );

  const disabledDetectionView = (
    <>
      <Button onClick={toggleDetection}>Start Detection</Button>
    </>
  );

  return (
    <div 
      className="container my-5 rounded border d-flex flex-column align-items-center justify-content-center"
      style={{ 'height': '80vh' }}
    >
      {isDetectionStarted ? enabledDetectionView : disabledDetectionView}
    </div>
  );
}

export default App;
