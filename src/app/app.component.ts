import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, filter, tap } from 'rxjs';

import { AddOrEditDialogComponent } from './add-or-edit-dialog/add-or-edit-dialog.component';
import { ChartData, RollCallData as RollCallRecord } from './app.models';

import { environment } from 'src/environments/environment';
import { AddOrEditDialogData } from './add-or-edit-dialog/add-or-edit-dialog.models';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { MediaMatcher } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private _MDQueryListener = () => this.changeDetectorRef.detectChanges();
  private destroy$ = new Subject<null>();

  MDQuery: MediaQueryList = this.media.matchMedia('(min-width: 960px)');

  selectedIndex = 0;

  dataSource: Array<RollCallRecord> = [];
  displayedColumns: Array<string> = [
    'no', // #
    'datetime', // 點名時間
    'names', // 名單
    'actions', // 操作
  ];

  results: Array<ChartData> = [];
  colorScheme = {
    name: 'maoramei',
    selectable: true,
    group: ScaleType.Linear,
    domain: [
      '#e76f51ff',
      '#ee8959ff',
      '#f4a261ff',
      '#efb366ff',
      '#e9c46aff',
      '#8ab17dff',
      '#2a9d8fff',
      '#287271ff',
      '#264653ff',
      '#3a5763ff',
    ],
  };
  legendPositionObject = {
    right: LegendPosition.Right,
    below: LegendPosition.Below,
  };
  yAxisTickFormatting = this._formatYAxisTick.bind(this);

  selected: string | undefined;

  constructor(
    private matDialog: MatDialog,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private decimalPipe: DecimalPipe
  ) {
    this.MDQuery.addEventListener('change', this._MDQueryListener);

    const json: string | null = localStorage.getItem(environment.storageKey);

    if (json !== null) {
      this.dataSource = JSON.parse(json) as Array<RollCallRecord>;

      this.count();
    }
  }

  onAddOrEdit(record?: RollCallRecord, index?: number): void {
    const allNames = this.dataSource
      .reduce<Array<string>>((list, record) => {
        record.names.forEach((name) => {
          if (!list.includes(name)) {
            list.push(name);
          }
        });

        return list;
      }, [])
      .sort();

    this.matDialog
      .open<AddOrEditDialogComponent, AddOrEditDialogData, RollCallRecord>(
        AddOrEditDialogComponent,
        { data: { record, allNames } }
      )
      .afterClosed()
      .pipe(
        filter((result) => result !== undefined),
        tap((result) => {
          if (record !== undefined && index !== undefined) {
            this.dataSource = this.dataSource.map((record, i) =>
              i === index ? { ...(result as RollCallRecord) } : record
            );
          } else {
            this.dataSource = [...this.dataSource, result as RollCallRecord];
          }

          this.sortData();
          this.count();

          this._saveToLocalStorage();
        })
      )
      .subscribe();
  }

  onSelect(name: string): void {
    this.selected = this.selected === name ? undefined : name;

    console.log(this.selected);
  }

  onDelete(index: number): void {
    this.dataSource = this.dataSource.filter((record, i) => i !== index);
    this.count();

    this._saveToLocalStorage();
  }

  sortData(): void {
    this.dataSource.sort(
      (a, b) => new Date(a.datetime).valueOf() - new Date(b.datetime).valueOf()
    );
  }

  ngOnDestroy(): void {
    this.MDQuery.removeEventListener('change', this._MDQueryListener);

    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private count(): void {
    const allResults = this.dataSource
      .reduce<Array<ChartData>>((list, data) => {
        data.names.forEach((name) => {
          const existed = list.find((item) => item.name === name);

          if (existed) {
            existed.value++;
          } else {
            list.push({ name, value: 1 });
          }
        });

        return list;
      }, [])
      .sort((a, b) => b.value - a.value);

    let end = allResults.length;

    if (allResults.length > 10) {
      const tenthValue = allResults[9].value;

      end = allResults
        .map((item) => item.value === tenthValue)
        .lastIndexOf(true);
    }

    this.results = allResults.slice(0, end + 1);
  }

  private _formatYAxisTick(value: number): string | null {
    const trimmed = this.decimalPipe.transform(value, '1.0-0');

    return trimmed === `${value}` ? trimmed : '';
  }

  private _saveToLocalStorage(): void {
    console.warn('_saveToLocalStorage');

    localStorage.setItem(
      environment.storageKey,
      JSON.stringify(this.dataSource)
    );
  }
}
