import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ListService} from '../../api/list.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Item, List} from '../../api/list';
import {UserService} from '../../api/user.service';
import {User} from '../../api/user';

interface Data {
  item: Item;
  list: List;
}

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {

  form: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private userService: UserService,
    public dialogRef: MatDialogRef<NewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
  ) {
    this.form = fb.group({
      name: fb.control(data.item.name, [Validators.required]),
      price: fb.control(data.item.price, [Validators.min(0)]),
      url: fb.control(data.item.url, ),
      img: fb.control(data.item.img, [Validators.required]),
      hidden: fb.control(data.item.hidden),
    });
  }

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  saveItem() {
    if (this.data.item._id) {
      this.listService.updateItem({
        ...this.data.item,
        ...this.form.value,
      }).subscribe((item) => {
        this.dialogRef.close(true);
      });
    } else {
      this.listService.addItem({
        ...this.data.item,
        ...this.form.value,
      }).subscribe((item) => {
        this.dialogRef.close(true);
      });
    }
  }

}
