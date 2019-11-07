import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatIconRegistry } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatBottomSheetModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { AppComponent } from './app.component';
import { FoodItemComponent } from './food-item/food-item.component';
import { FoodListComponent } from './food-list/food-list.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { FoodEditorComponent } from './food-editor/food-editor.component';
import { FieldSelectComponent } from './field-select/field-select.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
  ],
  declarations: [
    AppComponent,
    FoodItemComponent,
    FoodListComponent,
    ItemEditComponent,
    FoodEditorComponent,
    FieldSelectComponent,
  ],
  providers: [],
  bootstrap: [ AppComponent ],
  entryComponents: [ FoodEditorComponent ]
})
export class AppModule { }

