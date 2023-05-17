import { injectable } from 'inversify';
import { DetectedObject, IObjectDetector } from './interfaces';
import { ObjectDetector, FilesetResolver } from '@mediapipe/tasks-vision';

@injectable()
export class EfficientNetLiteDetector implements IObjectDetector {
    private readonly runningMode = 'IMAGE';
    private objectDetector: ObjectDetector | undefined = undefined;

    public async initialize() {
        const visionFilesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        this.objectDetector = await ObjectDetector.createFromOptions(visionFilesetResolver, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/latest/efficientdet_lite0.tflite"
            },
            scoreThreshold: 0.3,
            runningMode: this.runningMode
        });
    }

    public async detectObjects(image: HTMLImageElement | ImageData): Promise<DetectedObject[]> {
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
}