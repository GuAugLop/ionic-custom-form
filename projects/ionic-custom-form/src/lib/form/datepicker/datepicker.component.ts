import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';
import moment from '../../utils/moment';

@Component({
  selector: 'gs3-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input()
  placeholder? = '';

  @Input()
  label = '';

  @Input()
  defaultValue? = '';

  disabled!: boolean;

  required = false;

  input = '';

  max? = '';
  min? = '';

  firstRender = false;

  selected!: any;

  invalidDate = false;

  public ngControl: NgControl | null = null;

  @Output()
  valueEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private injector: Injector, private maskPipe: NgxMaskPipe) {}
  // Step 3: Copy paste this stuff here
  onChange: any = () => {};
  onTouch: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  change(input: string) {
    if (
      this.input.length === 10 &&
      moment(this.input, 'DD/MM/YYYY').isValid()
    ) {
      this.selected = moment(this.input, 'DD/MM/YYYY').format(
        'YYYY-MM-DD[T00:01:00]'
      );
      this.onChange(input);
    }
  }

  writeValue(input: string) {
    if (input) {
      if (input.includes('/')) {
        this.input = input;
      } else {
        if (!input.includes('T')) {
          input += 'T00:01:00';
        }
        this.input = moment(input).format('DD/MM/YYYY');
      }
      this.change(this.input);
    }
  }

  handleChange(event: any) {
    this.invalidDate = false;
    if (event.code !== 'Backspace' && event.code !== 'Delete') {
      this.input = this.maskPipe.transform(this.input, '00/00/0000');
      if (this.input.length === 10) {
        this.change(this.input);
      }
    }
    this.valueEmitter.emit(this.input);
  }

  onBlur() {
    if (this.input.length !== 10 && this.selected) {
      if (this.input.length && this.required) {
        this.input = moment(this.selected).format('DD/MM/YYYY');
        this.change(this.input);
      }
    }
    this.onTouch(); // Mark the control as touched
  }

  private get control(): NgControl | null {
    if (!this.ngControl) {
      this.ngControl = this.injector.get(NgControl, null);
    }

    return this.ngControl;
  }

  get isInvalid() {
    const control = this.control?.control;

    return control && control.invalid && (control.dirty || control.touched);
  }
  selectCalendar(event: any) {
    this.input = moment(event.value).format('DD/MM/YYYY');
    this.change(this.input);
  }

  ngAfterContentChecked() {
    if (this.ngControl) {
      this.required =
        this.ngControl?.control?.hasValidator(Validators.required) || false;
    }
    if (this.ngControl?.control?.validator) {
      if (!this.firstRender) {
        if (this.required && !this.input) {
          this.input = moment(new Date()).format('DD/MM/YYYY');
        }
        if (
          this.input &&
          this.max &&
          moment(this.input, 'DD/MM/YYYY').isAfter(this.max)
        ) {
          this.input = moment(this.max).format('DD/MM/YYYY');
        }
        if (
          this.input &&
          this.min &&
          moment(this.input, 'DD/MM/YYYY').isBefore(this.min)
        ) {
          this.input = moment(this.min).format('DD/MM/YYYY');
        }
        if (
          this.min &&
          this.max &&
          moment(this.min).isAfter(moment(this.max))
        ) {
          this.input = '';
        }
      } else {
        this.min = this.ngControl?.control?.validator(
          new FormControl('000/00/0000/0')
        )?.['min'];
        this.max = this.ngControl?.control?.validator(
          new FormControl('000/00/0000/0')
        )?.['max'];
      }

      this.firstRender = true;
    }
    this.change(this.input);
  }
}
