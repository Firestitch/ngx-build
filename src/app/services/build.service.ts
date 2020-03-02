import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FsPrompt } from '@firestitch/prompt';
import { isAfter } from 'date-fns';
import { Subject, timer, of } from 'rxjs';
import { flatMap, takeUntil, catchError } from 'rxjs/operators';
import { FS_BUILD_CONFIG } from '../injectors';
import { BuildConfig } from '../interfaces/build-config';


@Injectable()
export class FsBuildService implements OnDestroy {

  private date: Date;

  public buildChange$ = new Subject();
  private _destroy$ = new Subject();

  constructor(private http: HttpClient,
              private fsPrompt: FsPrompt,
              @Inject(FS_BUILD_CONFIG) private config: BuildConfig) {
    this.config = Object.assign({ enabled: true,
                                  interval: 30,
                                  path: 'assets/build.json',
                                  origin: window.location.origin }, config);
    this.listen();
  }

  public listen() {

    if (this.config.enabled === false) {
      return;
    }

    timer(0, this.config.interval * 1000)
    .pipe(
      takeUntil(this._destroy$),
      flatMap(() =>
        this.get()
        .pipe(
          catchError((err, o) => of())
        )
      ),
    )
    .subscribe((data: any) => {
      if (data.date) {
        const date = new Date(data.date);

        if (this.date && isAfter(date, this.date)) {
          this.fsPrompt.confirm({
            title: 'Upgrade',
            template: 'There is a new version of this app available. Would you like to update now?'
          })
          .pipe(
            takeUntil(this._destroy$)
          )
          .subscribe(() => {
            window.location.reload(true);
          });
        }

        this.date = date;
        this.buildChange$.next(data);
      }
    });
  }

  private get() {

    const url = new URL(this.config.origin);
    url.pathname = this.config.path;
    const config = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };

    return this.http.get(url.toString(), config)
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
