import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  usersList: any = [];
  userListLoading: boolean;

  constructor(private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {

    this.userListLoading = true;
    this.apiService.getMethod('https://devza.com/tests/tasks/listusers').subscribe(res => {
      this.userListLoading = false;
      if (res['status'] === 'success') {
        this.usersList = res['users'];
      }
    })
  }

}
