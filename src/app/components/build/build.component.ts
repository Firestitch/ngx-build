import { Component, OnDestroy } from '@angular/core';
import { FsBuildService } from '../../services/build.service';
import { format } from 'date-fns';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-build',
  templateUrl: 'build.component.html',
  styleUrls: [ 'build.component.scss' ],
})
export class FsBuildComponent implements OnDestroy {

  public build;
  private _destroy$ = new Subject();

  constructor(private fsBuild: FsBuildService) {

    this.fsBuild.buildChange$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((data: any) => {
      if (data.date) {
        const date = new Date(data.date);
        this.build = data.name.concat('\n', format(date, 'PPpp'));
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
