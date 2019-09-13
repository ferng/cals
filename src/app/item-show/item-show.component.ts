import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Item } from '../food-list/food-list.service';

@Component({
  selector: 'app-item-show',
  templateUrl: './item-show.component.html',
  styleUrls: ['./item-show.component.css']
})
export class ItemShowComponent implements OnInit {
  @Input() item: Item;
  @Input() id: string;

  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

	foodShow = this.fb.group({
		name : [''],
		cals : [''],
	});	
}
