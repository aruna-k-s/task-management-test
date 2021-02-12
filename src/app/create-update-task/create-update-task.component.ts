import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-create-update-task',
  templateUrl: './create-update-task.component.html',
  styleUrls: ['./create-update-task.component.scss']
})
export class CreateUpdateTaskComponent implements OnInit {

  // @Input() formData;
  isUserListLoading: boolean = false;
  userList: any;
  isFormSubmitionLoading: boolean = false;


  constructor(private apiService: ApiServiceService, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public formData, public dialogRef: MatDialogRef<CreateUpdateTaskComponent>,) { }

  taskForm = new FormGroup({});

  ngOnInit(): void {


    this.getUserList();

    if (this.formData) {

      this.taskForm = new FormGroup({
        message: new FormControl(this.formData['message'] ? this.formData['message'] : '', Validators.required),
        due_date: new FormControl(this.formData['due_date'] ? new Date(this.formData['due_date']) : ''),
        priority: new FormControl(this.formData['priority'] ? this.formData['priority'] : ''),
        assigned_to: new FormControl(this.formData['assigned_to'] ? this.formData['assigned_to'] : ''),
        task_id: new FormControl(this.formData['id'] ? this.formData['id'] : '')
      })
    } else {

      this.taskForm = new FormGroup({
        message: new FormControl('', Validators.required),
        due_date: new FormControl(''),
        priority: new FormControl(''),
        assigned_to: new FormControl('')
      });
    }

  }
// geetting userList
  getUserList() {
    this.isUserListLoading = true;
    this.apiService.getMethod('https://devza.com/tests/tasks/listusers').subscribe(res => {
      this.isUserListLoading = false;
      if (res['status'] === 'success') {
        this.userList = res['users'];
      }
    });
  }

  // submitting the user form for updating task or creating new task
  submitForm() {
    let url = (this.formData && this.formData['id']) ? 'https://devza.com/tests/tasks/update' : 'https://devza.com/tests/tasks/create';

    const formData = new FormData();

    formData.append('message', this.taskForm.get('message').value);
    formData.append('due_date', this.datePipe.transform(this.taskForm.get('due_date').value, "yyyy-MM-dd HH:mm:ss"));
    formData.append('priority', this.taskForm.get('priority').value);
    formData.append('assigned_to', this.taskForm.get('assigned_to').value);
    this.formData ? formData.append('taskid', this.taskForm.get('task_id').value) : '';

    this.isFormSubmitionLoading = true;

    this.apiService.postMethod(url, formData).subscribe(res => {

      this.isFormSubmitionLoading = false;
      if (res['status'] === 'success') {
        if (this.formData && (this.formData['id'] || this.formData['create'])) {
          this.dialogRef.close(res);
        }
        this.taskForm.reset();
      }
    })
  }
}
