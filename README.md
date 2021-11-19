![tests](https://github.com/konfirm/guards/emitter/workflows/tests.yml/badge.svg)
![release](https://github.com/konfirm/guards/emitter/workflows/release.yml/badge.svg)

# Emitter

A simple and easy to use Emitter library.

## Installation

```
npm install --save @konfirm/emitter
```

## Usage

The main exported member of the @konfirm/emitter package is `Emitter`. For Typescript users, the contracts `EmitterListenerInterface`, `EmissionMapper` and `EmissionInterface` are also exported.

| export                     | description                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Emitter`                  | The Emitter class, containing al logic to handle (un)registration and emissions                                                 |
| `EmitterListenerInterface` | _TS only_ interface describing everything but the `emit` method (as that one probably shouldn't be available outside your code) |
| `EmissionInterface`        | _TS only_ interface describing the "Emissions" received by the registered handlers                                              |
| `EmissionMapper`           | _TS only_ type to conveniently create the mapping from an `EmissionInterface` implementation class                              |

The Emitter class provides the following methods

| method | argument(s)                       | description                                                       |
| ------ | --------------------------------- | ----------------------------------------------------------------- |
| `on`   | `type: string, handler: Function` | register a handler to receive emissions of `type`                 |
| `once` | `type: string, handler: Function` | like `on`, will unregister itself after receiving once            |
| `off`  | `type: string, handler: Function` | unregister the handler from receiving emissions of `type`         |
| `emit` | `emission: EmissionInterface`     | emit the emission to the handlers listening for the emission type |

### Javascript example

```js
// const { Emitter } = require('@konfirm/emitter'); // CommonJS
import { Emitter } from '@konfirm/emitter'; // ES Module

const emitter = new Emitter();

emitter.on('my-first-emission', (emission: MyFirstEmission) => {
	console.log(emission);
});

emitter.emit('my-first-emission', { type: 'my-first-emission' });
```

### Typescript example
```ts
import { Emitter, Emission } from '@konfirm/emitter';

interface MyFirstEmission extends Emission {
	type: 'my-first-emission' | 'first-emission';
}

interface MySecondEmission extends Emission {
	type: 'my-second-emission' | 'second-emission';
}

type EmissionMap = {
	'my-first-emission': MyFirstEmission;
	'first-emission': MyFirstEmission;
	'my-second-emission': MySecondEmission;
	'second-emission': MySecondEmission;
}

const emitter = new Emitter<EmissionMap>();

emitter.on('my-first-emission', (emission: MyFirstEmission) => {
	console.log(emission);
});

emitter.emit('my-first-emission', { type: 'my-first-emission' });
```

## License
MIT License Copyright (c) 2021 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

