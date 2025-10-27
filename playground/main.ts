import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_BUILD_CONFIG, BuildConfig, CompareMethod, FsBuildService } from '@firestitch/package';
import { BuildData } from '../src/app/interfaces/build-data';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsLabelModule } from '@firestitch/label';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'navigate', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsLabelModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), ToastrModule.forRoot({ preventDuplicates: true })),
        {
            provide: FS_BUILD_CONFIG,
            useFactory: (): BuildConfig => {
                return {
                    origin: 'http://firestitch-dev.s3.us-west-2.amazonaws.com',
                    path: 'pub/build.json',
                    //updateAction: UpdateAction.ManualUpdate,
                    compareMethod: CompareMethod.Version,
                    updateClick: (build: BuildData) => {
                        console.log('updateClick', build);
                    },
                };
            }
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (buildService: FsBuildService) => () => {
                return of(null)
                    .pipe(tap(() => {
                    buildService.build = {};
                }), tap(() => buildService.listen({ delay: 5, interval: 10 })))
                    .toPromise();
            },
            multi: true,
            deps: [FsBuildService],
        },
        provideAnimations(),
        provideRouter(routes)
    ]
})
  .catch(err => console.error(err));

