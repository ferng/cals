import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Item } from '../food-list/food-list.service';

import { MatDialog, MatTable } from '@angular/material';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  @Input() items: Item[];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'cal', 'action'];

  constructor() { }

  ngOnInit() { }
}
