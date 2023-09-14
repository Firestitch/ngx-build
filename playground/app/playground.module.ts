import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { BuildData } from './../../src/app/interfaces/build-data';

import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { BuildConfig, CompareMethod, FS_BUILD_CONFIG, FsBuildModule, FsBuildService } from '@firestitch/package';
import { ToastrModule } from 'ngx-toastr';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppComponent } from './app.component';
import {
  ExamplesComponent,
  KitchenSinkComponent
} from './components';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'navigate', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
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
          //updateAction: UpdateAction.ManualUpdate,
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
            tap(() => buildService.listen({ delay: 5, interval: 10 })),
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
