import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CoreModule} from './core/core.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ItemComponent } from './list/item/item.component';
import {HttpClientModule} from '@angular/common/http';
import {ListService} from './api/list.service';
import { ListComponent } from './list/list.component';
import {AppRoutingModule} from './app-routing.module';
import { NewItemComponent } from './list/new-item/new-item.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {NewListComponent} from './welcome/new-list/new-list.component';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    'pinch': { enabled: false },
    'rotate': { enabled: false }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ListComponent,
    NewItemComponent,
    NewListComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
  ],
  providers: [
    ListService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [NewItemComponent, NewListComponent],
})
export class AppModule { }
