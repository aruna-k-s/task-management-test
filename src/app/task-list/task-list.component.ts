import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { ApiServiceService } from '../api-service.service';
import { CreateUpdateTaskComponent } from '../create-update-task/create-update-task.component';
import { concatMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  taskList: any = [];
  taskListLoading: boolean = false;
  searchSubject = new Subject();
  filteredTaskList: any = [];
  highPriorityTaskList: any = [];
  medPriorityTaskList: any = [];
  lowPriorityTaskList: any = [];
  priorityFilterEnabled = false;
  lowPriorityTaskListLoading: boolean;
  highPriorityTaskListLoading: boolean;
  midPriorityTaskListLoading: boolean;
  tasksortByTime = false;
  tasksortByDueTime = false;
  tasksortByPriority = false;
  highPriorityTasksort = false;
  midPriorityTasksort = false;
  lowPriorityTasksort = false; // false means latest created time 

  constructor(private apiService: ApiServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTaskList();

    // searching the respective task by its message
    this.searchSubject.pipe(debounceTime(500)).subscribe(res => {
      this.filteredTaskList = this.taskList.filter(e => (e['message'].includes(res)));
    })
  }

  // fetching the taskList from the api
  getTaskList() {
    this.taskListLoading = true;
    this.apiService.getMethod('https://devza.com/tests/tasks/list').subscribe(res => {
      this.taskListLoading = false;
      if (res['status'] === 'success') {
        this.taskList = res['tasks'];
        this.highPriorityTaskList = this.taskList.filter(e => e.priority == 1);
        this.medPriorityTaskList = this.taskList.filter(e => e.priority == 2);
        this.lowPriorityTaskList = this.taskList.filter(e => e.priority == 3);
        this.filteredTaskList = JSON.parse(JSON.stringify(this.taskList));
        this.sortTaskBy(this.filteredTaskList, false, 'priority');
      }
    })
  }

  // deleting the respective task
  deleteTask(task) {

    const payLoad = new FormData();
    payLoad.append('taskid', task.id)
    task['deleteLoading'] = true;
    this.apiService.postMethod('https://devza.com/tests/tasks/delete', payLoad).subscribe(res => {
      task['deleteLoading'] = false;
      if (res['status'] === 'success') {
        this.taskList = this.taskList.filter(e => e.id !== task.id)
        this.filteredTaskList = this.filteredTaskList.filter(e => e.id !== task.id);
      }
    })
  }

  // function for updating the respective task
  updateTask(task) {
    this.dialog.open(CreateUpdateTaskComponent, {
      data: task,
      width: "500px"
    }).afterClosed().subscribe(result => {
      if (result && result['status'] === 'success') {
        this.getTaskList();
      }
    });
  }

 // accepting the dropped task and changing the priority
  lowPriorityDrop(event) {
    let draggedId = event.dataTransfer.getData('text');
    let payload = this.constructPayLoad(3, draggedId);
    this.updatePriorityOfTask(payload, 3);
  }

 // accepting the dropped task and changing the priority
  highPriorityDrop(event) {
    let draggedId = event.dataTransfer.getData('text');
    let payload = this.constructPayLoad(1, draggedId);
    this.updatePriorityOfTask(payload, 1);
  }

 // accepting the dropped task and changing the priority
  midPriorityDrop(event) {
    let draggedId = event.dataTransfer.getData('text');
    let payload = this.constructPayLoad(2, draggedId);
    this.updatePriorityOfTask(payload, 2);
  }


  // updating taskList of respective priority and main task list by calling api
  updatePriorityOfTask(payload, priority) {

    switch (priority) {
      case 1: this.highPriorityTaskListLoading = true;
        break
      case 2: this.midPriorityTaskListLoading = true;
        break
      case 3: this.lowPriorityTaskListLoading = true;
        break
    }

    this.apiService.postMethod('https://devza.com/tests/tasks/update', payload)
      .pipe(
        concatMap(e => this.apiService.getMethod('https://devza.com/tests/tasks/list'))
      )
      .subscribe(res => {
        switch (priority) {
          case 1: this.highPriorityTaskListLoading = false;
            break
          case 2: this.midPriorityTaskListLoading = false;
            break
          case 3: this.lowPriorityTaskListLoading = false;
            break
        }

        if (res['status'] === 'success') {
          this.taskList = res['tasks'];
          this.highPriorityTaskList = this.taskList.filter(e => e.priority == 1);
          this.medPriorityTaskList = this.taskList.filter(e => e.priority == 2);
          this.lowPriorityTaskList = this.taskList.filter(e => e.priority == 3);
          this.filteredTaskList = JSON.parse(JSON.stringify(this.taskList));
        }
      })
  }

  // simple function for constructing payload
  constructPayLoad(priority: number, taskId: any) {
    let task = this.taskList.filter(e => e.id == taskId);
    let payLoad = new FormData();

    payLoad.append('message', task[0].message);
    payLoad.append('due_data', task[0].due_data);
    payLoad.append('priority', '' + priority);
    payLoad.append('assigned_to', task[0].assigned_to);
    payLoad.append('taskid', task[0].id);

    return payLoad;
  }
  
  // sorting task by its respective key and status when status is true its high to low
  sortTaskBy(taskList, status, key) {
    let temp = status ? 1 : -1;
    taskList = taskList.sort((a, b) => {
      var keyA = new Date(a[key]),
        keyB = new Date(b[key]);
      if (keyA < keyB) return temp;
      if (keyA > keyB) return -temp;
      return 0;
    });
  }

  // refreshing the task list when event emitted by filtered task list component
  refreshList(event) {
    if (event === 'refresh') {
      this.getTaskList();
    }
  }

  // function to open dialog box for creating task
  createTask() {
    this.dialog.open(CreateUpdateTaskComponent, {
      data: {
        create: true
      },
      width: "500px"
    }).afterClosed().subscribe(result => {
      if (result && result['status'] === 'success') {
        this.getTaskList();
      }
    });
  }

}
