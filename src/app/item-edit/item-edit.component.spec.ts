import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { MatTable } from '@angular/material';

import { ItemEditComponent } from './item-edit.component';
import { Item } from '../food-list/food-list.service';
import { asyncData, asyncError} from '../spec-helper';

@Component({
  selector: `app-host-component`,
  template: `<app-item-edit></app-item-edit>`
})
class HostComponent {
  @ViewChild(ItemEditComponent, {static: true})
  public itemEditComponent: ItemEditComponent;
}
  
describe('ItemEditComponent', () => {
  let hostComponent: HostComponent;
  let hostFixture: ComponentFixture<HostComponent>;
  let testFields: Item[];
  let bottomSheetSpy: any;


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
    bottomSheetSpy = jasmine.createSpyObj('MatBottomSheet', ['open']);

    TestBed.configureTestingModule({
      declarations: [ ItemEditComponent, HostComponent ],
      imports: [ MatTableModule ],
      providers: [
        {provide: MatBottomSheet, useValue: bottomSheetSpy}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  
  it('should create the object via the constructor', () => {
    expect(hostComponent.itemEditComponent.displayedColumns[0]).toBe('name');
    expect(hostComponent.itemEditComponent.displayedColumns[1]).toBe('cal');
    expect(hostComponent.itemEditComponent.displayedColumns[2]).toBe('action');
  });


  it('should remove the item from the list and notify parent component when item is deleted', () => {
    const tableSpy: MatTable<any> = jasmine.createSpyObj('MatTable', ['renderRows']);
    hostComponent.itemEditComponent.table = tableSpy;
    hostComponent.itemEditComponent.items = testFields;
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.updateItems = eventEmitterSpy;
    
    expect(hostComponent.itemEditComponent.items[2].id).toBe(35);
    expect(hostComponent.itemEditComponent.items.length).toBe(5);

    hostComponent.itemEditComponent.deleteItem(35);

    expect(hostComponent.itemEditComponent.items[2].id).toBe(87);
    expect(hostComponent.itemEditComponent.items.length).toBe(4);

    expect(tableSpy.renderRows).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(hostComponent.itemEditComponent.items);
  });


  it('should update item in the list and notify parent when item is updated', () => {
    const tableSpy: MatTable<any> = jasmine.createSpyObj('MatTable', ['renderRows']);
    hostComponent.itemEditComponent.table = tableSpy;
    hostComponent.itemEditComponent.items = testFields;
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.updateItems = eventEmitterSpy;
    
    expect(hostComponent.itemEditComponent.items[2].id).toBe(87);
    expect(hostComponent.itemEditComponent.items[2].name).toBe('cheese');
    expect(hostComponent.itemEditComponent.items[2].cal).toBe(892);
    expect(hostComponent.itemEditComponent.items.length).toBe(4);

    const updated = {'id': 87, 'name': 'cheesy', 'cal': 72};
    hostComponent.itemEditComponent.updateItem(updated);

    expect(hostComponent.itemEditComponent.items[2].id).toBe(87);
    expect(hostComponent.itemEditComponent.items[2].name).toBe('cheesy');
    expect(hostComponent.itemEditComponent.items[2].cal).toBe(72);
    expect(hostComponent.itemEditComponent.items.length).toBe(4);

    expect(tableSpy.renderRows).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(hostComponent.itemEditComponent.items);
  });


  it('should add item to the list and notify parent when a new item is added', () => {
    const tableSpy: MatTable<any> = jasmine.createSpyObj('MatTable', ['renderRows']);
    hostComponent.itemEditComponent.table = tableSpy;
    hostComponent.itemEditComponent.items = testFields;
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.updateItems = eventEmitterSpy;
    
    expect(hostComponent.itemEditComponent.items.length).toBe(4);

    const newItem = {'id': 0, 'name': 'knoppers', 'cal': 987};
    hostComponent.itemEditComponent.updateItem(newItem);

    expect(hostComponent.itemEditComponent.items[4].id).not.toEqual(0);
    expect(hostComponent.itemEditComponent.items[4].name).toBe('knoppers');
    expect(hostComponent.itemEditComponent.items[4].cal).toBe(987);
    expect(hostComponent.itemEditComponent.items.length).toBe(5);
    
    expect(tableSpy.renderRows).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).toHaveBeenCalledWith(hostComponent.itemEditComponent.items);
  });


  it('should notify parent when existing screen', () => {
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.exitEditList = eventEmitterSpy;

    hostComponent.itemEditComponent.exit();
    expect(eventEmitterSpy.emit).toHaveBeenCalled();
  });


  it ('should display the bottom sheet item editor with the correct item and update the list of items with the new value', async () => {
    const tableSpy: MatTable<any> = jasmine.createSpyObj('MatTable', ['renderRows']);
    hostComponent.itemEditComponent.table = tableSpy;
    hostComponent.itemEditComponent.items = testFields;
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.updateItems = eventEmitterSpy;
    
    const toUpdate = {'id': 87, 'name': 'cheesy', 'cal': 72};
    const updated = {'id': 87, 'name': 'cheesu', 'cal': 823};
    
    const bottomSheetRefSpy = jasmine.createSpyObj('MatBottomSheetRef', ['afterDismissed']);
    bottomSheetRefSpy.afterDismissed.and.returnValue(asyncData(updated));

    bottomSheetSpy.open.and.returnValue(bottomSheetRefSpy);
    hostComponent.itemEditComponent.displayEditItemSheet(toUpdate);

    await hostFixture.whenStable();

    expect(bottomSheetSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {data: {item: toUpdate}});
    expect(bottomSheetRefSpy.afterDismissed).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).toHaveBeenCalled();

    expect(hostComponent.itemEditComponent.items[2].id).toEqual(87);
    expect(hostComponent.itemEditComponent.items[2].name).toBe('cheesu');
    expect(hostComponent.itemEditComponent.items[2].cal).toBe(823);
    expect(hostComponent.itemEditComponent.items.length).toBe(5)
  });


  it ('should display the bottom sheet item editor with the correct item but not update anything if item becomes nothing', async () => {
    const tableSpy: MatTable<any> = jasmine.createSpyObj('MatTable', ['renderRows']);
    hostComponent.itemEditComponent.table = tableSpy;
    hostComponent.itemEditComponent.items = testFields;
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.updateItems = eventEmitterSpy;
    
    const toUpdate = {'id': 78, 'name': 'sausages', 'cal': 92};
    const updated = undefined;
    
    const bottomSheetRefSpy = jasmine.createSpyObj('MatBottomSheetRef', ['afterDismissed']);
    bottomSheetRefSpy.afterDismissed.and.returnValue(asyncData(updated));

    bottomSheetSpy.open.and.returnValue(bottomSheetRefSpy);
    hostComponent.itemEditComponent.displayEditItemSheet(toUpdate);

    await hostFixture.whenStable();

    expect(bottomSheetSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {data: {item: toUpdate}});
    expect(bottomSheetRefSpy.afterDismissed).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).not.toHaveBeenCalled();

    expect(hostComponent.itemEditComponent.items[1].id).toEqual(78);
    expect(hostComponent.itemEditComponent.items[1].name).toBe('sausages');
    expect(hostComponent.itemEditComponent.items[1].cal).toBe(92);
    expect(hostComponent.itemEditComponent.items.length).toBe(5)
  });

  
  it ('should display the bottom sheet item editor with the item indicated by the id', async () => {
    const tableSpy: MatTable<any> = jasmine.createSpyObj('MatTable', ['renderRows']);
    hostComponent.itemEditComponent.table = tableSpy;
    hostComponent.itemEditComponent.items = testFields;
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.updateItems = eventEmitterSpy;
    
    const toUpdate = {'id': 78, 'name': 'sausages', 'cal': 92};
    const updated = {'id': 0, 'name': '--', 'cal': 0};
    
    const bottomSheetRefSpy = jasmine.createSpyObj('MatBottomSheetRef', ['afterDismissed']);
    bottomSheetRefSpy.afterDismissed.and.returnValue(asyncData(updated));

    bottomSheetSpy.open.and.returnValue(bottomSheetRefSpy);
    hostComponent.itemEditComponent.editItem(78)

    await hostFixture.whenStable();

    expect(bottomSheetSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {data: {item: toUpdate}});
    expect(bottomSheetRefSpy.afterDismissed).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).toHaveBeenCalled();
  });


  it ('should display the bottom sheet item editor with blank data when user wants to enter a new value', async () => {
    const tableSpy: MatTable<any> = jasmine.createSpyObj('MatTable', ['renderRows']);
    hostComponent.itemEditComponent.table = tableSpy;
    hostComponent.itemEditComponent.items = testFields;
    const eventEmitterSpy = jasmine.createSpyObj('EventEmitter', ['emit']);
    hostComponent.itemEditComponent.updateItems = eventEmitterSpy;
    
    const newItem = {'id': 0, 'name': undefined, 'cal': undefined};
    const updated = {'id': 999, 'name': 'kjups', 'cal': 392};
    
    const bottomSheetRefSpy = jasmine.createSpyObj('MatBottomSheetRef', ['afterDismissed']);
    bottomSheetRefSpy.afterDismissed.and.returnValue(asyncData(updated));

    bottomSheetSpy.open.and.returnValue(bottomSheetRefSpy);
    hostComponent.itemEditComponent.newItem();

    await hostFixture.whenStable();

    expect(bottomSheetSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {data: {item: newItem}});
    expect(bottomSheetRefSpy.afterDismissed).toHaveBeenCalled();
    expect(eventEmitterSpy.emit).toHaveBeenCalled();
    expect(hostComponent.itemEditComponent.items[6].id).toEqual(999);
    expect(hostComponent.itemEditComponent.items[6].name).toBe('kjups');
    expect(hostComponent.itemEditComponent.items[6].cal).toBe(392);
    expect(hostComponent.itemEditComponent.items.length).toBe(7)
  });
});
