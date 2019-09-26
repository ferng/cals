import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';


import { AppComponent } from './app.component';
import { FoodItemComponent } from './food-item/food-item.component';
import { FoodListComponent } from './food-list/food-list.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemShowComponent } from './item-show/item-show.component';

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
    MatGridListModule,
  ],
  declarations: [
    AppComponent,
    FoodItemComponent,
    FoodListComponent,
    ItemEditComponent,
    ItemShowComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

