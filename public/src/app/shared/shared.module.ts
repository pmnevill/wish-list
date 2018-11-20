import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule, MatProgressBarModule, MatSidenavModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const matModules = [
  MatToolbarModule,
  MatButtonModule,
  MatListModule,
  MatCardModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatCheckboxModule,
  MatChipsModule,
  MatSidenavModule,
  MatDialogModule,
  MatProgressBarModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    matModules,
  ],
  exports: [
    matModules,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
