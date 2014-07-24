
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	scrollPanel = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( '/lib', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( scrollPanel ).to.be.a( 'function' );
	});


	// SELECT //

	describe( 'api/select', function tests() {

		it( 'should provide a method to select a DOMElement containing panels', function test() {
			var scroll = scrollPanel();
			expect( scroll.select ).to.be.a( 'function' );
		});

		it( 'should throw an error if the first argument is not a string', function test() {
			var scroll = scrollPanel(),
				values = [
					5,
					true,
					[],
					{},
					NaN,
					null,
					undefined,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[ i ] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					scroll.select( value );
				};
			}
		});

	});


	// CURRENT //

	describe( 'api/current', function tests() {

		it( 'should provide a method to get/set the current panel index', function test() {
			var scroll = scrollPanel();
			expect( scroll.current ).to.be.a( 'function' );
		});

	});


	// INIT //

	describe( 'api/init', function tests() {

		it( 'should provide an initialization method', function test() {
			var scroll = scrollPanel();
			expect( scroll.init ).to.be.a( 'function' );
		});

	});


	// SCROLL //

	describe( 'api/scroll', function tests() {

		it( 'should provide a method programmatically scroll between panels', function test() {
			var scroll = scrollPanel();
			expect( scroll.scroll ).to.be.a( 'function' );
		});

	});

});