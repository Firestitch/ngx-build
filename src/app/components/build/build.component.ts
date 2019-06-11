import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { FsBuildService } from '../../services/build.service';
import { format, isValid } from 'date-fns';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FsPrompt } from '@firestitch/prompt';

@Component({
  selector: 'fs-build',
  templateUrl: 'build.component.html',
  styleUrls: [ 'build.component.scss' ],
})
export class FsBuildComponent implements OnDestroy {

  @Input() name = '';
  @Input() date;
  @Input() platform;

  public buildTooltip;
  private _destroy$ = new Subject();

  constructor(private _fsBuild: FsBuildService,
              private _prompt: FsPrompt) {

    this._fsBuild.buildChange$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((data: any) => {
      if (data) {
        this.date = data.date;
        this.name = data.name;
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public open() {
    this._prompt.confirm({
      title: 'Build Info',
      template: this.getBuildInfo(),
      class: 'fs-build-overlay-pane',
      buttons: [
        {
          label: 'Done',
          color: 'primary'
        }
      ]
    });
  }

  private getBuildInfo() {

    const parts = [];

    if (this.name) {
      let name = this.name;

      if (this.platform) {
        name += ':' + this.platform;
      }

      parts.push('Name: ' + name);
    }

    if (isValid(new Date(this.date))) {
      parts.push('Date: ' + format(new Date(this.date), 'PPpp'));
    }

    return parts.join('<br>');
  }
}
