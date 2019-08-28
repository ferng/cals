import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Item, UpdateMsg } from '../food-list/food-list.service';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css'],
})

export class FoodItemComponent implements OnInit {
  @Input() items: Item[];
  @Input() id: number;
  @Output() calcCals = new EventEmitter<UpdateMsg>();

  constructor(private fb: FormBuilder) { }

  ngOnInit () { }

	foodForm = this.fb.group({
		selectedCal : [''],
		grams : [''],
		cals : [''],
	});	

	newSelection(event) {
		this.updateCals();
	}

	calcCalsFromGrams() {
    this.updateCals();
	}
 
  calcGramsFromCals() {
    this.updateGrams();
  }

  updateCals() {
    const selCal = this.foodForm.value.selectedCal;
    const grams = this.foodForm.value.grams;
    const cals = this.foodForm.value.cals;
 
    if (this.notBlank(grams) && this.notBlank(selCal)) {
      this.foodForm.value.cals = Math.ceil((Number.parseInt(selCal) / 100) * Number.parseInt(grams));
      this.notifyParent(this.foodForm.value.cals);
      this.foodForm.setValue(this.foodForm.value);
    }
  }
  
  updateGrams() {
    const selCal = this.foodForm.value.selectedCal;
    const grams = this.foodForm.value.grams;
    const cals = this.foodForm.value.cals;
 
    if (this.notBlank(cals) && this.notBlank(selCal)) {
      this.foodForm.value.grams = Math.floor((Number.parseInt(cals) / Number.parseInt(selCal)) * 100);
      this.notifyParent(this.foodForm.value.cals);
      this.foodForm.setValue(this.foodForm.value);
    }
  }

  notifyParent(selCal) {
    const updateMsg = {"id": this.id, "cals": Number.parseInt(this.foodForm.value.cals, 10)};
    console.log(this);
    this.calcCals.emit(updateMsg);
  }

  clearItem() {
    console.log(this.cals);
  };

  notBlank(data: string) {
    return (data !== null && data !== undefined && data !== "");
  }

}
