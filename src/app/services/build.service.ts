import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { parse } from '@firestitch/date';
import { FsPrompt } from '@firestitch/prompt';

import { BehaviorSubject, Observable, Subject, of, timer } from 'rxjs';
import { catchError, filter, finalize, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { isAfter } from 'date-fns';

import { CompareMethod, UpdateAction } from '../enums';
import { FS_BUILD_CONFIG } from '../injectors';
import { BuildData } from '../interfaces';
import { BuildConfig } from '../interfaces/build-config';


@Injectable({
  providedIn: 'root',
})
export class FsBuildService implements OnDestroy {

  private _build$ = new BehaviorSubject<BuildData>(null);
  private _destroy$ = new Subject();
  private _pendingUpdate = false;
  private _ran = new Date;

  constructor(
    @Inject(FS_BUILD_CONFIG) private _config: BuildConfig,
    private _http: HttpClient,
    private _prompt: FsPrompt,
    private _router: Router,
  ) {
    this._config = {
      interval: 60,
      path: 'assets/build.json',
      origin: window.location.origin,
      updateAction: UpdateAction.PromptUpdate,
      compareMethod: CompareMethod.Date,
      ...this._config,
    };
  }

  public get build(): BuildData {
    return {
      ...this._build$.getValue(),
      ran: this._ran,
    };
  }

  public set build(build: BuildData) {
    build = {
      ...build,
      version: build.version ? String(build.version) : null,
      date: parse(build.date),
    };

    if (this.hasUpdate(build)) {
      this._pendingUpdate = true;
      switch (this._config.updateAction) {
        case UpdateAction.PromptUpdate:
          this._processPromptUpdate(build);
          break;
        case UpdateAction.NavigationUpdate:
          this._processNavigationUpdate();
          break;
        case UpdateAction.ManualUpdate:
          this._processManualUpdate();
          break;
      }
    }

    this._build$.next(build);
  }

  public get build$(): Observable<BuildData> {
    return this._build$
      .asObservable()
      .pipe(
        map(() => {
          return this.build;
        }),
        takeUntil(this._destroy$),
      );
  }

  public listen(config?: { delay?: number, interval?: number }) {
    const interval = (config?.interval || this._config.interval) * 1000;
    const delay = (config?.delay || 0) * 1000;

    timer(delay, interval)
      .pipe(
        filter(() => !this._pendingUpdate),
        switchMap(() =>
          this.get()
            .pipe(
              catchError(() => of(null)),
            )
        ),
        filter((data) => !!data),
        takeUntil(this._destroy$),
      )
      .subscribe((data: BuildData) => {
        this.build = data;
      });
  }

  public hasUpdate(build: BuildData): boolean {
    if (this._config.compareMethod === CompareMethod.Date) {
      return this.build?.date && isAfter(build.date, this.build.date);
    }

    if (this._config.compareMethod === CompareMethod.Version) {
      return this.build?.version && build.version !== this.build.version;
    }

    return false;
  }

  public get(): Observable<any> {
    const url = new URL(this._config.origin);
    url.pathname = this._config.path;

    const config = {
      headers: null,
    };

    return this._http.get(url.toString(), config);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _processManualUpdate(): void {
    this._prompt.confirm({
      title: 'New App Version Available',
      template: `The app requires an update`,
      escape: false,
      buttons: [
        {
          label: 'Update Now',
        },
      ]
    })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        if (this._config.updateClick) {
          this._config.updateClick(this.build);
        }
      });
  }

  private _processNavigationUpdate(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(this._reload);
  }

  private _processPromptUpdate(data: BuildData): void {
    const message = data.version ? `Newer version ${data.version} of this app is available` : 'There is a newer version of this app available';

    this._prompt
      .confirm({
        title: 'New App Version Available',
        template: `${message}. Would you like to update now?`,
      })
      .pipe(
        finalize(() => {
          this._pendingUpdate = false;
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._reload();
      });
  }

  private _reload(): void {
    window.location.replace(window.location.href);
  }

}
