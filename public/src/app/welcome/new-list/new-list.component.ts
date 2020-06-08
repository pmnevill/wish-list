import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ListService} from '../../api/list.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {List} from '../../api/list';

interface Data {
  list: List;
}

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    public dialogRef: MatDialogRef<NewListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
  ) {
    this.form = fb.group({
      name: fb.control(data.list.name, [Validators.required]),
    });
  }

  ngOnInit() {}

  saveList() {
    if (this.data.list._id) {
      this.listService.updateList({
        ...this.data.list,
        ...this.form.value,
      }).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.listService.addList({
        ...this.data.list,
        ...this.form.value,
      }).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

}
