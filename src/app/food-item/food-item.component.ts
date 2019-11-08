import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { Item, itemIdx } from '../food-list/food-list.service';
import { FieldSelectComponent } from '../field-select/field-select.component';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css'],
})
export class FoodItemComponent implements OnInit {
  @Input() items: Item[];
  @Input() curCals: Map<number, number>;
  @Input() id: number;
  @Output() calcCals = new EventEmitter<Item>();
  @ViewChild('fieldSelect', {static: false}) fieldSelect: FieldSelectComponent;

  constructor(private fb: FormBuilder) { }

  ngOnInit () { 
    if (this.items && this.id < this.curCals.size) {
      let entries = Array.from(this.curCals);
      this.reApplyVal(entries[this.id][0], entries[this.id][1]);
    }
  }

	foodForm = this.fb.group({
    id : [],
    grams : [''],
    cals : [],
	});	

	newSelection(val) {
    if (val) {
      this.foodForm.value.id = val.id;
      this.foodForm.setValue(this.foodForm.value);
      this.updateCals();
    }
	}

	calcCalsFromGrams() {
    this.updateCals();
	}
 
  calcGramsFromCals() {
    this.updateGrams();
  }

  updateCals() {
    const id = Number.parseInt(this.foodForm.value.id, 10)
    const selected = this.items[itemIdx(this.items, id)]
    const grams = this.foodForm.value.grams;
    const cals = this.foodForm.value.cals;
 
    if (this.notBlank(grams)) {
      this.foodForm.value.cals = Math.ceil((selected.cal / 100) * Number.parseInt(grams));
      this.notifyParent(this.foodForm.value.cals);
      this.foodForm.setValue(this.foodForm.value);
    }
  }
  
  updateGrams() {
    const id = Number.parseInt(this.foodForm.value.id, 10)
    const selected = this.items[itemIdx(this.items, id)]
    const grams = this.foodForm.value.grams;
    const cals = this.foodForm.value.cals;
 
    if (this.notBlank(cals)) {
      this.foodForm.value.grams = Math.floor((Number.parseInt(cals) / selected.cal) * 100);
      this.notifyParent(this.foodForm.value.cals);
      this.foodForm.setValue(this.foodForm.value);
    }
  }

  notifyParent(selCal) {
    const updated = {"id": Number.parseInt(this.foodForm.value.id,10), "name": this.foodForm.value.name, "cal": Number.parseInt(this.foodForm.value.cals, 10)};
    this.calcCals.emit(updated);
  }

  clearItem() {
    this.foodForm.reset();
    this.fieldSelect.resetSelection(null);
  };

  reApplyVal(id: number, cals: number) {
    this.foodForm.value.id = id;
    this.foodForm.value.cals = cals;
    this.updateGrams();
//     this.fieldSelect.resetSelection(id);
//     this.foodForm.setValue(this.foodForm.value);
  }

  notBlank(data: string) {
    return (data !== null && data !== undefined && data !== "");
  }
}
