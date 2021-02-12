import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'task-management-test';
  componentName = 'taskList';

  ngOnInit() {

  }

  showComponent(componentName) {
    this.componentName = componentName;
  }

}
