import { delegate } from "../Contract/Emission";
import { EmissionConfig } from "../Contract/EmissionConfig";
import { EmitterListenerInterface } from "../Contract/EmitterListenerInterface";
import { Collection } from "./Collection";

type ListenerRecord<T, K extends keyof T> = {
	type: K;
	listener: (emission: T[K]) => void;
	limit: number;
}

const trap = ['set', 'defineProperty', 'deleteProperty', 'setPrototypeOf'].reduce((carry, key) => ({ ...carry, [key]: () => true }), {});

export class Emitter<EC extends EmissionConfig<string>> implements EmitterListenerInterface<EC>{
	on<T extends keyof EC>(type: T, listener: (emission: EC[T]) => void): void {
		Collection.for<ListenerRecord<EC, T>>(this)
			.push({ type, listener, limit: Infinity });
	}

	once<T extends keyof EC>(type: T, listener: (emission: EC[T]) => void): void {
		Collection.for<ListenerRecord<EC, T>>(this)
			.push({ type, listener, limit: 1 });
	}

	off<T extends keyof EC>(type: T, listener: (emission: EC[T]) => void): void {
		const collection = Collection.for<ListenerRecord<EC, T>>(this);

		collection.pull(...collection.findAll({ type, listener }));
	}

	emit<T extends keyof EC>(emission: Omit<EC[T], 'timestamp'>): void {
		const collection = Collection.for<ListenerRecord<EC, T>>(this);
		const projection = delegate<EC[T]>(emission);

		collection
			.findAll({ type: <T>emission.type })
			.forEach((record) => {
				record.listener(projection);

				if (--record.limit <= 0) {
					collection.pull(record);
				}
			});
	}
}
