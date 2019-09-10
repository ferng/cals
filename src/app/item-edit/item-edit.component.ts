import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Item } from '../food-list/food-list.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  @Input() item: Item;
  @Input() id: string;

  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

	foodEdit = this.fb.group({
		name : [''],
		cals : [''],
	});	
}
