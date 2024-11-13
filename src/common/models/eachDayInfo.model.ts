import { Day } from '../enums';
import { Timing } from './timing.model';

export class EachDayInfo {
  day: Day;
  timings: Timing[];

  constructor(day: Day, timings: Timing[]) {
    this.day = day;
    this.timings = timings;
  }
}
