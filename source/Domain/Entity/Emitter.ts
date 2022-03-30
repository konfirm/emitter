import { EmissionInterface } from "../Contract/EmissionInterface";
import { EmitterListenerInterface } from "../Contract/EmitterListenerInterface";
import { Collection } from "./Collection";

type ListenerRecord<T, K extends keyof T> = {
	type: K;
	listener: (emission: T[K]) => void;
	limit: number;
}

const trap = ['set', 'defineProperty', 'deleteProperty', 'setPrototypeOf'].reduce((carry, key) => ({ ...carry, [key]: () => true }), {});

export class Emitter<T extends { [K in EmissionInterface['type']]: EmissionInterface }> implements EmitterListenerInterface<T> {
	on<K extends keyof T = keyof T>(type: K, listener: (emission: T[K]) => void): void {
		Collection.for<ListenerRecord<T, K>>(this).push({ type, listener, limit: Infinity });
	}

	once<K extends keyof T = keyof T>(type: K, listener: (emission: T[K]) => void): void {
		Collection.for<ListenerRecord<T, K>>(this).push({ type, listener, limit: 1 });
	}

	off<K extends keyof T = keyof T>(type: K, listener: (emission: T[K]) => void): void {
		const collection = Collection.for<ListenerRecord<T, K>>(this);

		collection.pull(...collection.findAll({ type, listener }));
	}

	emit<K extends keyof T = keyof T>(emission: Omit<T[K], 'timestamp'>): void {
		const collection = Collection.for<ListenerRecord<T, K>>(this);
		const candidates = collection.findAll({ type: emission.type as K })

		if (candidates.length) {
			const timestamp = Date.now();
			const proxy = new Proxy({ ...emission, timestamp } as T[K], trap);

			candidates.forEach((record) => {
				record.listener(proxy);

				if (--record.limit <= 0) {
					collection.pull(record);
				}
			});
		}
	}
}
