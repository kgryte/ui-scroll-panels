/**
*
*	UI: scroll controls
*
*
*	DESCRIPTION:
*		- 
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/07/22: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var createPanels = require( './scroll-panels.js' );


	// SCROLL PANELS //

	/**
	* FUNCTIONS: main( selector )
	*
	*
	* @param {String} selector - element selector
	*/
	function main( selector ) {
		
		// Create a new scroll panel instance:
		var scroll = createPanels();

		// Select the element in which scroll layout will be used:
		scroll
			.select( selector )
			.init();
		
	} // end FUNCTION main()


	// EXPORTS //

	module.exports = main;

})();