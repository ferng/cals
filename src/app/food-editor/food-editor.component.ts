import { Component, OnInit, Inject} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Item } from '../food-list/food-list.service';

@Component({
  selector: 'app-food-editor',
  templateUrl: './food-editor.component.html',
  styleUrls: ['./food-editor.component.css']
})
export class FoodEditorComponent {
  item: Item;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<FoodEditorComponent>,
    private fb: FormBuilder
  ) {
    this.item = data.item;
  }

  foodForm = this.fb.group({
    name : [this.data.item.name],
    cal : [this.data.item.cal],
    id: [this.data.item.id]
  });

  cancel() {
    this._bottomSheetRef.dismiss();
  }

  save() {
    this.item.name = this.foodForm.value.name.toLowerCase();
    this.item.cal = Number.parseInt(this.foodForm.value.cal, 10);
    this._bottomSheetRef.dismiss(this.item);
  }
}
