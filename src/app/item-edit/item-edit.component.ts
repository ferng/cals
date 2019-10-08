import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Item } from '../food-list/food-list.service';

import { MatTable } from '@angular/material';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  @Input() items: Item[];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @Output() calcCals = new EventEmitter<Item>();
  
  displayedColumns: string[] = ['name', 'cal', 'action'];

  constructor() { }

  ngOnInit() { }
}
