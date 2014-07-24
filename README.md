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

Note: each scrollable panel requires its own `scroll` instance. Hence, do not

``` javascript
var scroll = uiScrollPanels();

scroll.select( '.container-1' )
	.init();

scroll.select( '.container-2' )
	.init();
```

This will lead to `container-1` controls to affect `container-2' panels.

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




### Browserify

To recompile a client-side library, use [browserify](https://github.com/substack/node-browserify). The following command will compile (from the top-level project directory) a standalone client-side script and place in the `dist` directory.

``` bash
browserify './lib/index.js' -s uiScrollPanels -o './dist/ui-scroll-panels.js'
```

If no module systems are found, `uiScrollPanels` will be bound to the `window` global.


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