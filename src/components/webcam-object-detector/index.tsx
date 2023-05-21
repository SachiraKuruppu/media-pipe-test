import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { DetectedObject, IObjectDetector, Provider, TYPES, container } from '../../services';

interface WebcamObjectDetectorProps {
  onDetect: (offsetX: number, offsetY: number, ratio: number, detections: DetectedObject[]) => void;
};

function WebcamObjectDetector({ onDetect }: WebcamObjectDetectorProps) {
  const webcamRef = useRef<Webcam>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const objectDetectorProvider = container.get<Provider<IObjectDetector>>(TYPES.IObjectDetector);
    objectDetectorProvider().then(objectDetector => {
      
      const makeDetections = async () => {
        if (
          webcamRef.current !== null && 
          webcamRef.current.video !== null
        ) {
          const detections = await objectDetector.detectObjects(webcamRef.current?.video);
          console.log(detections);
    
          onDetect(webcamRef.current.video.offsetLeft, webcamRef.current.video.offsetTop, 1, detections);
          animationRef.current = requestAnimationFrame(makeDetections);
        }
      };

      makeDetections();
    });

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onDetect]);
  
  return (<Webcam ref={webcamRef} />);
}

export default WebcamObjectDetector;
