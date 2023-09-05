import { BuildData } from './../../src/app/interfaces/build-data';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { UpdateAction, FsBuildModule, FsBuildService, CompareMethod, BuildConfig, FS_BUILD_CONFIG } from '@firestitch/package';
import { FsLabelModule } from '@firestitch/label';
import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  KitchenSinkComponent,
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'navigate', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsBuildModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  entryComponents: [
    KitchenSinkConfigureComponent
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    KitchenSinkConfigureComponent
  ],
  providers: [
    {
      provide: FS_BUILD_CONFIG,
      useFactory: (): BuildConfig => {
        return {
          origin: 'http://firestitch-dev.s3.us-west-2.amazonaws.com',
          path: 'pub/build.json',
          interval: 5,
          updateAction: UpdateAction.ManualUpdate,
          compareMethod: CompareMethod.Version,
          updateClick: (build: BuildData) => {
            console.log('updateClick', build);
          },
        }
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (
        buildService: FsBuildService,
      ) => () => {
        return of(null)
          .pipe(
            tap(() => {
              buildService.build = {

              };
            }),
            tap(() => buildService.listen({
              delay: 5
            })),
          )
          .toPromise();
      },
      multi: true,
      deps: [FsBuildService],
    },
  ]
})
export class PlaygroundModule {
}
