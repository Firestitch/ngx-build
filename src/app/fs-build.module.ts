import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsPromptModule } from '@firestitch/prompt';

import { FsBuildComponent } from './components/build/build.component';
import { FsBuildService } from './services/build.service';
import { BuildConfig } from './interfaces/build-config';
import { FS_BUILD_CONFIG } from './injectors';
import { CompareMethod, UpdateAction } from './enums';


@NgModule({
  imports: [
    CommonModule,
    FsPromptModule,
    MatTooltipModule,
    MatIconModule
  ],
  exports: [
    FsBuildComponent,
  ],
  declarations: [
    FsBuildComponent,
  ]
})
export class FsBuildModule {
  // static forRoot(config: BuildConfig = {}): ModuleWithProviders<FsBuildModule> {
  //   const defaultConfig: BuildConfig = {
  //     interval: 30,
  //     path: 'assets/build.json',
  //     origin: window.location.origin,
  //     updateAction: UpdateAction.PromptUpdate,
  //     compareMethod: CompareMethod.Date,
  //   };

  //   return {
  //     ngModule: FsBuildModule,
  //     providers: [
  //       {
  //         provide: FS_BUILD_CONFIG,
  //         useValue: {
  //           ...defaultConfig,
  //           ...config,
  //         },
  //       },
  //       FsBuildService,
  //     ],
  //   };
  // }
}
