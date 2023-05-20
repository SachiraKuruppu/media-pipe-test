
export interface DetectedObject {
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    score: number
};

export interface IObjectDetector {
    detectObjects: (imageOrVideo: HTMLImageElement | HTMLVideoElement) => Promise<DetectedObject[]>
};