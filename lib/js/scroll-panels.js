

(function() {
	'use strict';

	// MODULES //

	var Modernizr = require( './../lib/modernizr.js' );


	// VARIABLES //

	var EVENTNAMES = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		EVENT = EVENTNAMES[ Modernizr.prefixed( 'transition' ) ],
		TRANSFORM = Modernizr.prefixed( 'transform' ),
		NAV = {
			'right': '.nav-right',
			'left': '.nav-left',
			'up': '.nav-up',
			'down': '.nav-down'
		},
		KEYS = Object.keys( NAV ),
		DIRECTIONS = [ 'left', 'right', 'up', 'down' ];


	// PARTIAL //

	var PARTIAL = '<div class="ui-scroll-controls"><nav class="ui-scroll-control-nav"><ul class="ui-scroll-control-list"><li class="ui-scroll-control nav-left" aria-disabled="true"></li><li class="ui-scroll-control nav-up" aria-disabled="true"></li><li class="ui-scroll-control nav-down" aria-disabled="true"></li><li class="ui-scroll-control nav-right" aria-disabled="true"></li></ul></nav></div>';


	// FUNCTIONS //

	/**
	* FUNCTION: keydown( listeners )
	*	Returns an event listener for keydown events.
	*
	* @private
	* @param {Object} listeners - object containing listeners
	* @returns {Function} event listener
	*/
	function keydown( listeners ) {
		/**
		* FUNCTION: onKeydown( event )
		*	Event listener for keydown events.
		*
		* @private
		* @param {Object} event - event object
		*/
		return function onKeydown( event ) {
			var activeElement, hasFocus;

			// Check if a focused element is using the keyboard:
			hasFocus = !!( document.activeElement && ( document.activeElement.type || document.activeElement.href || document.activeElement.contentEditable !== 'inherit' ) );

			// Disregard the event if a focused element or a keyboard modifier key is present:
			if ( hasFocus || ( event.shiftKey && event.keyCode !== 32 ) || event.altKey || event.ctrlKey || event.metaKey ) {
				return;
			}

			switch ( event.keyCode ) {
				// h, left
				case 72: case 37:
					listerns.left( event );
					break;
				// l, right
				case 76: case 39:
					listeners.right( event );
					break;
				// k, up
				case 75: case 38:
					listeners.up( event );
					break;
				// j, down
				case 74: case 40:
					listeners.down( event );
					break;
				//
				default:
					break;
			} // end SWITCH (keyCode)
		}; // end FUNCTION onKeydown()
	} // end FUNCTION keydown()

	// PANELS //

	/**
	* FUNCTION: Panels()
	*	Panels constructor.
	*
	* @constructor
	* @returns {Panels} Panels instance
	*/
	function Panels() {
		// Panel elements:
		this._selection = null;
		this._controls = null;
		this._nav = {
			'right': null,
			'left': null,
			'up': null,
			'down': null
		};
		this._panels = [];

		this._numPanels = null;

		// Panel staging:
		this._current = 0;

		// Event listeners:
		this._listeners = {
			'right': null,
			'left': null,
			'up': null,
			'down': null
		};

		// Animation status:
		this._animating = false;

		// Initialization status:
		this._init = false;

		return this;
	} // end FUNCTION Panels()

	/**
	* METHOD: select( selector )
	*	DOMElement selector.
	*
	* @param {String} selector - parent element selector
	* @returns {Panels} Panels instance
	*/
	Panels.prototype.select = function( selector ) {
		if ( typeof selector !== 'string' ) {
			throw new Error( 'select()::invalid input argument. Selector must be a string.' );
		}

		// Get the selection:
		this._selection = document.querySelector( selector );

		if ( !this._selection ) {
			throw new Error( 'select()::unable to select requested element: ' + selector + '.' );
		}

		this._selection.classList.add( 'ui-scroll-panels' );

		this._getControls()
			._getNavigation()
			._getPanels();

		return this;
	}; // end METHOD select()

	/**
	* METHOD: current( idx )
	*	Current panel index setter and getter. If no index is provided, returns the current panel index. If an index is provided, sets the current panel index.
	*
	* @param {Number} [idx] - current panel index; default is 0
	* @returns {Panels|Number} Panels instance or current panel index
	*/
	Panels.prototype.current = function( idx ) {
		if ( !arguments.length ) {
			return this._current;
		}
		if ( typeof idx !== 'number' || idx !== idx ) {
			throw new Error( 'current()::invalid input argument. Current index must be numeric.' );
		}
		this._current = idx;

		if ( this._init ) {
			// TODO: make setting the current index jumpto that panel.
		}

		return this;
	}; // end METHOD current()

	/**
	* METHOD: init()
	*	Initializes the scroll layout.
	*
	* @returns {Panels} Panels instance
	*/
	Panels.prototype.init = function() {
		var nav = this._nav,
			panels = this._panels,
			current = this._current,
			key, listener, el;

		// Add touch and click event listeners to all navigation elements...
		for ( var i = 0; i < KEYS.length; i++ ) {

			key = KEYS[ i ];
			el = nav[ key ];
			listener = this[ '_scroll' + key ]();

			el.addEventListener(
				'touchstart',
				listener,
				false
			);

			el.addEventListener(
				'click',
				listener,
				false
			);

			this._listeners[ key ] = listener;

		} // end FOR i

		// Add keyboard listeners:
		document.addEventListener(
			'keydown',
			keydown( this._listeners ),
			false
		);

		// Hide all panels, except the current panel:
		for ( var j = 0; j < this._numPanels; j++ ) {
			if ( j === current ) {
				panels[ j ].classList.add( 'panel-current' );
				continue;
			}
			panels[ j ].classList.add( 'panel-hidden' );
		}

		// Update the ARIA states:
		if ( this._numPanels > 1 ) {
			nav.left.setAttribute( 'aria-disabled', false );
			nav.right.setAttribute( 'aria-disabled', false );

			// TODO: handle up/down
		}

		return this;
	}; // end METHOD init()

	/**
	* METHOD: scroll( direction )
	*	Scroll to the next panel.
	*
	* @returns {Panels} Panels instance
	*/
	Panels.prototype.scroll = function( direction ) {
		var self = this,
			panels = this._panels,
			numPanels = this._numPanels,
			current = this._current,
			next,
			cPanel, nPanel;

		if ( typeof direction !== 'string' ) {
			throw new Error( 'scroll()::invalid input argument. Direction must be a string.' );
		}

		direction = direction.toLowerCase();
		if ( DIRECTIONS.indexOf( direction ) === -1 ) {
			throw new Error( 'scroll()::invalid input argument. Unrecognized direction: ' + direction + '. Direction must be one of the following: ' + JSON.stringify( DIRECTIONS ) + '.' );
		}

		if ( this._animating ) {
			// Wait to finish animating before allowing further scrolling...
			return;
		}
		this._animating = true;

		// Determine what panel is next:
		next = ( current === numPanels-1 ) ? 0 : current+1;

		// Get the current and next panels:
		cPanel = panels[ current ];
		nPanel = panels[ next ];

		// Send the panel which is next off in the specified direction:
		nPanel.classList.add( 'panel-' + direction );
		nPanel.classList.remove( 'panel-hidden' );

		// Add a listener for the transition end event:
		nPanel.addEventListener( EVENT, transitionEnd );

		// Add a class to the panel container to begin animation:
		this._selection.classList.add( 'scroll-' + direction );
		 
		return this;

		/**
		* FUNCTION: transitionEnd( event )
		*	Transition end event listener.
		*
		* @param {Object} event - event object
		*/
		function transitionEnd( event ) {
			var prop = event.propertyName
				.toLowerCase()
				.split( '-' );

			prop = prop
				.slice( 1, prop.length )
				.join( '' );

			if ( prop !== TRANSFORM.toLowerCase() ) {
				return false;
			}

			// Remove the event listener:
			nPanel.removeEventListener( EVENT, transitionEnd );

			// Update the panel classes:
			cPanel.classList.add( 'panel-hidden' );
			cPanel.classList.remove( 'panel-current' );

			nPanel.classList.remove( 'panel-' + direction );
			nPanel.classList.add( 'panel-current' );

			// Remove the scroll class:
			self._selection.classList.remove( 'scroll-' + direction );

			// Update the current panel index:
			self._current = next;

			// Reset the animation status:
			self._animating = false;
		} // end FUNCTION transitionEnd()
	}; // end METHOD scroll()

	/**
	* METHOD: _scrollRight()
	*	Returns an event listener for events indicating to scroll to the right.
	*
	* @private
	*/
	Panels.prototype._scrollRight = function() {
		var self = this;
		/**
		* FUNCTION: scrollRight( event )
		*	Event listener to scroll right.
		*
		* @private
		* @param {Object} event - event object
		*/
		return function scrollRight( event ) {
			self.scroll( 'right' );
		};
	}; // end METHOD _scrollRight()

	/**
	* METHOD: _scrollLeft()
	*	Returns an event listener for events indicating to scroll to the left.
	*
	* @private
	*/
	Panels.prototype._scrollLeft = function() {
		var self = this;
		/**
		* FUNCTION: scrollLeft( event )
		*	Event listener to scroll left.
		*
		* @private
		* @param {Object} event - event object
		*/
		return function scrollLeft( event ) {
			self.scroll( 'left' );
		};
	}; // end METHOD _scrollLeft()

	/**
	* METHOD: _scrollUp()
	*	Returns an event listener for events indicating to scroll up.
	*
	* @private
	*/
	Panels.prototype._scrollUp = function() {
		var self = this;
		/**
		* FUNCTION: scrollUp( event )
		*	Event listener to scroll up.
		*
		* @private
		* @param {Object} event - event object
		*/
		return function scrollUp( event ) {
			console.log( 'Go up!' );
		};
	}; // end METHOD _scrollUp()

	/**
	* METHOD: _scrollDown()
	*	Returns an event listener for events indicating to scroll down.
	*
	* @private
	*/
	Panels.prototype._scrollDown = function() {
		var self = this;
		/**
		* FUNCTION: scrollDown( event )
		*	Event listener to scroll down.
		*
		* @private
		* @param {Object} event - event object
		*/
		return function scrollDown( event ) {
			console.log( 'Go down!' );
		};
	}; // end METHOD _scrollDown()

	/**
	* METHOD: _getControls()
	*	Retrieves a controls DOMElement. If no controls exist in the parent selection, inserts a controls element.
	*
	* @private
	* @returns {Panels} Panels instance
	*/
	Panels.prototype._getControls = function() {
		this._controls = this._selection.querySelector( '.ui-scroll-controls');

		if ( !this._controls ) {
			this._selection.innerHTML += PARTIAL;
			this._controls = this._selection.querySelector( '.ui-scroll-controls');
		}

		return this;
	}; // end METHOD _getControls()

	/**
	* METHOD: _getNavigation()
	*	Retrieves all control navigation elements.
	*
	* @private
	* @returns {Panels} Panels instance
	*/
	Panels.prototype._getNavigation = function() {
		var parent = this._controls,
			nav = this._nav,
			key;

		for ( var i = 0; i < KEYS.length; i++ ) {
			key = KEYS[ i ];
			nav[ key ] = parent.querySelector( NAV[ key ] );
			if ( !nav[ key ] ) {
				throw new Error( 'panels()::unable to select the control UI element having class: ' + NAV[ key ] + '.' );
			}
		}
		return this;
	}; // end METHOD _getNavigation()

	/**
	* METHOD: _getPanels()
	*	Retrieves all scrolling elements and adds a Panels specific class to those elements.
	*
	* @private
	* @returns {Panels} Panels instance
	*/
	Panels.prototype._getPanels = function() {
		var parent = this._selection,
			sibling = this._controls,
			panels;

		panels = Array.prototype.slice
			.call( parent.childNodes, 0 )
			.filter( function ( child ) {
				return child !== sibling;
			});

		for ( var i = 0; i < panels.length; i++ ) {
			panels[ i ].classList.add( 'ui-scroll-panel' );
		}
		this._panels = panels;
		this._numPanels = panels.length;
		return this;
	}; // end METHOD _getPanels()


	// EXPORTS //

	module.exports = function createPanels() {
		return new Panels();
	};

})();