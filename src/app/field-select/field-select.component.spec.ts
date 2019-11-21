import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';

import { FieldSelectComponent } from './field-select.component';
import { Item } from '../food-list/food-list.service';

@Component({
  selector: `app-host-component`,
  template: `<app-field-select></app-field-select>`
})
class HostComponent {
  @ViewChild(FieldSelectComponent, {static: true})
  public fieldSelectComponent: FieldSelectComponent;
}

describe('FieldSelectComponent', () => {
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
      declarations: [ FieldSelectComponent, HostComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
  });


  it('should set up component with a selection via ngOnInit()', () => {
    hostComponent.fieldSelectComponent.selectionId = 35;
    hostComponent.fieldSelectComponent.fields = testFields;
    hostFixture.detectChanges();

    expect(hostComponent.fieldSelectComponent.fieldCtrl.value.cal).toBe(157);
  });


  it('should set up component without a selection via ngOnInit()', () => {
    hostComponent.fieldSelectComponent.selectionId = null;
    hostComponent.fieldSelectComponent.fields = testFields;
    hostFixture.detectChanges();

    expect(hostComponent.fieldSelectComponent.fieldCtrl.value).toBe(null);
  });


  it('should notify the parent when a selection is made', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.fieldSelectComponent.updateSelection = eventEmitterSpy;
    hostComponent.fieldSelectComponent.selectionId = null;
    hostComponent.fieldSelectComponent.fields = testFields;
    hostFixture.detectChanges();
    hostComponent.fieldSelectComponent.fieldCtrl.patchValue(3);

    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(3);

  });


  it('should update the select field dropdown as part of autocomplete with matching values', () => {
    hostComponent.fieldSelectComponent.selectionId = null;
    hostComponent.fieldSelectComponent.fields = testFields;
    hostFixture.detectChanges();
    hostComponent.fieldSelectComponent.fieldFilterCtrl.patchValue('sa');

    let updatedList;
    hostComponent.fieldSelectComponent.filteredFields.subscribe(fields => {updatedList = fields; });

    expect(updatedList.length).toBe(2);
    expect(updatedList[0].name).toBe('sausages');
    expect(updatedList[1].name).toBe('sarnie');
  });


  it('should clear the select field dropdown as part of autocomplete as there are no matching values', () => {
    hostComponent.fieldSelectComponent.selectionId = null;
    hostComponent.fieldSelectComponent.fields = testFields;
    hostFixture.detectChanges();
    hostComponent.fieldSelectComponent.fieldFilterCtrl.patchValue('parse');

    let updatedList;
    hostComponent.fieldSelectComponent.filteredFields.subscribe(fields => {updatedList = fields; });

    expect(updatedList.length).toBe(0);
  });


  it('should not try to filter as the main list is empty', () => {
    hostComponent.fieldSelectComponent.selectionId = null;
    hostComponent.fieldSelectComponent.fields = testFields;
    hostFixture.detectChanges();
    hostComponent.fieldSelectComponent.fields = null;
    hostComponent.fieldSelectComponent.fieldFilterCtrl.patchValue('sa');

    let updatedList;
    hostComponent.fieldSelectComponent.filteredFields.subscribe(fields => {updatedList = fields; });

    expect(updatedList.length).toBe(5);
  });


  it('should not try to filter as the autocomplete value is empty', () => {
    hostComponent.fieldSelectComponent.selectionId = null;
    hostComponent.fieldSelectComponent.fields = testFields;
    hostFixture.detectChanges();

    const updatedTestFields = [
      {'id': 22, 'name': 'onions', 'cal': 33},
      {'id': 87, 'name': 'cheese', 'cal': 892},
      {'id': 3, 'name': 'sarnie', 'cal': 56}
    ];
    hostComponent.fieldSelectComponent.fields = updatedTestFields;
    hostComponent.fieldSelectComponent.fieldFilterCtrl.patchValue(null);

    let updatedList;
    hostComponent.fieldSelectComponent.filteredFields.subscribe(fields => {updatedList = fields; });

    expect(updatedList.length).toBe(3);
  });

});
