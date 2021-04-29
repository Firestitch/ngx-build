import { BuildReloadMethod } from '../enums/build-reload-method.enum';

export interface BuildConfig {
  interval?: number,
  enabled?: boolean,
  path?: string,
  origin?: string,
  reloadMethod?: BuildReloadMethod,
}
