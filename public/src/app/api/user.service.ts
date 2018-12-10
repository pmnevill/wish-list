import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user = new BehaviorSubject<User>({});

  constructor(
    private http: HttpClient,
  ) { }

  public getUser() {
    return <Observable<User>>this.http.get('./api/user');
  }
}
