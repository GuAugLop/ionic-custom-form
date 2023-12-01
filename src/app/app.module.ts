import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomFormModule } from '../../projects/ionic-custom-form/src/lib/custom-form.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CustomFormModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
