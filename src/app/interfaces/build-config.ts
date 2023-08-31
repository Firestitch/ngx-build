import { Observable } from 'rxjs';
import { CompareMethod, UpdateAction } from '../enums';
import { BuildData } from './build-data';


export interface BuildConfig {
  interval?: number,
  path?: string,
  origin?: string,
  updateAction?: UpdateAction,
  compareMethod?: CompareMethod,
  updateClick?: (build: BuildData) => void,
}
