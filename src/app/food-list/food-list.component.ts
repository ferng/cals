import { Component, OnInit } from '@angular/core';

import { Food, Item, UpdateMsg, FoodService } from '../food-list/food-list.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css'],
  providers: [ FoodService ]
})

export class FoodListComponent implements OnInit {
  error: any;
  headers: string[];
  items: Item[];
  choiceIds: number;
  itemCals: Map<string, number>;

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.loadFoodResponse();
    this.choiceIds = Array(7).fill(0).map((x,i)=>'item-'+i);
    this.itemCals = new Map<string, numner>();
  }

  onCalcCals(calcCals: UpdateMsg) {
    let totalCals = 0;
    this.itemCals.set(calcCals.id, calcCals.cals);
    this.itemCals.forEach((cal) => {
      totalCals += cal;
    });  
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
