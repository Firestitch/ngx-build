import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsPromptModule } from '@firestitch/prompt';

import { FsBuildComponent } from './components/build/build.component';
import { FsBuildService } from './services/build.service';
import { BuildConfig } from './interfaces/build-config';
import { FS_BUILD_CONFIG } from './injectors';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  static forRoot(config: BuildConfig = {}): ModuleWithProviders<FsBuildModule> {
    return {
      ngModule: FsBuildModule,
      providers: [
        { provide: FS_BUILD_CONFIG, useValue: config },
        FsBuildService
      ]
    };
  }
}
