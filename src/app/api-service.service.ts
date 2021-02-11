import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService implements OnInit {

  headers = new HttpHeaders({ 'AuthToken': 'BIkRjnAblCuLrOrzMVDVJn6vbKe34sjz' })

  constructor(private http: HttpClient) { }


  ngOnInit() {
  }

  getMethod(url) {
    return this.http.get(url, { headers: this.headers });
  }

  postMethod(url, input) {
    return this.http.post(url, input, { headers: this.headers });
  }

}
