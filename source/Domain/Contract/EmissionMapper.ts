import type { Emission } from './Emission';
import type { EmissionConfig } from './EmissionConfig';

export type EmissionMapper<T extends Emission<string>> = EmissionConfig<T['type'], T>;
