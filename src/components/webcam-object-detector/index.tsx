import React, { useCallback, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Webcam from 'react-webcam';
import { IObjectDetector, TYPES, container } from '../../services';
import { DetectedObject } from '../../services/object-detector';

interface WebcamObjectDetectorProps {
  onDetect: (offsetX: number, offsetY: number, ratio: number, detections: DetectedObject[]) => void;
};

function WebcamObjectDetector({ onDetect }: WebcamObjectDetectorProps) {
  const [isDetectionStarted, setDetectionStarted] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleStartDetection = useCallback(async () => {
    const objectDetector = container.get<IObjectDetector>(TYPES.IObjectDetector);
    await objectDetector.initialize('VIDEO');

    const makeDetections = async () => {
      if (webcamRef.current !== null && webcamRef.current.video !== null) {
        const detections = await objectDetector.detectObjectsInVideo(webcamRef.current?.video);
        console.log(detections);

        onDetect(webcamRef.current.video.offsetLeft, webcamRef.current.video.offsetTop, 1, detections);
      }

      requestAnimationFrame(makeDetections);
    };

    await makeDetections();
  }, [webcamRef, onDetect]);

  const handleDetectionToggle = useCallback(() => {
    setDetectionStarted(!isDetectionStarted);

    if (!isDetectionStarted) {
      handleStartDetection();
    }
    else {
      onDetect(0, 0, 0, []);
    }
  }, [handleStartDetection, isDetectionStarted, onDetect]);
  
  return (
    <div
      className="rounded border h-500 d-flex flex-column align-items-center justify-content-center"
      style={{
        height: "80vh"
      }}
    >
      <Webcam ref={webcamRef} />
      <Button onClick={handleDetectionToggle}>{isDetectionStarted ? 'Stop Detection' : 'Start Detection'}</Button>
    </div>
  );
}

export default WebcamObjectDetector;
