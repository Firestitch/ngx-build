import { Component, OnDestroy, Inject } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { format, isValid } from 'date-fns';

import { FsBuildService } from '../../services/build.service';
import { FS_BUILD_DATA } from './../../injectors/build-data.injector';
import { BuildData } from './../../interfaces/build-data';


@Component({
  selector: 'fs-build',
  templateUrl: 'build.component.html',
  styleUrls: [ 'build.component.scss' ],
})
export class FsBuildComponent implements OnDestroy {

  private _destroy$ = new Subject();

  constructor(
    private _buildService: FsBuildService,
    private _prompt: FsPrompt,
    @Inject(FS_BUILD_DATA) private _build: BuildData,
  ) {
    this._buildService.buildChange$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((build: BuildData) => {
      this._build = build;
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public open() {
    this._prompt.confirm({
      title: 'Build Info',
      template: this._getBuildInfo(),
      class: 'fs-build-overlay-pane',
      buttons: [
        {
          label: 'Done',
          color: 'primary'
        }
      ]
    });
  }

  private _getBuildInfo() {
    const parts = [];

    if (this._build) {
      if (this._build.name) {
        parts.push('Name: ' + this._build.name);
      }

      if (this._build.version) {
        parts.push('Version: ' + this._build.version);
      }

      if (isValid(new Date(this._build.date))) {
        parts.push('Date: ' + format(new Date(this._build.date), 'PPpp'));
      }
    }

    return parts.join('<br>');
  }
}
