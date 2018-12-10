import { Component, OnInit } from '@angular/core';
import {ListService} from '../api/list.service';
import {List} from '../api/list';
import * as _ from 'lodash';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  lists: List[];

  colorSet = {
    name: 'vivid',
    selectable: true,
    group: 'Ordinal',
    domain: ['#81c784', '#ef9a9a'],
  };

  constructor(
    private listService: ListService,
  ) { }

  ngOnInit() {
    this.listService.lists.subscribe((lists) => {
      this.lists = lists;
    });
  }

  getPurchased(list: List) {
    return _.filter(list.items, {purchased: true}).length;
  }

  getAvailable(list: List) {
    return _.filter(list.items, {purchased: false}).length;
  }

}
