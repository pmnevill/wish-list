import { Component, OnInit } from '@angular/core';
import {ListService} from '../api/list.service';
import {List} from '../api/list';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  lists: List[];

  constructor(
    private listService: ListService,
  ) { }

  ngOnInit() {
    this.listService.getLists().subscribe((lists) => {
      this.lists = lists;
    });
  }

}
