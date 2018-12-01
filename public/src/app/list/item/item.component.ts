import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {Item} from '../../api/list';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../api/user';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  _item: Item;
  user: User;

  @Input()
  get item() {
    return this._item;
  }
  set item(item: any) {
    this._item = item;
    this.generateForm();
  }

  @Input() isAdmin = false;
  @Input() loading$: Observable<boolean>;

  @Output() edit = new EventEmitter<Item>();
  @Output() changed = new EventEmitter();
  @Output() delete = new EventEmitter();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    this.form.valueChanges.subscribe((val) => {
      if (this.form.valid && this.form.dirty) {
        this.changed.emit({
          ...this._item,
          ...val,
        });
        this.form.markAsPristine();
      }
    });

    this.loading$.subscribe((loading) => {
      if (loading) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  generateForm() {
    this.form = this.fb.group({
      purchased: this.fb.control(this._item.purchased),
      favorite: this.fb.control(this._item.favorite),
    });
  }

  togglePurchased() {
    const control = this.form.get('purchased');
    control.markAsDirty();
    control.setValue(!control.value);
    this.snackbar.open(control.value ? 'Thank you!' : 'It\'s the thought that counts?', null, {duration: 2000});
  }

  toggleFavorite() {
    if (this.isAdmin) {
      const control = this.form.get('favorite');
      control.markAsDirty();
      control.setValue(!control.value);
    }
  }

}
