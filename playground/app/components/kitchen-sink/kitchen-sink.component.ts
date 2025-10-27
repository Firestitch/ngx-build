import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsBuildService } from '@firestitch/package';
import { FsBuildComponent } from '../../../../src/app/components/build/build.component';
import { MatButton, MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'kitchen-sink',
    templateUrl: './kitchen-sink.component.html',
    styleUrls: ['./kitchen-sink.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsBuildComponent,
        MatButton,
        MatAnchor,
        RouterLink,
        JsonPipe,
    ],
})
export class KitchenSinkComponent {
  private exampleComponent = inject(FsExampleComponent);
  private message = inject(FsMessage);
  private _buildService = inject(FsBuildService);
  private _cdRef = inject(ChangeDetectorRef);


  public config = {};
  public build;
  public version = 1;

  constructor() {
    this.buildChagnes();
  }

  public dateUpdate(): void {
    this._buildService.build = {
      date: new Date(),
      name: 'Development Instance',
      version: '',
    };
  }

  public versionUpdate(): void {
    this.version++;
    this._buildService.build = {
      date: null,
      name: 'Development Instance',
      version: `${this.version}.0.0`,
    };
  }

  public buildChagnes(): void {
    this._buildService.build$
      .subscribe((build) => {
        this.build = build;
        debugger;
        this._cdRef.markForCheck();
      });
  }
}
