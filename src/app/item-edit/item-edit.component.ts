import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { MatTable } from '@angular/material';

import { Item, itemIdx } from '../food-list/food-list.service';
import { FoodEditorComponent } from '../food-editor/food-editor.component';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  @Input() items: Item[];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @Output() updateItems = new EventEmitter<Item[]>();
  @Output() exitEditList = new EventEmitter<any>();
  
  displayedColumns: string[] = ['name', 'cal', 'action'];
  constructor(private _bottomSheet: MatBottomSheet) {}
  
  ngOnInit() { }

  deleteItem(id) {
    const idx = itemIdx(this.items, id);
    this.items.splice(idx, 1);
    this.table.renderRows();
    this.updateItems.emit(this.items);
  }

  editItem(id) {
    const idx = itemIdx(this.items, id);
    var item = this.items[idx];
    this.displayEditItemSheet(item);
  }

  newItem() {
    var item = {"id": 0, "name": undefined, "cal": undefined};
    this.displayEditItemSheet(item);
  }

  displayEditItemSheet(item) {
    const bottomSheetRef = this._bottomSheet.open(FoodEditorComponent, {
      data: {
        item: item,
      }
    });
    bottomSheetRef.afterDismissed().subscribe((item: Item) => {
      if (item) {
        this.updateItem(item);
      }
    });
  }

  updateItem(item: Item) {
    const id = item.id;
    if (id === 0) {
      item.id = Date.now();
      this.items.push(item);
    } else { 
      const idx = itemIdx(this.items, id);
      this.items.splice(idx, 1, item);
    }
    this.table.renderRows();
    this.updateItems.emit(this.items);
  }

  exit() {
    this.exitEditList.emit();
  }
 
}
