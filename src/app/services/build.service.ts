import { Injectable, OnDestroy, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FsPrompt } from '@firestitch/prompt';

import { Subject, timer, of, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, catchError, map, filter, take, switchMap } from 'rxjs/operators';

import { isAfter, isValid } from 'date-fns';

import { FS_BUILD_CONFIG } from '../injectors';
import { BuildConfig } from '../interfaces/build-config';
import { BuildData } from '../interfaces';
import { BuildReloadMethod } from '../enums/build-reload-method.enum';


@Injectable()
export class FsBuildService implements OnDestroy {

  private _buildChange$ = new BehaviorSubject<BuildData>(null);
  private _date: Date;
  private _destroy$ = new Subject();
  private _pendingUpdate = false;

  constructor(
    private _http: HttpClient,
    private _prompt: FsPrompt,
    private _router: Router,
    @Inject(FS_BUILD_CONFIG) private config: BuildConfig,
  ) {
    this.listen();
  }

  public get build(): BuildData {
    return this._buildChange$.getValue();
  }

  public get buildChange$() {
    return this._buildChange$
      .pipe(
        filter((build) => !!build),
        takeUntil(this._destroy$),
      );
  }

  public listen() {
    if (this.config.enabled === false) {
      return;
    }

    this.buildChange$
      .subscribe((data: BuildData) => {
        this._date = data.date;
      });

    timer(0, this.config.interval * 1000)
      .pipe(
        takeUntil(this._destroy$),
        filter(() => !this._pendingUpdate),
        switchMap(() =>
          this.get()
            .pipe(
              catchError(() => of(null)),
            )
        ),
        filter((data) => !!data),
    )
    .subscribe((data: BuildData) => {
      this.update(data);
    });
  }

  public update(data: BuildData): void {
    if (isValid(data.date)) {
      if (this._date && isAfter(data.date, this._date)) {
        this._pendingUpdate = true;
        switch (this.config.reloadMethod) {
          case BuildReloadMethod.Prompt:
            this._processPrompt(data);
            break;
          case BuildReloadMethod.Navigation:
            this._processNavigation();
            break;
        }
      }
      this._buildChange$.next(data);
    }
  }

  public get(): Observable<any> {
    const url = new URL(this.config.origin);
    url.pathname = this.config.path;
    const config = {
      headers: null,
    };

    return this._http.get(url.toString(), config)
      .pipe(
        map((data: any) => {
          return {
            ...data,
            date: new Date(data.date),
          }
        }),
      );
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _processNavigation(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(this._reload);
  }

  private _processPrompt(data: BuildData): void {
    const message = data.version ? `Newer version ${data.version} of this app is available` : 'There is a newer version of this app available';

    this._prompt.confirm({
      title: 'New App Version Available',
      template: `${message}. Would you like to update now?`,
    })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: this._reload,
        error: () => {
          this._pendingUpdate = false;
        },
      });
  }

  private _reload(): void {
    window.location.replace(window.location.href);
  }

}
