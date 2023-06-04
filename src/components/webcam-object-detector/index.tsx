import React, {useRef, useState, useEffect} from 'react';
import Webcam from 'react-webcam';
import { DetectedObject, IObjectDetector, Provider, TYPES, container } from '../../services';
import {Button} from "react-bootstrap";

interface WebcamObjectDetectorProps {
  onDetect: (offsetX: number, offsetY: number, ratio: number, detections: DetectedObject[]) => void;
}

function WebcamObjectDetector({ onDetect }: WebcamObjectDetectorProps) {
  const [isDetectionStarted, setDetectionStarted] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const startDetection = () => {
    console.log('Mount WebcamObjectDetector');
    const objectDetectorProvider = container.get<Provider<IObjectDetector>>(TYPES.IObjectDetector);
    objectDetectorProvider().then(objectDetector => {
      
      const makeDetections = () => {
        if (
          webcamRef.current !== null && 
          webcamRef.current.video !== null
        ) {
          console.log('Making detection');
          const detections = objectDetector.detectObjects(webcamRef.current?.video);
          console.log(detections);
    
          onDetect(webcamRef.current.video.offsetLeft, webcamRef.current.video.offsetTop, 1, detections);
          animationRef.current = requestAnimationFrame(makeDetections);
        }
      };

      makeDetections();
    });
  };

  const stopDetection = () => {
    if (animationRef.current === undefined) {
      return;
    }
    cancelAnimationFrame(animationRef.current);
  };

  const toggleDetection = () => {
    setDetectionStarted(!isDetectionStarted);
  }

  useEffect(() => {
    if (!isDetectionStarted) {
      stopDetection();
      onDetect(0, 0, 1, []);
    }
  }, [isDetectionStarted, onDetect]);

  const enabledDetectionView = (
      <>
        <Webcam ref={webcamRef} onUserMedia={startDetection} />
        <Button onClick={toggleDetection}>Stop Detection</Button>
      </>
  );

  const disabledDetectionView = (
      <>
        <Button onClick={toggleDetection}>Start Detection</Button>
      </>
  );
  
  return (
      <>
        {isDetectionStarted ? enabledDetectionView : disabledDetectionView}
      </>
  );
}

export default WebcamObjectDetector;
