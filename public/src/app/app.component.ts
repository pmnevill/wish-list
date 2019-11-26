import {Component, OnInit} from '@angular/core';
import {UserService} from './api/user.service';
import {ListService} from './api/list.service';
import {BehaviorSubject} from 'rxjs';
import {List} from './api/list';
import {User} from './api/user';
import {ActivatedRoute} from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  lists: List[] = [];
  listsLoading$ = new BehaviorSubject(false);
  user: User;
  isAdmin$ = new BehaviorSubject(false);

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.user$.subscribe((user: User) => {
      this.user = user;
      this.isAdmin$.next(user.isAdmin);
    });

    this.listService.lists$.subscribe((lists: List[]) => {
      lists = _.orderBy(lists, 'position');
      this.lists = lists;
    });

    this.getLists();
  }

  getLists() {
    this.listsLoading$.next(true);
    this.listService.getLists().subscribe((lists) => {
      this.listsLoading$.next(false);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.listService.setListsOrder(this.lists);
  }
}
