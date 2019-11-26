import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { FoodItemComponent } from './food-item.component';
import { Item, itemIdx } from '../food-list/food-list.service';
import { FieldSelectComponent } from '../field-select/field-select.component';

@Component({
  selector: `app-host-component`,
  template: `<app-food-item></app-food-item>`
})
class HostComponent {
  @ViewChild(FoodItemComponent, {static: true})
  public foodItemComponent: FoodItemComponent;
}

describe('FoodItemComponent', () => {
  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;
  let testFields: Item[];

  beforeAll(() => {
    testFields = [
      {'id': 22, 'name': 'onions', 'cal': 33},
      {'id': 78, 'name': 'sausages', 'cal': 92},
      {'id': 35, 'name': 'potatoes', 'cal': 157},
      {'id': 87, 'name': 'cheese', 'cal': 892},
      {'id': 3, 'name': 'sarnie', 'cal': 56}
    ];
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodItemComponent, HostComponent ],
      providers: [
        FormBuilder
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
    hostComponent.foodItemComponent.items = testFields;
  });


  it('should set up food item with no selection via ngOnInit()', () => {
    hostComponent.foodItemComponent.id = 0;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    hostFixture.detectChanges();

    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(null);
  });


  it('should set up food item with previous selection via ngOnInit() calling reapply', () => {
    hostComponent.foodItemComponent.id = 0;
    const calcMap = new Map<number, number>();
    calcMap.set(78, 34);
    hostComponent.foodItemComponent.curCals = calcMap;
    hostFixture.detectChanges();

    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(78);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(36);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(34);
  });


  it('should check whether passed data data is not blank', () => {
    expect(hostComponent.foodItemComponent.notBlank('hello')).toBe(true);
    expect(hostComponent.foodItemComponent.notBlank(null)).toBe(false);
    expect(hostComponent.foodItemComponent.notBlank(undefined)).toBe(false);
    expect(hostComponent.foodItemComponent.notBlank('')).toBe(false);
  });


  it('should notify the parent when a selection is made', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: 210, grams: 375};
    const updatedVal = {id: 22, cal: 210, name: undefined};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    hostComponent.foodItemComponent.notifyParent();
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(updatedVal);
  });


  it('should calculate calories when grams are updated and update parent', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: '210', grams: '375'};
    const emitted = {id: 22, cal: 124, name: undefined};
    const updatedFormVal = {id: 22, grams: '375', cals: 124};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    hostComponent.foodItemComponent.calcCalsFromGrams();
    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(updatedFormVal.id);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(updatedFormVal.grams);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(updatedFormVal.cals);
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(emitted);
  });


  it('should calculate grams when calories are updated and update parent', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: '210', grams: '375'};
    const updatedFormVal = {id: 22, grams: 636, cals: '210'};
    const emitted = {id: 22, cal: 210, name: undefined};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    hostComponent.foodItemComponent.calcGramsFromCals();
    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(updatedFormVal.id);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(updatedFormVal.grams);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(updatedFormVal.cals);
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(emitted);
  });


  it('should not update parent when grams are still blank', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: '210', grams: ''};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    hostComponent.foodItemComponent.calcCalsFromGrams();
    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(formVal.id);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(formVal.grams);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(formVal.cals);
    expect(eventEmitterSpy.emit).not.toHaveBeenCalled();
  });


  it('should not update parent when calories are sill blank', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: '', grams: '375'};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    hostComponent.foodItemComponent.calcGramsFromCals();
    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(formVal.id);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(formVal.grams);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(formVal.cals);
    expect(eventEmitterSpy.emit).not.toHaveBeenCalled();
  });


  it('should calculate calories and update the parent when changing the foodItem', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: '210', grams: '375'};
    const emitted = {id: 78, cal: 345, name: undefined};
    const updatedFormVal = {id: 78, grams: '375', cals: 345};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    hostComponent.foodItemComponent.newSelection(testFields[1]);
    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(updatedFormVal.id);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(updatedFormVal.grams);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(updatedFormVal.cals);
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(emitted);
  });


  it('should not calculate calories or update the parent when changing the foodItem to null', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: '210', grams: '375'};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    hostComponent.foodItemComponent.newSelection(null);
    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(formVal.id);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(formVal.grams);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(formVal.cals);
    expect(eventEmitterSpy.emit).not.toHaveBeenCalled();
  });


  it('should clear the form when user requests it', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.foodItemComponent.calcCals = eventEmitterSpy;
    const calcMap = new Map<number, number>();
    hostComponent.foodItemComponent.curCals = calcMap;
    const formVal = {id: 22, cals: '210', grams: '375'};
    hostComponent.foodItemComponent.foodForm.patchValue(formVal);

    const fieldSelectSpy: FieldSelectComponent = jasmine.createSpyObj('FieldSelectComponent', ['resetSelection']);
    hostComponent.foodItemComponent.fieldSelect = fieldSelectSpy;

    hostComponent.foodItemComponent.clearItem();
    expect(hostComponent.foodItemComponent.foodForm.value.id).toBe(null);
    expect(hostComponent.foodItemComponent.foodForm.value.grams).toBe(null);
    expect(hostComponent.foodItemComponent.foodForm.value.cals).toBe(null);
    expect(fieldSelectSpy.resetSelection).toHaveBeenCalled();
  });

});
