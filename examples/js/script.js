

(function(){
	'use strict';

	for ( var i = 1; i <= 5; i++ ) {
		uiScrollPanels()
			.select( '.panels-'+i )
			.init();
	}

})();