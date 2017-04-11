# timeline-viewer

> Interactive GSAP timeline viewer

[![Travis](https://img.shields.io/travis/ueno-llc/timeline-viewer.svg?maxAge=2592000)](https://travis-ci.org/ueno-llc/timeline-viewer) [![npm](https://img.shields.io/npm/v/timeline-viewer.svg?maxAge=2592000)](https://www.npmjs.com/package/timeline-viewer)

## Installation

Includes these peer dependencies:

```json
{
  "gsap": "^1.19.1",
  "react": "^15.4.2"
}
```

```bash
npm install timeline-viewer
```

## Usage

```jsx
import React from 'react';
import {render} from 'react-dom';
import TimelineViewer from 'timeline-viewer';
import {TimelineLite} from 'gsap';

const timeline = new TimelineLite()
  .fromTo('#human', 1, {x: -100}, {x: 0})
  .fromTo('#cat', 1, {x: 100, {x: 0}});

const App = () => <TimelineViewer timeline={timeline} />;

render(<App />, document.getElementById('#app'));
```

## API

### `<Timeline />`

Renders an interactive timeline browser. Supports these props:

- **timeline**: instance of TimelineLite or TimelineMax to inspect.

## Local Development

```bash
git clone https://github.com/ueno-llc/timeline-viewer
cd timeline-viewer
npm install
```

To run the demo:

```bash
npm run dev
```

To run unit tests:

```bash
npm test
```

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
