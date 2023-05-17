
export interface DetectedObject {
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    score: number
};

export interface IObjectDetector {
    initialize: () => Promise<void>
    detectObjects: (image: HTMLImageElement | ImageData) => Promise<DetectedObject[]>
};