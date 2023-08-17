import { EventTopic } from "./EventTopic";

export class Bubble{
    events;
    constructor(){
        this.events = new EventTopic;
    }
}
const bubble = new Bubble();
export default bubble;