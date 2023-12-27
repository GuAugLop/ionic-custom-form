import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';

export interface AutoCompleteOption {
  value: string;
  label: string;
}

@Component({
  selector: 'gs3-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor, OnChanges {
  input = '';
  @Input()
  options: AutoCompleteOption[] = [];

  copyOptions: AutoCompleteOption[] = [];

  filteredOptions!: Observable<AutoCompleteOption[]>;
  @Input()
  disabled = false;
  @Input()
  label = '';

  selected: any = '';

  required = false;

  public ngControl: NgControl | null = null;

  @Output()
  valueEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor(private injector: Injector) {}

  private _filter(value: string): AutoCompleteOption[] {
    if (typeof value !== 'string') {
      const input = this.input as unknown as AutoCompleteOption;
      value = input.value;
    }
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (option) =>
        option.label.toLowerCase().includes(filterValue) ||
        option.value.toLowerCase().includes(filterValue)
    );
  }

  onChange!: any;
  onTouch = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(input: string) {
    this.input = input;
  }

  handleChange() {
    if (this.options.find((o) => o.label === this.input.trim())) {
      this.onSelected({
        option: this.options.find((o) => o.label === this.input.trim()),
      } as any);
    }
    this.filteredOptions = of(this._filter(this.input || ''));
    this.valueEmitter.emit(this.input);
  }

  onBlur() {
    this.input = this.selected;
    this.onTouch();
  }

  onFocus() {
    this.filteredOptions = of(this._filter(this.input || ''));
    this.onTouch();
  }

  onSelected(value: MatAutocompleteSelectedEvent) {
    this.selected = value.option.value;
    this.onChange(value.option.value);
  }

  displayFn(value: any): string {
    return value?.label || '';
  }

  private get control(): NgControl | null {
    if (!this.ngControl) {
      this.ngControl = this.injector.get(NgControl, null);
    }
    this.required = this.ngControl?.control?.hasValidator(
      Validators.required
    ) as boolean;

    return this.ngControl;
  }

  get isInvalid() {
    const control = this.control?.control;

    return control && control.invalid && (control.dirty || control.touched);
  }

  ngOnChanges(changes: any) {
    if (changes?.options?.currentValue.length) {
      this.copyOptions = [...changes.options.currentValue];
      this.displayFn = (value: any) => {
        return this.options.find((o) => o.value === value)?.label || '';
      };
    }
  }
}
