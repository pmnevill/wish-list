import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user = new BehaviorSubject({});

  constructor(
    private http: HttpClient,
  ) { }

  public getUser() {
    return this.http.get('./api/user').subscribe(
      (user) => {
        this.user.next(user);
        return true;
      },
      (err) => {
        this.user.next({});
        return false;
      }
    );
  }
}
