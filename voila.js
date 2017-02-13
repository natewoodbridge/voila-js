/*!
 * Voila
 * @preserve
 * @version 0.4.0
 * @author Nate Woodbridge (hi@natewoodbridge.com)
 * 
 * @description Tiny library used to run sections of code only when certain classes exsist in the body tag
 * Code can also be saved the an object and retried at a later point
 * The class contains settings and cache as well, all useful for making sites
 *
 * Some ideas taken from http://goo.gl/EUTi53 by Paul Irish
 */

'use strict';

(function(factory) {
    if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports !== 'undefined') {
		module.exports = factory;
	} else {
		window.voilajs = factory;
	}
}(function($) {

	function Voila() {
		// Try and keep the properties clean
		this.settings = {
			debug: false
		};

		this.cache = {};

		this._savedMethods = {};
		this._eventsList = [];

		// Populate the array with body classes, other events be added after class set up
		this._eventsList = document.body.className.split(/\s+/);
	}

	/*
	 * Checks to see if event name exists in the _eventsList
	 * Can only pass a string
	 */
	Voila.prototype.eventExists = function(name) {
		if(name === 'global' || name === 'common' || name === 'finalize' || this._eventsList.indexOf(name) !== -1) {
			return true;
		} else {
			return false;
		}
	};

	/*
	 * Checks a passed string/array against the events list, if any matches found, returns true
	 */
	Voila.prototype.checkEvents = function(name) {
		var that = this,
			match = false;

		// If an array is given, work through each item
		if(	Array.isArray(name) ) {

			Array.prototype.forEach.call(name, function(single, i) {
				match = that.eventExists(single) ? true : match;

			});

		} else {

			match = that.eventExists(name) ? true : match;

		}

		// Variables used so the event only ever matches once
		return match;
	};

	/*
	 * Code will only be run if event is found in the list
	 * For any code in the callbacks, `this` will be equal to the Voila class
	 */
	Voila.prototype.when = function(events, cb, onReady) {
		var fire,
			that = this;

		// Defaults to running callback in the jQuery ready wrapper (if jQuery is avalaible)
		var runOnReady = ( typeof onReady === "undefined" ? true : onReady );

		fire = this.checkEvents(events) && typeof events !== 'undefined' && typeof cb === 'function';

		if(fire) {
			if(runOnReady) {
				if( typeof jQuery === 'function' ) {
					jQuery(document).on('ready', function() {
						cb.call(that);
					});
				} else {
					document.addEventListener("DOMContentLoaded", function() {
						cb.call(that);
					});
				}
			} else {
				cb.call(this);
			}
		}

		return false;
	};

	/*
	 * Save a function to a Voila method for use later
	 */
	Voila.prototype.saveMethod = function(name, cb) {
		if(typeof cb === 'function') {
			this._savedMethods[name] = cb;
		}
	};

	/*
	 * Run a saved function.
	 * The arg needs to be provided as an array
	 */
	Voila.prototype.runMethod = function(name, args) {
		var run = false;

		run = name !== '';
		run = run && typeof this._savedMethods[name] === 'function';

		if(run) {
			return this._savedMethods[name].apply(this, args);
		}
	};

	// You need to init the class
	// var voila = new Voila();

	return Voila;

}));