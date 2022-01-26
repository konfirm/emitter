import { EmissionInterface } from "../Contract/EmissionInterface";
import { EmitterListenerInterface } from "../Contract/EmitterListenerInterface";
import { Collection } from "./Collection";

type ListenerRecord<T> = {
	type: keyof T;
	listener: <K extends keyof T>(emission: T[K]) => void;
	limit: number;
}

export class Emitter<T extends { [K in EmissionInterface['type']]: EmissionInterface }> implements EmitterListenerInterface<T> {
	on(type: keyof T, listener: (emission: T[keyof T]) => void): void {
		Collection.for<ListenerRecord<T>>(this).push({ type, listener, limit: Infinity });
	}

	once(type: keyof T, listener: (emission: T[keyof T]) => void): void {
		Collection.for<ListenerRecord<T>>(this).push({ type, listener, limit: 1 });
	}

	off(type: keyof T, listener: (emission: T[keyof T]) => void): void {
		const collection = Collection.for<ListenerRecord<T>>(this);

		collection.pull(...collection.findAll({ type, listener }));
	}

	emit(emission: T[keyof T] | Omit<T[keyof T], 'timestamp'>): void {
		const collection = Collection.for<ListenerRecord<T>>(this);
		const candidates = collection.findAll({ type: emission.type })

		if (candidates.length) {
			const trap = () => true;
			const timestamp = Date.now();
			const proxy = new Proxy({ ...emission, timestamp } as T[keyof T], {
				set: trap,
				defineProperty: trap,
				deleteProperty: trap,
				setPrototypeOf: trap,
			});

			candidates.forEach((record) => {
				record.listener(proxy);

				if (--record.limit <= 0) {
					collection.pull(record);
				}
			});
		}
	}
}
