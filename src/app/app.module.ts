import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateUpdateTaskComponent } from './create-update-task/create-update-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilteredTaskListComponent } from './filtered-task-list/filtered-task-list.component';
import { SharedMaterialsModule } from './shared/shared-materials/shared-materials.module';


@NgModule({
  declarations: [
    AppComponent,
    CreateUpdateTaskComponent,
    TaskListComponent,
    UsersListComponent,
    FilteredTaskListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialsModule
    
  ],
  providers: [
    DatePipe, // used for formatting the date to yyyy-MM-dd HH-mm-ss
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }],
  bootstrap: [AppComponent],
  entryComponents: [CreateUpdateTaskComponent]
})
export class AppModule { }
