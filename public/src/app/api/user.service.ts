import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user$ = new BehaviorSubject<User>({});
  public user$ = this._user$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  public setUser(user: User) {
    this._user$.next(user);
  }

  public getUser() {
    return <Observable<User>>this.http.get('./api/user');
  }
}
