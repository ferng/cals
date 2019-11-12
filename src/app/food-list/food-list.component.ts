import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChildren, ViewChild } from '@angular/core';

import { Food, Item, FoodListService } from '../food-list/food-list.service';
import { FoodItemComponent } from '../food-item/food-item.component';

import { MatTable } from '@angular/material';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css'],
  providers: [ FoodListService ]
})

export class FoodListComponent implements OnInit, AfterViewInit {
  @ViewChildren('foodItem') itemRefs;

  error: any;
  headers: string[];
  items: Item[];
  counter: number[];
  itemCals: Map<number, number>;
  totalCals: number;
  displayList: boolean;
  displayEditList: boolean;

  @ViewChild(MatTable, { static:true }) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'cal'];

  constructor(private foodService: FoodListService) { }

  ngOnInit() {
    this.totalCals = 0;
    this.loadFoodResponse();
    this.counter = Array(7).fill(0).map((x,i)=>i);
    this.itemCals = new Map<number, number>();
    this.displayList = true;
    this.displayEditList = false;
  }

  ngAfterViewInit() {}

  onCalcCals(calcCals: Item) {
    let totalCals = 0;
    this.itemCals.set(calcCals.id, calcCals.cal);
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
  }


  listItems() {
    this.displayList = true;
    this.displayEditList = false;
  }

  loadFoodResponse() {
    this.foodService.getFoodResponse()
      .subscribe(resp => {
        //TODO warning if there is an errror
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
        let food = { ... resp.body };
        this.items = food.food;
      });
  }
 
  onUpdateItems(newItems: Item[]) {
    let updatedItemCals = new Map();
    newItems.forEach((item) => {
      let existing = this.itemCals.get(item.id);
      if (existing) {
        updatedItemCals.set(item.id, existing);
      }
    })
    this.itemCals = updatedItemCals;
    
    this.sortItems(newItems);
    let food = {"food": newItems};
    this.items = newItems;
    this.foodService.updateFoodData(food)
      .subscribe(resp => {
        //TODO warning if there is an errror
      });
  }

  sortItems(items: Item[]) {
    items.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}
