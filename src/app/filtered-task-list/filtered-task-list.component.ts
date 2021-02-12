import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiServiceService } from '../api-service.service';
import { CreateUpdateTaskComponent } from '../create-update-task/create-update-task.component';

@Component({
  selector: 'app-filtered-task-list',
  templateUrl: './filtered-task-list.component.html',
  styleUrls: ['./filtered-task-list.component.scss']
})
export class FilteredTaskListComponent implements OnInit {

  @Input() taskList;
  @Output() refreshList = new EventEmitter();

  taskSortByCreatedTime: boolean = false; // latest first
  taskSortByDueTime: boolean = false; // latest first

  constructor(private apiService: ApiServiceService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }


// deleting the respective task
  deleteTask(task) {
    const payLoad = new FormData();
    payLoad.append('taskid', task.id)
    task['deleteLoading'] = true;
    this.apiService.postMethod('https://devza.com/tests/tasks/delete', payLoad).subscribe(res => {
      task['deleteLoading'] = false;
      if (res['status'] === 'success') {
        this.taskList = this.taskList.filter(e => e.id !== task.id);
        this.refreshList.emit('refresh');
      }
    })
  }

  // updating the task
  updateTask(task) {
    this.dialog.open(CreateUpdateTaskComponent, {
      data: task,
      width: "500px"
    }).afterClosed().subscribe(result => {
      if (result && result['status'] === 'success') {
        this.refreshList.emit('refresh');
      }
    });
  }

  // function for sorting the tasks in taskList
  sortTaskByTime(taskList, status, key) {
    let temp = status ? 1 : -1;
    taskList = taskList.sort((a, b) => {
      var keyA = new Date(a[key]),
        keyB = new Date(b[key]);
      if (keyA < keyB) return temp;
      if (keyA > keyB) return -temp;
      return 0;
    });
  }


}
