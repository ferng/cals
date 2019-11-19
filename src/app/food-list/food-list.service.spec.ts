import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { defer } from 'rxjs';

import { FoodListService, Item, Food, itemIdx } from './food-list.service';

describe('FoodListService with HttpClient', () => {
  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }
  
  function asyncError<T>(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
  }

  function setup() {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    const foodListService = new FoodListService(<any> httpClientSpy);
    const items: Array<Item> = [
      {"id": 22, "name": "onions", "cal": 33},
      {"id": 35, "name": "potatoes", "cal": 157},
      {"id": 87, "name": "cheese", "cal": 892},
      {"id": 3, "name": "sarnie", "cal": 56}
    ];
    let food: Food = {"food": items};

    return {httpClientSpy, foodListService, food};
  }


  it('should be created', () => {
    const {httpClientSpy, foodListService} = setup();
    expect(foodListService).toBeTruthy();
  });

  
  it('should return food from the backend', () => {
    const {httpClientSpy, foodListService, food} = setup();

    httpClientSpy.get.and.returnValue(asyncData(food));

    foodListService.getFood().subscribe(
      foodResp => expect(foodResp).toEqual(food, 'food'), fail
    );

    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  
  it('should return the full response from the backend', ()=> {
    const {httpClientSpy, foodListService, food} = setup();
    const response = new HttpResponse({
      status: 200,
      body: food
    });
    
    httpClientSpy.get.and.returnValue(asyncData(response));

    foodListService.getFoodResponse().subscribe(
      foodResp => expect(foodResp).toEqual(response, 'response'), fail
    );

    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  
  it('should update the backend with a new list of items', ()=> {
    const {httpClientSpy, foodListService, food} = setup();
    const response = new HttpResponse({
      status: 200
    });
    
    httpClientSpy.put.and.returnValue(asyncData(response));

    foodListService.updateFoodData(food).subscribe(
      foodResp => {
        expect(foodResp.status).toEqual(200), fail
      }
    );

    expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
  });

  
  it('should notify user of a server error', ()=> {
    const {httpClientSpy, foodListService, food} = setup();
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    foodListService.getFood().subscribe(
      foodResp => fail('expected an error, not Food'),
      error  => expect(error).toBe('Something bad happened: Not Found; please try again later.')
    );
  });
  

  it('should notify user of a frontend error', ()=> {
    const {httpClientSpy, foodListService, food} = setup();
    const errorEvent = new ErrorEvent('ErrorEvent', {
      error : new Error('oops'),
      message : 'Oh no someting broke',
      lineno : 402,
      filename : 'closet.html'
    });
    const errorResponse = new HttpErrorResponse({
      error: errorEvent
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    foodListService.getFood().subscribe(
      foodResp => fail('expected an error, not Food'),
      error  => expect(error).toBe('Something bad happened: Oh no someting broke; please try again later.')
    );
  });

  
  it('should call itemIdx to get the index item from the array based on the id', ()=> {
    const {httpClientSpy, foodListService, food} = setup();
    const idx1 = itemIdx(food.food, 22);
    const idx2 = itemIdx(food.food, 87);

    expect(food.food[idx1].name).toBe('onions');
    expect(food.food[idx2].name).toBe('cheese');
  })
});
