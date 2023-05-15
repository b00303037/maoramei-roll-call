import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import localeZhHant from '@angular/common/locales/zh-Hant';

/** @angular/material */
import {
  DateAdapter,
  MatDateFormats,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogConfig,
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import {
  MatFormFieldDefaultOptions,
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

/** @swimlane/ngx-charts */
import { NgxChartsModule } from '@swimlane/ngx-charts';

/** date-fns */
import { zhTW } from 'date-fns/locale';

/** @angular/material-date-fns-adapter */
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';

import { AddOrEditDialogComponent } from './add-or-edit-dialog/add-or-edit-dialog.component';
import { TimeTitlePipe } from './pipes/time-title.pipe';
import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';

registerLocaleData(localeZhHant);

const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'yyyy MMM',
    dateA11yLabel: 'yyyy-MM-dd',
    monthYearA11yLabel: 'yyyy MMM',
  },
};
const DIALOG_DEFAULT_OPTIONS: MatDialogConfig = {
  disableClose: true,
  hasBackdrop: true,
  maxWidth: 'min(calc(100% - 2rem), 1280px)',
  width: '320px',
};
const FORM_FIELD_DEFAULT_OPTIONS: MatFormFieldDefaultOptions = {
  appearance: 'fill',
};

const MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatButtonModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
];
const PIPES = [TimeTitlePipe];

@NgModule({
  declarations: [AppComponent, AddOrEditDialogComponent, ...PIPES],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    /** @angular/material */
    ...MATERIAL_MODULES,
    /** @swimlane/ngx-charts */
    NgxChartsModule,
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    { provide: DateAdapter, useClass: DateFnsAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: zhTW },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: DIALOG_DEFAULT_OPTIONS },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: FORM_FIELD_DEFAULT_OPTIONS,
    },
    { provide: LOCALE_ID, useValue: 'zh-Hant' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
