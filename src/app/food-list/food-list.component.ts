import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChildren } from '@angular/core';

import { Food, Item, UpdateMsg, FoodService } from '../food-list/food-list.service';
import { FoodItemComponent } from '../food-item/food-item.component';
import { ItemEditComponent } from '../item-edit/item-edit.component';

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
  choiceIds: number[];
  itemCals: Map<string, number>;
  totalCals: number;
  displayList: boolean;
  displayEdit: boolean;


  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.totalCals = 0;
    this.loadFoodResponse();
    this.choiceIds = Array(7).fill(0).map((x,i)=>i);
    this.itemCals = new Map<string, number>();
    this.displayList = true;
    this.displayEdit = false;
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
    this.displayEdit = true;
  }

  stripSpace(item: string) {
    var regex = / /gi;
    return item.replace(regex, '_');

  }

  loadFoodResponse() {
    this.foodService.getFoodResponse()
      .subscribe(resp => {
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
        var food = { ... resp.body };
        
        this.items = (Object.keys(food).map(e=>food[e]))[0];
      });
  }
}
