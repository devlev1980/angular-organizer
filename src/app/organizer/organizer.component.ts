import {Component, OnInit} from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../shared/task.service';
import {ITask} from '../models/task';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  taskForm: FormGroup;
  tasks: ITask[] = [];

  constructor(private dateService: DateService, private taskService: TaskService) {
  }

  ngOnInit() {
    this.dateService.date.pipe(
      switchMap(value => this.taskService.getAllTasksPerDay(value))
    ).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.taskForm = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    // const {title} = this.taskForm;
    // console.log(title);
    // console.log(this.taskForm.value);
    const task: ITask = {
      id: '',
      title: this.taskForm.get('title').value,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.taskService.createTask(task).subscribe((result) => {
      console.log('New Task', result);
      this.tasks.push(result);
      this.taskForm.reset();
    }, error => console.error(error));
  }


  onRemoveTask(task: ITask) {
    this.taskService.removeTask(task).subscribe(result => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }, error => {
      console.error(error);
    });
  }
}
