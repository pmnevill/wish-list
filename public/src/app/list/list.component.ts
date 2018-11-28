import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {ListService} from './list.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {auditTime} from 'rxjs/internal/operators';
import {Item, List} from './list';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDrawer} from '@angular/material';
import {NewItemComponent} from './new-item/new-item.component';
import {UserService} from '../user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  currentId: string;
  lists: List[] = [];
  list: List = {};
  filteredItems;
  searchForm: FormGroup;
  loading$ = new BehaviorSubject(false);
  listsLoading$ = new BehaviorSubject(false);
  listLoading$ = new BehaviorSubject(false);
  updateLoading$ = new BehaviorSubject(false);
  deleteLoading$ = new BehaviorSubject(false);
  isAdmin$ = new BehaviorSubject(false);
  disableDrawerClose = false;

  @ViewChild('drawer') drawer: MatDrawer;

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public userService: UserService,
  ) {
    this.searchForm = fb.group({
      term: fb.control(''),
      available: fb.control(true),
      purchased: fb.control(false),
    });
  }

  ngOnInit() {
    this.getLists();

    this.route.params.subscribe((params) => {
      if (params.id) {
        this.disableDrawerClose = false;
        this.currentId = params.id;
        this.getList();
      } else {
        this.disableDrawerClose = true;
        this.drawer.open();
      }
    });

    this.userService.user.subscribe((user: any) => {
      this.isAdmin$.next(user.isAdmin);
    });

    this.searchForm.valueChanges.subscribe((val) => {
      this.filterItems();
    });

    combineLatest(
      this.listLoading$,
      this.updateLoading$,
      this.deleteLoading$,
    ).pipe(
      auditTime(50),
    ).subscribe((loading) => {
      this.loading$.next(_.includes(loading, true));
      if (this.loading$.getValue()) {
        this.searchForm.disable({emitEvent: false});
      } else {
        this.searchForm.enable({emitEvent: false});
      }
    });
  }

  getLists() {
    this.listsLoading$.next(true);
    this.listService.getLists().subscribe((lists) => {
      this.listsLoading$.next(false);
      this.lists = lists;
    });
  }

  getList(filterItems = true) {
    this.listLoading$.next(true);
    this.listService.getList(this.currentId).subscribe((list) => {
      this.listLoading$.next(false);
      this.list = list;
      if (filterItems) {
        this.filterItems();
      }
    });
  }

  filterItems() {
    const form = this.searchForm.value;
    this.filteredItems = _.chain(this.list.items)
      .filter((item) => {
        return item.name.toLowerCase().includes(form.term.toLowerCase()) &&
          (item.purchased === form.purchased ||
            item.purchased !== form.available);
      })
      .sortBy((item: Item) => item.favorite ? 0 : 1)
      .value();
  }

  updateItem(item: Item) {
    this.updateLoading$.next(true);
    this.listService.updateItem(item).subscribe(() => {
      this.updateLoading$.next(false);
      this.getList(false);
    });
  }

  toggleControl(path) {
    const control = this.searchForm.get(path);
    control.markAsDirty();
    control.setValue(!control.value);
  }

  deleteItem(id: string) {
    this.deleteLoading$.next(true);
    this.listService.deleteItem(id).subscribe((item) => {
      this.deleteLoading$.next(false);
      this.getList();
    });
  }

  openNewDialog(item?: Item) {
    const dialogRef = this.dialog.open(NewItemComponent, {
      data: {
        ...(item ? item : {
          list: this.list._id,
        })
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getList();
      }
    });
  }
}
