import type { Emission } from './Emission';

export type EmissionConfig<T extends string | symbol, O extends { [key: string]: unknown } = {}> = {
    [P in T]: Emission<P, O>;
};
