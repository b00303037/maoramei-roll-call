import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ValidatorsExtra {
  static datetime(
    paths: {
      date: string;
      hours: string;
      minutes: string;
    },
    errorName: string = 'datetime'
  ): ValidatorFn {
    return datetimeValidator(paths, errorName);
  }

  static minSize(minSize: number): ValidatorFn {
    return minSizeValidator(minSize);
  }
}

export function datetimeValidator(
  paths: {
    date: string;
    hours: string;
    minutes: string;
  },
  errorName: string
): ValidatorFn {
  return (control) => {
    const dateFC = control.get(paths.date) as AbstractControl<Date | null>;
    const hoursFC = control.get(paths.hours) as AbstractControl<number | null>;
    const minutesFC = control.get(paths.minutes) as AbstractControl<
      number | null
    >;

    const date = dateFC.value;
    const hours = hoursFC.value;
    const minutes = minutesFC.value;

    if (asValid(dateFC) || asValid(hoursFC) || asValid(minutesFC)) {
      return null;
    }

    if (isEmpty(date) && isEmpty(hours) && isEmpty(minutes)) {
      return null;
    }

    if (!isEmpty(date) && !isEmpty(hours) && !isEmpty(minutes)) {
      return null;
    }

    return { [`${errorName}`]: { date, hours, minutes } };
  };
}

export function minSizeValidator(minSize: number): ValidatorFn {
  return (control) => {
    const size = control.value.size;

    if (size >= minSize) {
      return null;
    }

    return {
      minSize: { requiredSize: minSize, actualSize: size },
    };
  };
}

export class FormErrorStateMatcher implements ErrorStateMatcher {
  errorName: string;

  constructor(errorName: string) {
    this.errorName = errorName;
  }

  isErrorState(
    control: FormControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    return (
      !asValid(control) && (control.invalid || form.hasError(this.errorName))
    );
  }
}

export class MinSizeErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    return (
      !asValid(control) && (control.invalid || control.hasError('minSize'))
    );
  }
}

function isEmpty(value: unknown): boolean {
  return value === '' || value === null || value === undefined;
}

function asValid(control: AbstractControl): boolean {
  return control.disabled || (control.untouched && control.pristine);
}
