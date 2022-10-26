import type { Emission } from './Emission';

export interface EmissionInterface<T extends string | symbol = string | symbol> extends Emission<T> {
	readonly type: T;
	readonly timestamp: number;
}
