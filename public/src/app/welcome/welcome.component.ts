import { Component, OnInit } from '@angular/core';
import {ListService} from '../api/list.service';
import {Item, List} from '../api/list';
import * as _ from 'lodash';
import {NewItemComponent} from '../list/new-item/new-item.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {NewListComponent} from './new-list/new-list.component';
import {BehaviorSubject} from 'rxjs';
import {User} from '../api/user';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  lists: List[];
  isAdmin$ = new BehaviorSubject(false);
  public user: User;

  constructor(
    private listService: ListService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    this.isAdmin$.next(this.user.isAdmin);

    this.listService.lists$.subscribe((lists) => {
      lists = _.orderBy(lists, 'position');
      this.lists = lists;
    });
  }

  getPurchased(list: List) {
    return _.filter(list.items, {purchased: true}).length;
  }

  getAvailable(list: List) {
    return _.filter(list.items, {purchased: false}).length;
  }

  openNewDialog(list: List) {
    const dialogRef = this.dialog.open(NewListComponent, {
      data: {
        list: list ? list : {
          name: 'New List',
        },
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.listService.getLists();
      }
    });
  }

  deleteList(id: string) {
    this.snackbar.open('Are you sure?', 'Delete')
      .onAction()
      .subscribe(() => {
        this.listService.deleteList(id)
          .subscribe(() => {
            this.listService.getLists();
          });
      });
  }

}
