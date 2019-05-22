import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { FsBuildService } from '../../services/build.service';
import { format, isValid } from 'date-fns';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-build',
  templateUrl: 'build.component.html',
  styleUrls: [ 'build.component.scss' ],
})
export class FsBuildComponent implements OnDestroy, OnChanges {

  @Input() name = '';
  @Input() date;
  @Input() platform;

  public buildTooltip;
  private _destroy$ = new Subject();

  constructor(private fsBuild: FsBuildService) {

    this.fsBuild.buildChange$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((data: any) => {
      if (data) {
        this.date = data.date;
        this.name = data.name;
        this.renderTooltip();
      }
    });
  }

  ngOnChanges() {
    this.renderTooltip();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private renderTooltip() {

    const parts = [];

    if (this.name) {
      let name = this.name;

      if (this.platform) {
        name += ':' + this.platform;
      }

      parts.push(name);
    }

    if (isValid(new Date(this.date))) {
      parts.push(format(new Date(this.date), 'PPpp'));
    }

    this.buildTooltip = parts.join('\n');
  }
}
