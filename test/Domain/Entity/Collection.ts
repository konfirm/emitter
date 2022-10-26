import test from 'tape';
import { Collection } from '../../../source/Domain/Entity/Collection';

test('Domain/Entity/Collection - push', (t) => {
	const item = { foo: 'bar' };
	const collection = new Collection();

	t.notOk(collection.find(item), 'does not contain {foo:"bar"}');
	collection.push(item);
	t.ok(collection.find(item), 'contains {foo:"bar"}');

	t.end();
});

test('Domain/Entity/Collection - pull', (t) => {
	const item = { foo: 'bar' };
	const collection = new Collection(item);

	t.ok(collection.find(item), 'contains {foo:"bar"}');
	collection.pull(item);
	t.notOk(collection.find(item), 'does not contain {foo:"bar"}');

	t.end();
});

test('Domain/Entity/Collection - find', (t) => {
	const item = { foo: 'bar' };
	const collection = new Collection(item);

	t.ok(collection.find(item), 'contains {foo:"bar"}');
	t.ok(collection.find({ foo: 'bar' }) === item, 'found item is exactly the injected value');

	t.end();
});

test('Domain/Entity/Collection - findAll', (t) => {
	const items = [
		{ foo: 'bar', count: 1 },
		{ foo: 'bar', count: 2 },
		{ foo: 'not', count: 3 },
	];
	const collection = new Collection(...items);

	const found = collection.findAll({ foo: 'bar' });

	t.equal(found.length, 2, 'found two items');

	found.forEach((found, index) => {
		t.ok(found === items[index], `found exact match ${JSON.stringify(items[index])} at ${index}`);
	});

	t.end();
});

test('Domain/Entity/Collection - for (singleton)', (t) => {
	const refA = { name: 'A' };
	const refB = { name: 'B' };

	t.ok(Collection.for(refA) instanceof Collection, 'creates a Collection for refA object');
	t.ok(Collection.for(refB) instanceof Collection, 'creates a Collection for refB object');
	t.ok(Collection.for(refA) === Collection.for(refA), 'Returns the same instance for the same reference');
	t.notOk(Collection.for(refA) === Collection.for(refB), 'Returns a different instance for a different reference');

	t.end();
});
