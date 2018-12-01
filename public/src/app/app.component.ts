import {Component, OnInit} from '@angular/core';
import {UserService} from './api/user.service';
import {ListService} from './api/list.service';
import {BehaviorSubject} from 'rxjs';
import {List} from './api/list';
import {User} from './api/user';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  lists: List[] = [];
  listsLoading$ = new BehaviorSubject(false);
  user: User;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.user.subscribe((user: User) => {
      this.user = user;
    });

    this.getLists();
  }

  getLists() {
    this.listsLoading$.next(true);
    this.listService.getLists().subscribe((lists) => {
      this.listsLoading$.next(false);
      this.lists = lists;
    });
  }
}
