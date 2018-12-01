import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Item, List} from './list';

@Injectable()
export class ListService {

  constructor(
    private http: HttpClient,
  ) { }

  getLists(): Observable<List[]> {
    return <Observable<List[]>>this.http.get('./api/lists');
  }

  getList(id): Observable<List> {
    return <Observable<List>>this.http.get(`./api/lists/${id}`);
  }

  addItem(item): Observable<Item> {
    return <Observable<Item>>this.http.post('./api/items', item);
  }

  updateItem(item: Item): Observable<Item> {
    return <Observable<Item>>this.http.put(`./api/items/${item._id}`, item);
  }

  deleteItem(id: string): Observable<any> {
    return <Observable<any>>this.http.delete(`./api/items/${id}`);
  }
}
