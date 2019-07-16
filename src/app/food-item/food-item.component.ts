import { Component, OnInit } from '@angular/core';
import { Food, Item, FoodService } from './food-item.service';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css'],
  providers: [ FoodService ]
})


export class FoodItemComponent implements OnInit {
  error: any;
  headers: String[];
  food: Food;

  constructor(private foodService: FoodService) { }

  ngOnInit () {
    this.showFoodResponse();
  }
  
  

  showFoodResponse() {
    this.foodService.getFoodResponse()
      .subscribe(resp => {
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
        this.food = { ... resp.body };
      });
  }
}
