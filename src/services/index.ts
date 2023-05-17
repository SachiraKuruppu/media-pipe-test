import { Container } from "inversify";
import { IObjectDetector, EfficientNetLiteDetector } from "./object-detector";

const TYPES = {
    IObjectDetector: Symbol.for("IObjectDetector").toString()
};

const container = new Container();
container.bind<IObjectDetector>(TYPES.IObjectDetector).to(EfficientNetLiteDetector);

export { 
    container, 
    TYPES,
    type IObjectDetector,
};