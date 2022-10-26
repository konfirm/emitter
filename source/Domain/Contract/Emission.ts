export type Emission<T extends string | symbol, O extends { [key: string]: unknown } = {}>
    = O
    & {
        type: T;
        timestamp: number;
    };

const trap = ['set', 'defineProperty', 'deleteProperty', 'setPrototypeOf'].reduce((carry, key) => ({ ...carry, [key]: () => true }), {});

export function delegate<E extends Emission<string, {}>>(emission: Omit<E, 'timestamp'> & Partial<Pick<E, 'timestamp'>>): E {
    const delegated = <E>{ ...emission, timestamp: Date.now() };

    return new Proxy(delegated, {
        ...trap,
        get(_, key: string | symbol): unknown {
            return delegated[key];
        },
        has(_, key: string | symbol): boolean {
            return key in delegated;
        },
        ownKeys(): Array<string | symbol> {
            return Object.keys(delegated);
        },
    });
}