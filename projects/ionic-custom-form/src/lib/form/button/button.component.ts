import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gs3-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  fill = 'solid';
  @Input()
  disabled = false;
  @Input()
  expand?: string = undefined;
  @Input()
  type = 'button';

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() click = new EventEmitter();

  public onClick() {
    if (this.disabled) return;
    else this.click.emit();
  }

  constructor() {}
}
