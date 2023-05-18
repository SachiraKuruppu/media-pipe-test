import React, { useCallback, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Webcam from 'react-webcam';
import { IObjectDetector, TYPES, container } from '../../services';
import { DetectionMask } from '../detection-mask';
import { DetectedObject } from '../../services/object-detector';

function WebcamObjectDetector() {
  const [isDetectionStarted, setDetectionStarted] = useState(false);
  const [detectionMasks, setDetectionMasks] = useState<JSX.Element[]>([]);
  const webcamRef = useRef<Webcam>(null);

  const enableWebcam = () => {
    setDetectionStarted(true);
    handleStartDetection();
  };

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

  const handleStartDetection = useCallback(async () => {
    const objectDetector = container.get<IObjectDetector>(TYPES.IObjectDetector);
    await objectDetector.initialize('VIDEO');

    const makeDetections = async () => {
      if (webcamRef.current !== null && webcamRef.current.video !== null) {
        const detections = await objectDetector.detectObjectsInVideo(webcamRef.current?.video);
        console.log(detections);

        displayDetections(webcamRef.current.video.offsetLeft, webcamRef.current.video.offsetTop, 1, detections);
      }

      requestAnimationFrame(makeDetections);
    };

    await makeDetections();
  }, [webcamRef]);
  
  return (
    <div
      className="rounded border h-500 d-flex align-items-center justify-content-center"
      style={{
        height: "80vh"
      }}
    >
      {detectionMasks}
      <Webcam ref={webcamRef} />
      {!isDetectionStarted && (
        <Button onClick={enableWebcam}>Start Detection</Button>
      )}
    </div>
  );
}

export default WebcamObjectDetector;
