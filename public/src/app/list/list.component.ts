import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {ListService} from '../api/list.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {auditTime} from 'rxjs/internal/operators';
import {Item, List} from '../api/list';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDrawer} from '@angular/material';
import {NewItemComponent} from './new-item/new-item.component';
import {User} from '../api/user';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  currentId: string;
  list: List = {};
  filteredItems;
  searchForm: FormGroup;
  loading$ = new BehaviorSubject(false);
  listLoading$ = new BehaviorSubject(false);
  updateLoading$ = new BehaviorSubject(false);
  deleteLoading$ = new BehaviorSubject(false);
  isAdmin$ = new BehaviorSubject(false);
  disableDrawerClose = false;
  orderByFavorite = {
    iteratee: (item: Item) => item.favorite ? 0 : 1,
    label: 'Favorite',
  };
  orderByPrice = {
    iteratee: 'price',
    label: 'Price',
  };
  orderByName = {
    iteratee: 'name',
    label: 'Name',
  };
  orderBys = [
    this.orderByFavorite,
    this.orderByPrice,
    this.orderByName,
  ];
  public user: User;

  @ViewChild('drawer') drawer: MatDrawer;

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.searchForm = fb.group({
      term: fb.control(null),
      available: fb.control(null),
      purchased: fb.control(null),
      orderBy: fb.control(null),
      orderAsc: fb.control(null)
    });
    this.resetSearchForm();
  }

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    this.isAdmin$.next(this.user.isAdmin);

    this.route.params.subscribe((params) => {
      this.resetSearchForm();
      if (params.id) {
        this.disableDrawerClose = false;
        this.currentId = params.id;
        this.getList();
      } else {
        this.disableDrawerClose = true;
        this.drawer.open();
      }
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

  resetSearchForm() {
    this.searchForm.reset({
      term: '',
      available: true,
      purchased: false,
      orderBy: this.orderByFavorite,
      orderAsc: true,
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
      .orderBy([form.orderBy.iteratee, 'name'], form.orderAsc ? 'asc' : 'desc')
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
        list: this.list,
        item: item ? item : {
          listId: this.list._id,
        },
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getList();
      }
    });
  }

  orderByCompareFn(a, b): boolean {
    return a && b ? a.label === b.label : a === b;
  }

  toggleSortOrder() {
    const control = this.searchForm.get('orderAsc');
    control.setValue(!control.value);
  }
}
