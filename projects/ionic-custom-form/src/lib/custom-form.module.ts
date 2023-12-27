import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './form/autocomplete/autocomplete.component';
import { ButtonComponent } from './form/button/button.component';
import { CheckboxComponent } from './form/checkbox/checkbox.component';
import { DatepickerComponent } from './form/datepicker/datepicker.component';
import { DropdownComponent } from './form/dropdown/dropdown.component';
import { InputComponent } from './form/input/input.component';
import { PercentageInputComponent } from './form/percentage-input/percentage-input.component';
import { RadioComponent } from './form/radio/radio.component';
import { SearchInputComponent } from './form/search-input/search-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaskModule, NgxMaskPipe } from 'ngx-mask';
import { CustomFormService } from './custom-form.service';
import { ToggleComponent } from './form/toggle/toggle.component';

export interface LibConfig {
  apiUrl: string;
}

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    AutocompleteComponent,
    ButtonComponent,
    CheckboxComponent,
    DatepickerComponent,
    DropdownComponent,
    InputComponent,
    PercentageInputComponent,
    RadioComponent,
    SearchInputComponent,
    ToggleComponent,
  ],
  exports: [
    AutocompleteComponent,
    ButtonComponent,
    CheckboxComponent,
    DatepickerComponent,
    DropdownComponent,
    InputComponent,
    PercentageInputComponent,
    RadioComponent,
    SearchInputComponent,
    ToggleComponent,
  ],
  providers: [NgxMaskPipe, { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class CustomFormModule {
  static forRoot(config: LibConfig) {
    return {
      ngModule: CustomFormModule,
      providers: [
        CustomFormService,
        {
          provide: LibConfigService,
          useValue: config,
        },
      ],
    };
  }
}
