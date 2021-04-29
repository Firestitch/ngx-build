import { Component } from '@angular/core';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsBuildService } from '@firestitch/package';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  public config = {};

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
    private _buildService: FsBuildService,
  ) {
  }

  public update(): void {
    this._buildService.update({
      date: new Date(),
      name: 'Development Instance',
      version: '1.1.0',
    });
  }
}
