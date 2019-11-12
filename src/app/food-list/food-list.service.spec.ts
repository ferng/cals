import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';

import { FoodListService } from './food-list.service';

describe('FoodListService with HttpClient', () => {
  function setup() {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const foodListService = new FoodListService(httpClientSpy);

    return {httpClientSpy, foodListService};
  }

  it('should be created', () => {
    const {httpClientSpy, foodListService} = setup();
    expect(foodListService).toBeTruthy();
  });
});
