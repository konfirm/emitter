![tests](https://github.com/konfirm/emitter/actions/workflows/tests.yml/badge.svg)
![release](https://github.com/konfirm/emitter/actions/workflows/release.yml/badge.svg)

# Emitter

A simple and easy to use Emitter library. Focussing on ease of use for TypeScript it supports full autocompletion and type hints for every emission you've configured;

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
| `EmissionConfig`           | _TS only_ type to declare types and their emission structure                                                                    |
| `EmissionMapper`           | _TS only_ type to create an EventConfig type from an `EmissionInterface` implementation class                                   |

The Emitter class provides the following methods

| method | argument(s)                         | description                                                       |
| ------ | ----------------------------------- | ----------------------------------------------------------------- |
| `on`   | `type: string`, `handler: Function` | register a handler to receive emissions of `type`                 |
| `once` | `type: string`, `handler: Function` | like `on`, will unregister itself after receiving once            |
| `off`  | `type: string`, `handler: Function` | unregister the handler from receiving emissions of `type`         |
| `emit` | `emission: EmissionInterface`       | emit the emission to the handlers listening for the emission type |

### Javascript

```js
// const { Emitter } = require('@konfirm/emitter'); // CommonJS
import { Emitter } from '@konfirm/emitter'; // ES Module

const emitter = new Emitter();

emitter.on('my-first-emission', (emission: MyFirstEmission) => {
	console.log(emission);
});

emitter.emit({ type: 'my-first-emission' });
```

### Typescript
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

emitter.emit({ type: 'my-first-emission' });
```

#### EmissionMapper
The `EmissionMapper` type can be used to reduce the manual declaration of the EmissionMap provided as type to `Emitter`. With it the `EmissionMap` in the example above can be defined using:

```ts
import { Emitter, Emission, EmissionMapper } from '@konfirm/emitter';

//...

type EmissionMap = EmissionMapper<'my-first-emission' | 'first-emission', MyFirstEmission> & EmissionMapper<'my-second-emission' | 'second-emission', MySecondEmission>;

const emitter = new Emitter<EmissionMap>();
```

Or use the template literal types TypeScript introduced with version 4.1.

```ts
type EmissionMap = EmissionMapper<`${'my-'|''}first-emission`, MyFirstEmission> & EmissionMapper<`${'my-'|''}second-emission`, MySecondEmission>;
```

#### EmissionConfig
While `EmissionMapper` is 

## License
MIT License Copyright (c) 2021-2022 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

