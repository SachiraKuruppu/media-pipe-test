import 'reflect-metadata';
import React, { useCallback, useState } from 'react';
import './App.css';
import { DetectedObject } from './services';
import { DetectionMask } from './components/detection-mask';
import WebcamObjectDetector from './components/webcam-object-detector';

function App() {
  const [detectionMasks, setDetectionMasks] = useState<JSX.Element[]>([]);

  const displayDetections = useCallback((baseX: number, baseY: number, ratio: number, detections: DetectedObject[]) => {
    const masks = detections.map((detection, index) =>
      <DetectionMask 
        x={baseX + detection.x * ratio}
        y={baseY + detection.y * ratio}
        width={detection.width * ratio}
        height={detection.height * ratio}
        name={detection.name}
        score={detection.score}
        key={index}
      />
    );

    setDetectionMasks(masks);
  }, []);

  return (
    <div 
      className="container my-5 rounded border d-flex flex-column align-items-center justify-content-center"
      style={{ 'height': '80vh' }}
    >
      {detectionMasks}
      <WebcamObjectDetector onDetect={displayDetections} />
    </div>
  );
}

export default App;
