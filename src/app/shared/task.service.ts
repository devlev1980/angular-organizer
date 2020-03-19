import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ITask} from '../models/task';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IResponse} from '../models/response';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  static url = 'https://angular-organizer-e4356.firebaseio.com/tasks';

  constructor(private http: HttpClient) {
  }

  getAllTasksPerDay(date: moment.Moment): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${TaskService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map(key => ({...tasks[key], id: key}));
        })
      );
  }

  createTask(task: ITask): Observable<ITask> {
    return this.http.post<IResponse>(`${TaskService.url}/${task.date}.json`, task)
      .pipe(
        map((res) => {
          console.log('Response', res);
          return {...task, id: res.name};
        })
      );
  }

  removeTask(task: ITask): Observable<void> {
   return this.http.delete<void>(`${TaskService.url}/${task.date}/${task.id}.json`);
  }
}

// export interface ITask {
//   id: string;
//   title: string;
//   date: string;
// }
