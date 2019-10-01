import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChildren, ViewChild } from '@angular/core';

import { Food, Item, UpdateMsg, FoodService } from '../food-list/food-list.service';
import { FoodItemComponent } from '../food-item/food-item.component';
import { ItemShowComponent } from '../item-show/item-show.component';

import { MatTable } from '@angular/material';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css'],
  providers: [ FoodService ]
})

export class FoodListComponent implements OnInit, AfterViewInit {
  @ViewChildren('foodItem') itemRefs;

  error: any;
  headers: string[];
  items: Item[];
  counter: number[];
  itemCals: Map<string, number>;
  totalCals: number;
  displayList: boolean;
  displayEditiList: boolean;
  displayEditor: boolean;

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'cal'];

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.totalCals = 0;
    this.loadFoodResponse();
    this.counter = Array(7).fill(0).map((x,i)=>i);
    this.itemCals = new Map<string, number>();
    this.displayList = true;
    this.displayEditList = false;
    this.displayEditor = false;
  }

  ngAfterViewInit() {}

  onCalcCals(calcCals: UpdateMsg) {
    let totalCals = 0;
    this.itemCals.set(calcCals.id, calcCals.cals);
    this.itemCals.forEach((cal) => {
      totalCals += cal;
    });
    this.totalCals = totalCals;
  }

  clearItems() {
    this.itemRefs.forEach((item) => {
      item.clearItem();       
    });
    this.totalCals = 0;
  }

  editItems() {
    this.displayList = false;
    this.displayEditList = true;
    this.displayEditor = false;
  }


  listItems() {
    this.displayList = true;
    this.displayEditList = false;
    this.displayEditor = false;
  }

  openEditor(editItem: UpdatedMsg) {
    console.log(editItem);
    this.displayList = false;
    this.displayEditList = false;
    this.displayEditor = true;
  }

  onUpdate(updated: UpdateMsg) {
    console.log(updated);
  }

  loadFoodResponse() {
    this.foodService.getFoodResponse()
      .subscribe(resp => {
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
        var food = { ... resp.body };
        this.items = food.food;
      });
  }
}
