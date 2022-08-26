import { EmissionConfig } from "../Contract/EmissionConfig";
import { EmissionInterface } from "../Contract/EmissionInterface";
import { EmitterListenerInterface } from "../Contract/EmitterListenerInterface";
import { Collection } from "./Collection";

type ListenerRecord<T, K extends keyof T> = {
	type: K;
	listener: (emission: T[K]) => void;
	limit: number;
}

const trap = ['set', 'defineProperty', 'deleteProperty', 'setPrototypeOf'].reduce((carry, key) => ({ ...carry, [key]: () => true }), {});

export class Emitter<EC extends EmissionConfig<string>> {
	private stash: Array<{ type: keyof EC, handler: (...args: Array<any>) => void, limit: number }> = [];

	on<T extends keyof EC>(type: T, listener: (emission: EC[T]) => void): void {
		Collection.for<ListenerRecord<EC, T>>(this).push({ type, listener, limit: Infinity });
	}

	once<T extends keyof EC>(type: T, listener: (emission: EC[T]) => void): void {
		Collection.for<ListenerRecord<EC, T>>(this).push({ type, listener, limit: 1 });
	}

	off<T extends keyof EC>(type: T, listener: (emission: EC[T]) => void): void {
		const collection = Collection.for<ListenerRecord<EC, T>>(this);

		collection.pull(...collection.findAll({ type, listener }));
	}

	emit<T extends keyof EC>(emission: Partial<EC[T]>): void {
		const collection = Collection.for<ListenerRecord<EC, T>>(this);
		const candidates = collection.findAll({ type: emission.type as T })

		const projection = {
			...emission,
			type: emission.type as T,
			timestamp: Date.now(),
		};
		const proxy = new Proxy(projection, {
			...trap,
			get(_, key: string | symbol): unknown {
				return projection[key];
			},
			has(_, key: string | symbol): boolean {
				return key in projection;
			},
			ownKeys(): Array<string | symbol> {
				return Object.keys(projection);
			},
		});

		candidates.forEach((record) => {
			record.listener(proxy as unknown as EC[T]);

			if (--record.limit <= 0) {
				collection.pull(record);
			}
		});
	}
}
