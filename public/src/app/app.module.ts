import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ItemComponent } from './list/item/item.component';
import {HttpClientModule} from '@angular/common/http';
import {ListService} from './list/list.service';
import { ListComponent } from './list/list.component';
import {AppRoutingModule} from './app-routing.module';
import { NewItemComponent } from './list/new-item/new-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ListComponent,
    NewItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    FlexLayoutModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [ListService],
  bootstrap: [AppComponent],
  entryComponents: [NewItemComponent],
})
export class AppModule { }
