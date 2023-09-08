import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsPromptModule } from '@firestitch/prompt';

import { FsBuildComponent } from './components/build/build.component';



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
}
