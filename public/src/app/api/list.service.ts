import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {Item, List} from './list';
import {share} from 'rxjs/operators';

@Injectable()
export class ListService {

  private _lists$ = new BehaviorSubject<List[]>([]);
  public lists$ = this._lists$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getLists(): Observable<List[]> {
    const request = <Observable<List[]>>this.http.get('./api/lists')
      .pipe(
        share(),
      );

    request
      .subscribe(lists => {
        this._lists$.next(lists);
      });

    return request;
  }

  setListsOrder(lists: List[]): Observable<List[]> {
    lists = lists.map((list: List, position) => {
      return {
        ...list,
        position,
      };
    });

    const request = <Observable<List[]>>this.http.put('./api/lists', lists)
      .pipe(
        share(),
      );

    request.subscribe(updatedLists => {
      this._lists$.next(updatedLists);
    });
    return request;
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

  addList(list: List): Observable<List> {
    return <Observable<List>>this.http.post(`./api/lists`, list);
  }

  updateList(list: List): Observable<List> {
    return <Observable<List>>this.http.put(`./api/lists/${list._id}`, list);
  }

  deleteList(id: string): Observable<any> {
    return <Observable<any>>this.http.delete(`./api/lists/${id}`);
  }
}
