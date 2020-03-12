import { FS_BUILD_DATA } from './../../injectors/build-data.injector';
import { BuildData } from './../../interfaces/build-data';
import { Component, OnDestroy, Input, Inject } from '@angular/core';
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

  public buildTooltip;
  private _destroy$ = new Subject();

  constructor(private _fsBuild: FsBuildService,
              private _prompt: FsPrompt,
              @Inject(FS_BUILD_DATA) public build: BuildData) {

    this._fsBuild.buildChange$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((data: any) => {
      if (data) {
        this.build.date = data.date;
        this.build.version = data.version;
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

    if (this.build.name) {
      parts.push('Name: ' + this.build.name);
    }

    if (this.build.version) {
      parts.push('Version: ' + this.build.version);
    }

    if (isValid(new Date(this.build.date))) {
      parts.push('Date: ' + format(new Date(this.build.date), 'PPpp'));
    }

    return parts.join('<br>');
  }
}
