import { BuildData } from './../../src/app/interfaces/build-data';
import { environment } from './../environments/environment';
import { FS_BUILD_DATA } from './../../src/app/injectors/build-data.injector';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { BuildReloadMethod, FsBuildModule } from '@firestitch/package';
import { FsLabelModule } from '@firestitch/label';
import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  KitchenSinkComponent,
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
  { path: 'navigate', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsBuildModule.forRoot({
      origin: 'http://firestitch-dev.s3.us-west-2.amazonaws.com',
      path: 'pub/build.json',
      interval: 5,
      reloadMethod: BuildReloadMethod.Navigation,
    }),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
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
      provide: FS_BUILD_DATA,
      useFactory: (): BuildData => {
        const env: any = environment;
        env.build = env.build || {};
        return {
          name: env.build.name || 'Test Name',
          date: env.build.date || new Date(),
          version: env.build.version || 'Test Version'
        }
      }
    }
  ]
})
export class PlaygroundModule {
}
