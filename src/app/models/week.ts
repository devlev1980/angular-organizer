import * as moment from 'moment';

export interface IWeek {
  days: IDay[];
}
interface IDay {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
}
