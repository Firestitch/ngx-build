import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsBuildService } from '@firestitch/package';

@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenSinkComponent {

  public config = {};
  public build;
  public version = 1;

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
    private _buildService: FsBuildService,
    private _cdRef: ChangeDetectorRef,
  ) {
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
