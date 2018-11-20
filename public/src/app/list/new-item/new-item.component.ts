import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ListService} from '../list.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Item} from '../list';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    public dialogRef: MatDialogRef<NewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item,
  ) {
    this.form = fb.group({
      name: fb.control(item.name, [Validators.required]),
      price: fb.control(item.price, [Validators.min(0)]),
      url: fb.control(item.url, ),
      img: fb.control(item.img, [Validators.required]),
    });
  }

  ngOnInit() {
  }

  saveItem() {
    if (this.item._id) {
      this.listService.updateItem({
        ...this.item,
        ...this.form.value,
      }).subscribe((item) => {
        this.dialogRef.close(true);
      });
    } else {
      this.listService.addItem({
        ...this.item,
        ...this.form.value,
      }).subscribe((item) => {
        this.dialogRef.close(true);
      });
    }
  }

}
