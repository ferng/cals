import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Item } from '../food-list/food-list.service';

@Component({
  selector: 'app-field-select',
  templateUrl: './field-select.component.html',
  styleUrls: ['./field-select.component.css']
})
export class FieldSelectComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() fields;
  @Input() selectionId: number;
  @Output() updateSelection = new EventEmitter<any>();

  fieldCtrl: FormControl = new FormControl();
  fieldFilterCtrl: FormControl = new FormControl();
  filteredFields: ReplaySubject<Item[]> = new ReplaySubject<Item[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor() { }

  ngOnInit() {
    this.resetSelection(this.selectionId);

    // load the initial field list
    this.filteredFields.next(this.fields.slice());

    // listen for item selection changes
    this.fieldCtrl.valueChanges
      .subscribe((val) => {
        this.updateSelection.emit(val);
      });

    // listen for search field autocomplete search changes
    this.fieldFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterFields();
      });
  }

  resetSelection(id) {
    if (id === null) {
      this.fieldCtrl.setValue(null);
    } else {
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i];
        if (field.id === id) {
          this.fieldCtrl.setValue(field);
        }
      }
    }
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterFields() {
    if (!this.fields) {
      return;
    }
    // get the search keyword
    let search = this.fieldFilterCtrl.value;
    if (!search) {
      this.filteredFields.next(this.fields.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the fields
    this.filteredFields.next(
      this.fields.filter(field => field.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
