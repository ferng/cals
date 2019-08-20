import { Component, OnInit } from '@angular/core';

import { Food, Item, FoodService } from '../food-list/food-list.service';

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

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.loadFoodResponse();
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
