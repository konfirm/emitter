export type Emission<T extends string | symbol, O extends { [key: string]: unknown } = {}>
    = O
    & {
        type: T;
        timestamp: number;
    };
