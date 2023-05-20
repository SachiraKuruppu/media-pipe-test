import { Container } from "inversify";
import { IObjectDetector, DetectedObject, EfficientNetLiteDetector } from "./object-detector";

type Provider<T> = () => Promise<T>;

const TYPES = {
    IObjectDetector: Symbol.for("IObjectDetector").toString()
};

const container = new Container();
container.bind<Provider<IObjectDetector>>(TYPES.IObjectDetector).toProvider<IObjectDetector>(context => {
    return () => EfficientNetLiteDetector.create('VIDEO');
});

export { 
    container,
    TYPES,
    type Provider,
    type IObjectDetector,
    type DetectedObject,
};