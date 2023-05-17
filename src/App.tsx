import 'reflect-metadata';
import React, { MouseEvent, useState } from 'react';
import './App.css';
// import WebcamDisplay from './components/webcam';
import { IObjectDetector, TYPES, container } from './services';
import { DetectedObject } from './services/object-detector';
import { DetectionMask } from './components/detection-mask';

function App() {
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

  const handleClick = async (e: MouseEvent<HTMLImageElement>) => {
    const element = e.target as HTMLImageElement;
    const ratio = element.height / element.naturalHeight;

    const objectDetector = container.get<IObjectDetector>(TYPES.IObjectDetector);
    await objectDetector.initialize();
    
    const detections = await objectDetector.detectObjects(element);
    console.log(detections);

    displayDetections(element.x, element.y, ratio, detections);
  };

  return (
    <div className="container my-5">
      {detectionMasks}

      <img src="./turning-left-into-a-side-road.jpg" alt="" onClick={handleClick} />
      {/* <WebcamDisplay /> */}
    </div>
  );
}

export default App;
