import { DetectedObject, IObjectDetector } from './interfaces';
import { ObjectDetector, FilesetResolver } from '@mediapipe/tasks-vision';

type RunningMode = 'IMAGE' | 'VIDEO';

export class EfficientNetLiteDetector implements IObjectDetector {

    private constructor(
        private readonly objectDetector: ObjectDetector,
        private readonly runningMode: RunningMode,
    ) {}

    public static async create(runningMode: RunningMode) {
        const visionFilesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const objectDetector = await ObjectDetector.createFromOptions(visionFilesetResolver, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/latest/efficientdet_lite0.tflite"
            },
            scoreThreshold: 0.3,
            runningMode: runningMode
        });

        return new EfficientNetLiteDetector(objectDetector, runningMode);
    }

    public async detectObjects(imageOrVideo: HTMLImageElement | HTMLVideoElement): Promise<DetectedObject[]> {
        if (imageOrVideo instanceof HTMLImageElement) {
            return this.detectObjectsInImage(imageOrVideo);
        }

        return this.detectObjectsInVideo(imageOrVideo);
    }

    private async detectObjectsInImage(image: HTMLImageElement): Promise<DetectedObject[]> {
        if (this.runningMode !== 'IMAGE') {
            throw new Error('Wrong running mode. Set the running mode to IMAGE');
        }

        if (this.objectDetector === undefined) {
            return [];
        }

        const { detections } = this.objectDetector.detect(image);

        return detections.filter(value => value.boundingBox !== undefined).map<DetectedObject>(detection => ({
            x: detection.boundingBox?.originX as number,
            y: detection.boundingBox?.originY as number,
            width: detection.boundingBox?.width as number,
            height: detection.boundingBox?.height as number,
            name: detection.categories[0].categoryName,
            score: detection.categories[0].score
        }));
    }

    private async detectObjectsInVideo(video: HTMLVideoElement): Promise<DetectedObject[]> {
        if (this.runningMode !== 'VIDEO') {
            throw new Error('Wrong running mode. Set the running mode to VIDEO');
        }

        if (this.objectDetector === undefined) {
            return [];
        }

        const { detections } = this.objectDetector.detectForVideo(video, performance.now());

        return detections.filter(value => value.boundingBox !== undefined).map<DetectedObject>(detection => ({
            x: detection.boundingBox?.originX as number,
            y: detection.boundingBox?.originY as number,
            width: detection.boundingBox?.width as number,
            height: detection.boundingBox?.height as number,
            name: detection.categories[0].categoryName,
            score: detection.categories[0].score
        }));
    }
}