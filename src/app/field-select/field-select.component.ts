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
  @Input() fields ;
  @Output() updateSelection = new EventEmitter<any>();

//   fields: Field[] = [{"name": "hello"}, {"name": "bye"}, {"name": "what"}];
  fieldCtrl: FormControl = new FormControl();
  fieldFilterCtrl: FormControl = new FormControl();
  filteredFields: ReplaySubject<Item[]> = new ReplaySubject<Item[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor() { }

  ngOnInit() {
//     console.log(this.items);
    // set initial selection
//     this.fieldCtrl.setValue(this.fields[0]);

    // load the initial bank list
    this.filteredFields.next(this.fields.slice());

    this.fieldCtrl.valueChanges
      .subscribe((val) => {
        this.updateSelection.emit(val);
      });

    // listen for search field value changes
    this.fieldFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterFields();
      });
  }

  clearSelection() {
    console.log(this.fieldCtrl);
     this.fieldCtrl.setValue(null);
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
  this.filteredFields
    .pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(() => {
      this.singleSelect.compareWith = (a: Item, b: Item) => a && b && a.name === b.name;
    });
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
    // filter the banks
    this.filteredFields.next(
      this.fields.filter(field => field.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
