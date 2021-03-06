ui-scroll-panels
================

Library to enable scrolling between panels, similar to sliders, carousels, and some HTML presentation frameworks.

Here, the goal is a simple API which works for one or many panels.


### Example

``` javascript
var scroll = uiScrollPanels()
	.select( '.main' )
	.init();
```

Note: each scrollable panel requires its own `scroll` instance. Hence, do __not__

``` javascript
var scroll = uiScrollPanels();

scroll.select( '.container-1' )
	.init();

scroll.select( '.container-2' )
	.init();
```

This will lead to `container-1` controls to affect `container-2` panels. Switching the context is possible using the `select` method, but this is only advised when programmatically scrolling between panels. 

Instead,

``` javascript
var scroll1 = uiScrollPanels()
	.select( 'container-1' )
	.init();

var scroll2 = uiScrollPanels()
	.select( 'container-2' )
	.init();
```




### API

To enable scrolling between panels, one must first create a scroll panel instance. To do so,

``` javascript
var scroll = uiScrollPanels();
```

Scroll panels are configurable and have the following methods...


#### scroll.select( selector )

This method selects and initializes a panel container. If scroll controls do not already exist in the container, they are inserted. By using `select`, one is able to determine the panel context for scrolling.

``` javascript
scroll.select( '.container-1' );
// Any UI interaction affects panels in container `.container-1`

scroll.select( '.container-2' );
// Any UI interaction now affects panels in container `.container-2`
```

#### scroll.current( [idx] )

This method is a setter/getter. If no index is provided, returns the current panel index. To set the current panel index,

``` javascript
scroll.current( 2 );
```

Note: for the moment, this only affects future scrolls. Jumping to the desired panel is on the project roadmap.


#### scroll.init()

This method initializes a scroll layout by adding event listeners and hiding all panels beside the current panel (default: 0).

``` javascript
scroll.init();
```


#### scroll.scroll( direction[, clbk] )

This method provides a programmatic means to scroll between panels. A callback may be provided which is invoked after scroll `end`.

Currently, only `left` and `right` directions are supported.

``` javascript
scroll.scroll( 'left', function onEnd() {
	console.log( 'beep!' );	
});
```


### Shortcuts

* 	__h__, __left__: scroll left
*	__l__, __right__: scroll right
*	__k__, __up__: scroll up (_not yet supported_)
*	__j__, __down__: scroll down (_not yet supported_)


### Notes

If multiple scroll containers are present, shortcuts currently affect all scroll containers; e.g., a __left__ keypress will cause all scroll containers to scroll left.


===
### Browserify

To recompile a client-side library, use [browserify](https://github.com/substack/node-browserify). The following command will compile (from the top-level project directory) a standalone client-side script and place in the `dist` directory.

``` bash
browserify './lib/index.js' -s uiScrollPanels -o './dist/ui-scroll-panels.js'
```

If no module systems are found, `uiScrollPanels` will be bound to the `window` global.


---
## Tests

WARNING: unit and functional tests are fairly non-existent at the moment. 

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions.

Assuming you have installed Mocha,

``` bash
$ npm install -g mocha
```

execute the following command in the top-level application directory to run the tests:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

Assuming you have installed [Istanbul](https://github.com/gotwarlost/istanbul),

``` bash
$ npm install -g istanbul
```

execute the following command to generate a test coverage report:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


---
## Credits

Two works provided inspiration for this implementation:

*	[Reveal.js](https://github.com/hakimel/reveal.js/)
* 	[TripleViewLayout](http://tympanus.net/Development/TripleViewLayout/)


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.
