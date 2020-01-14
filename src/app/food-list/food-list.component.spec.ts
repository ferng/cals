import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';

import { FoodListComponent } from './food-list.component';
import { Food, Item, FoodListService } from '../food-list/food-list.service';
import { FoodItemComponent } from '../food-item/food-item.component';

import { asyncData, asyncError} from '../spec-helper';

describe('FoodListComponent', () => {
  let component: FoodListComponent;
  let fixture: ComponentFixture<FoodListComponent>;
  let testFields: Item[];
  let updatedFields: Item[];
  let foodListServiceSpy: FoodListService;
  let food: Food;
  let updatedFood: Food;
  let headers: HttpHeaders;

  beforeAll(() => {
    testFields = [
      {'id': 22, 'name': 'onions', 'cal': 33},
      {'id': 77, 'name': 'sausages', 'cal': 92},
      {'id': 35, 'name': 'potatoes', 'cal': 157},
      {'id': 87, 'name': 'cheese', 'cal': 892},
      {'id': 3, 'name': 'sarnie', 'cal': 56}
    ];

    updatedFields = [
      {'id': 22, 'name': 'onions', 'cal': 33},
      {'id': 35, 'name': 'potatoes', 'cal': 157},
      {'id': 3, 'name': 'sarnie', 'cal': 56}
    ];

    food = {'food': testFields};
    updatedFood = {'food': updatedFields};
    const foodLength = JSON.stringify(food).length.toString();
    headers = new HttpHeaders({
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-cache',
      'content-length': foodLength
    });
  });

  beforeEach(async(() => {
    foodListServiceSpy = jasmine.createSpyObj('FoodListService', [ 'getFoodResponse', 'updateFoodData' ]);

    TestBed.configureTestingModule({
      declarations: [ FoodListComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        {provide: FoodListService, useValue: foodListServiceSpy},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

// afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
//   httpMock.verify();
// }));


  it('should set up component via ngOnInit()',
    inject ([HttpTestingController], (httpMock: HttpTestingController) => {
      expect(component.totalCals).toBe(0);
      expect(component.counter.length).toBe(7);
      expect(component.displayList).toBe(true);
      expect(component.displayEditList).toBe(false);

      const req = httpMock.expectOne('http://localhost:3000/api/cals');
      expect(req.request.method).toEqual('GET');
      req.flush(food);

    })
  );


  it('should update the calorie totals when an item is updated', () => {
    component.onCalcCals(testFields[0]);
    expect(component.totalCals).toBe(33);
    expect(component.itemCals.size).toBe(1);
    component.onCalcCals(testFields[2]);
    expect(component.totalCals).toBe(190);
    expect(component.itemCals.size).toBe(2);
  });


  it('should clear all selected and entered food items', () => {
    const ref1 = jasmine.createSpyObj('FoodItemComponent', ['clearItem']);
    const ref2 = jasmine.createSpyObj('FoodItemComponent', ['clearItem']);
    component.itemRefs = [ref1, ref2];
    component.clearItems();
    expect(ref1.clearItem).toHaveBeenCalledTimes(1);
    expect(ref2.clearItem).toHaveBeenCalledTimes(1);
  });


  it('should set flags to display item editor when asked to do so', () => {
    expect(component.displayList).toBe(true);
    expect(component.displayEditList).toBe(false);
    component.editItems();
    expect(component.displayList).toBe(false);
    expect(component.displayEditList).toBe(true);
  });


  it('should set flags to display item list when asked to do so', () => {
    component.editItems();
    expect(component.displayList).toBe(false);
    expect(component.displayEditList).toBe(true);
    component.listItems();
    expect(component.displayList).toBe(true);
    expect(component.displayEditList).toBe(false);
  });


  it('should retrieve backend data via the foodService and set it up as items for the user',
    inject ([HttpTestingController], (httpMock: HttpTestingController) => {
      let req = httpMock.expectOne('http://localhost:3000/api/cals');
      expect(req.request.method).toEqual('GET');
      req.flush(food);

      component.loadFoodResponse();
      req = httpMock.expectOne('http://localhost:3000/api/cals');
      expect(req.request.method).toEqual('GET');
      req.flush(food, {headers: headers});

      expect(component.headers.length).toBe(3);
      expect(component.headers[0]).toBe('content-type: application/json; charset=utf-8');
      expect(component.headers[1]).toBe('cache-control: no-cache');
      expect(component.headers[2]).toBe('content-length: 190');

      expect(component.items.length).toBe(5);
      expect(component.items[0].id).toBe(22);
      expect(component.items[1].id).toBe(77);
      expect(component.items[2].id).toBe(35);
      expect(component.items[3].id).toBe(87);
      expect(component.items[4].id).toBe(3);
    })
  );


  it('should prep current data then update backend system with it',
    inject ([HttpTestingController], (httpMock: HttpTestingController) => {
      let req = httpMock.expectOne('http://localhost:3000/api/cals');
      expect(req.request.method).toEqual('GET');
      req.flush(food);
      const existingCalculated = new Map();
      existingCalculated.set(22, 33);
      existingCalculated.set(87, 892);
      component.itemCals = existingCalculated;

      expect(component.itemCals.size).toBe(2);
      expect(component.itemCals.get(22)).toBe(33);
      expect(component.itemCals.get(87)).toBe(892);

      component.onUpdateItems(updatedFields);
      req = httpMock.expectOne('http://localhost:3000/api/cals');
      expect(req.request.method).toEqual('PUT');
      req.flush(updatedFood, {headers: headers});

      expect(component.itemCals.size).toBe(1);
      expect(component.itemCals.get(22)).toBe(33);
      expect(component.itemCals.get(87)).toBe(undefined);
    })
  );


  it('should sort items alphabetically based on name', () => {
    expect(testFields[0].id).toBe(22);
    component.sortItems(testFields);
    expect(testFields[0].id).toBe(87);
    expect(testFields[4].id).toBe(77);
  });

});
