import {of as observableOf, Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {catchError, map, take} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {UserService} from './api/user.service';
import {User} from './api/user';

@Injectable()
export class UserResolverService implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.userService.getUser().pipe(
      take(1),
      map(user => {
        this.userService.user.next(user);
        return user;
      }),
      catchError((err) => {
        this.userService.user.next({});
        const snackBarRef = this.snackBar.open('Log in to show if items are purchased', 'Log In');
        snackBarRef.onAction().subscribe(() => window.location.href = '/login');
        return observableOf({});
      })
    );
  }
}
