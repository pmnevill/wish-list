import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {Item} from '../list';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  _item: Item;

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
  ) { }

  ngOnInit() {
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
  }

  toggleFavorite() {
    if (this.isAdmin) {
      const control = this.form.get('favorite');
      control.markAsDirty();
      control.setValue(!control.value);
    }
  }

}
