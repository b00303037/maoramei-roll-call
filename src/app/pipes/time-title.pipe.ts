import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeTitle',
})
export class TimeTitlePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: string | number | Date): unknown {
    return this.datePipe.transform(value, 'yyyy年M月d日 HH:mm:ss z');
  }
}
