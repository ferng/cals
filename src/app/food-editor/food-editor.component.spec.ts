import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { MatBottomSheetRef } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FoodEditorComponent } from './food-editor.component';
import { Item } from '../food-list/food-list.service';

describe('FoodEditorComponent', () => {
  let component: FoodEditorComponent;
  let fixture: ComponentFixture<FoodEditorComponent>;
  let bottomSheetSpy: MatBottomSheetRef<FoodEditorComponent>;
  let formBuilder: FormBuilder;
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
    bottomSheetSpy = jasmine.createSpyObj('MatBottomSheetRef', ['dismiss']);
    formBuilder = new FormBuilder();
    TestBed.configureTestingModule({
      declarations: [ FoodEditorComponent ],
      providers: [
        {provide: MAT_BOTTOM_SHEET_DATA, useValue: {'item': testFields[0]}},
        {provide: MatBottomSheetRef, useValue: bottomSheetSpy},
        FormBuilder
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodEditorComponent);
    component = fixture.componentInstance;
  });


  it('should create the object via the constructor', () => {
    expect(component.item.cal).toBe(33);
    expect(component.foodForm.value.cal).toBe(33);
  });


  it('should dismiss the bottom sheet when it is cancelled', () => {
    component.cancel();
    expect(bottomSheetSpy.dismiss).toHaveBeenCalled();
  });


  it('should update the item with new data from the form', () => {
    component.foodForm.value.name = 'CHEWITS';
    component.foodForm.value.cal = '13';
    component.save();
    expect(component.item.name).toBe('chewits');
    expect(component.item.cal).toBe(13);
    expect(bottomSheetSpy.dismiss).toHaveBeenCalled();
  });

});
