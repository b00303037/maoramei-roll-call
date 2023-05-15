import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Observable,
  Subject,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  tap,
} from 'rxjs';
import { AddOrEditDialogData, AddOrEditFCs } from './add-or-edit-dialog.models';
import {
  FormErrorStateMatcher,
  MinSizeErrorStateMatcher,
  ValidatorsExtra,
} from '../validators/validators-extra';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RollCallData } from '../app.models';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { parse } from 'date-fns';

@Component({
  selector: 'app-add-or-edit-dialog',
  templateUrl: './add-or-edit-dialog.component.html',
  styleUrls: ['./add-or-edit-dialog.component.scss'],
})
export class AddOrEditDialogComponent implements OnInit, OnDestroy {
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();
  private destroy$ = new Subject<null>();

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');

  nameCtrl = new FormControl('', {
    nonNullable: false,
  });
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredNames: Observable<string[]> = this.nameCtrl.valueChanges.pipe(
    startWith(null),
    map((name: string | null) =>
      name ? this._filter(name) : [...this.allNames]
    )
  );
  allNames: string[] = this.data.allNames;

  now = new Date();
  fg = new FormGroup<AddOrEditFCs>(
    {
      date: new FormControl(this.now),
      hours: new FormControl(this.now.getHours(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      minutes: new FormControl(this.now.getMinutes(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      nameSet: new FormControl(new Set<string>(), {
        nonNullable: true,
        validators: [ValidatorsExtra.minSize(10)],
      }),
    },
    {
      validators: ValidatorsExtra.datetime(
        {
          date: 'date',
          hours: 'hours',
          minutes: 'minutes',
        },
        'datetime'
      ),
    }
  );
  fcs: AddOrEditFCs = {
    date: this.fg.controls['date'],
    hours: this.fg.controls['hours'],
    minutes: this.fg.controls['minutes'],
    nameSet: this.fg.controls['nameSet'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  hoursList: Array<number> = this._getNumberList(0, 23);
  minutesList: Array<number> = this._getNumberList(0, 59);

  datetimeErrorStateMatcher = new FormErrorStateMatcher('datetime');
  minSizeErrorStateMatcher = new MinSizeErrorStateMatcher();

  isNew = this.data.record === undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: AddOrEditDialogData,
    private dialogRef: MatDialogRef<AddOrEditDialogComponent>,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dialogRef.updateSize('960px');

    this.SMQuery.addEventListener('change', this._SMQueryListener);

    if (!this.isNew) {
      const { datetime, names } = this.data.record as RollCallData;
      const date = new Date(datetime);

      this.fg.setValue({
        date,
        hours: date.getHours(),
        minutes: date.getMinutes(),
        nameSet: new Set(names),
      });
    }
  }

  ngOnInit(): void {}

  addName(event: MatChipInputEvent): void {
    const name = (event.value || '').trim();

    if (name) {
      const nameSet = this.fcs['nameSet'].value;

      nameSet.add(name);

      this.fcs['nameSet'].setValue(nameSet);
    }

    event.chipInput!.clear();

    this.nameCtrl.setValue('');
  }

  removeName(name: string): void {
    const nameSet = this.fcs['nameSet'].value;

    nameSet.delete(name);

    this.fcs['nameSet'].setValue(nameSet);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const nameSet = this.fcs['nameSet'].value;

    nameSet.add(event.option.viewValue);

    this.fcs['nameSet'].setValue(nameSet);

    this.nameInput.nativeElement.value = '';
    this.nameCtrl.setValue('');
  }

  onSubmit(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid) {
      return;
    }

    const { date, hours, minutes, nameSet } = this.fv;

    const result: RollCallData = {
      datetime: parse(
        `${hours}:${minutes}:0 0`,
        'H:m:s S',
        date as Date
      ).toISOString(),
      names: [...nameSet],
    };

    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.SMQuery.removeEventListener('change', this._SMQueryListener);

    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allNames.filter((name) =>
      name.toLowerCase().includes(filterValue)
    );
  }

  private _getNumberList(
    from: number,
    to: number,
    step: number = 1
  ): Array<number> {
    if (step === 0) {
      return [from];
    }

    const list: Array<number> = [];
    const isAsc: boolean = step > 0;

    for (let i = from; isAsc ? i <= to : i >= to; i += step) {
      list.push(i);
    }

    return list;
  }
}
