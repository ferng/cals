import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Item } from '../food-list/food-list.service';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css'],
})

export class FoodItemComponent implements OnInit {
  @Input() items: Items[];

  constructor(private fb: FormBuilder) { }

  ngOnInit () {
    console.log(this.items);
  }

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
    let selCal = this.foodForm.value.selectedCal;
    let grams = this.foodForm.value.grams;
    let cals = this.foodForm.value.cals;
 
    if (this.notBlank(grams) && this.notBlank(selCal)) {
      this.foodForm.value.cals = Math.ceil((Number.parseInt(selCal) / 100) * Number.parseInt(grams));
      this.foodForm.setValue(this.foodForm.value);
    }
    console.log(this.foodForm.value);

  }
  
  updateGrams() {
    let selCal = this.foodForm.value.selectedCal;
    let grams = this.foodForm.value.grams;
    let cals = this.foodForm.value.cals;
 
    if (this.notBlank(cals) && this.notBlank(selCal)) {
      this.foodForm.value.grams = Math.floor((Number.parseInt(cals) / Number.parseInt(selCal)) * 100);
      this.foodForm.setValue(this.foodForm.value);
    }
    console.log(this.foodForm.value);
  }

  notBlank(data: string) {
    return (data !== null && data !== undefined && data !== "");
  }

}
