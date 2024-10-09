import { Day } from "../enums";
import { Slot } from "./slot.model";

export class EachDayInfo {
    day: Day;
    isOpen: Boolean;
    timings: Slot[];

    constructor(day: Day, isOpen: boolean, timings: Slot[]){
        this.day = day;
        this.isOpen = isOpen;
        this.timings = timings;
    }
}