import { FormControl } from '@angular/forms';
import { RollCallData } from '../app.models';

export interface AddOrEditDialogData {
  record: RollCallData | undefined;
  allNames: Array<string>;
}

export interface AddOrEditFCs {
  // 點名時間
  /**
   * 日期
   */
  date: FormControl<Date | null>;
  /**
   * 時
   */
  hours: FormControl<number | null>;
  /**
   * 分
   */
  minutes: FormControl<number | null>;

  // 名單
  nameSet: FormControl<Set<string>>;
}
