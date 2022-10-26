const linked: WeakMap<object, Collection<any>> = new WeakMap();

export class Collection<T extends object> {
	private readonly collection: Array<T> = [];

	constructor(...items: Array<T>) {
		this.push(...items);
	}

	push(...items: Array<T>): boolean {
		return Boolean(this.collection.push(...items));
	}

	pull(...items: Array<T>): Array<T> {
		return items.reduce((carry, item) => carry.concat(this.collection.splice(this.collection.indexOf(item), 1)), [] as Array<T>);
	}

	find(seek: Partial<T>): T | undefined {
		return this.collection.find(this.search(seek));
	}

	findAll(seek: Partial<T>): Array<T> {
		return this.collection.filter(this.search(seek));
	}

	private search(seek: Partial<T>): (item: T) => boolean {
		const keys = Object.keys(seek);

		return (item: T) => keys.every((key) => item[key as keyof T] === seek[key as keyof T]);
	}

	static for<T extends object>(ref: object): Collection<T> {
		if (!linked.has(ref)) {
			linked.set(ref, new Collection<T>());
		}

		return linked.get(ref) as Collection<T>;
	}
}
