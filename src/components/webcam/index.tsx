import React, { useCallback, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Webcam from 'react-webcam';

interface WebcamDisplayProps {
  onFrameCapture?: (data: Blob) => void
};

function WebcamDisplay({ onFrameCapture }: WebcamDisplayProps) {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  const enableWebcam = () => {
    setIsWebcamEnabled(true);
    handleStartCaptureClick();
  };

  const handleDataAvailable = useCallback(
    ({ data }: { data: Blob }) => {
      if (onFrameCapture === undefined) {
        return;
      }
      
      if (data.size > 0) {
        onFrameCapture(data);
      }
    },
    [onFrameCapture]
  );

  const handleStartCaptureClick = useCallback(() => {
    if (!webcamRef?.current?.stream) {
        return;
    }

    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, mediaRecorderRef, handleDataAvailable]);
  
  return (
    <div
      className="rounded border h-500 d-flex align-items-center justify-content-center"
      style={{
        height: "80vh"
      }}
    >
      {isWebcamEnabled && (<Webcam ref={webcamRef} />)}
      {!isWebcamEnabled && (
        <Button onClick={enableWebcam}>Enable Webcam</Button>
      )}
    </div>
  );
}

export default WebcamDisplay;
