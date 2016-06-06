/*!
 * Voila
 * @preserve
 * @version 0.1.5
 * @author NIW London (nate@niwlondon.com)
 * 
 * @description Tiny library used to run sections of code only when certain classes exsist in the body tag
 * Code can also be saved the an object and retried at a later point
 * The class contains settings and cache as well, all useful for making sites
 *
 * Some ideas taken from http://goo.gl/EUTi53 by Paul Irish
 */

function Voila() {
	// Try and keep the properities clean
	this.settings = {
		version: null,
		debug: false
	};

	this.cache = {};
	this.savedFunctions = {};

	this._eventsList = [];

	// For wordpress, the events list is made up of classes found in the body classes
	this._eventsList = document.body.className.split(/\s+/);
}

/*
 * Finds the single event in eventList
 */
Voila.prototype.findEvent = function(name) {
	if(name === 'global' || this._eventsList.indexOf(name) != -1) {
		return true;

	} else {
		return false;
	}
};

/*
 * Returns if the event input matches anything in the event list
 */
Voila.prototype.checkEvents = function(name) {
	var that = this,
		fire = false;

	// If an array is given, work through each index item
	if(	Array.isArray(name) ) {

		Array.prototype.forEach.call(name, function(single, i) {
			fire = that.findEvent(single) ? true : fire;

		});

	} else {
		fire = that.findEvent(name) ? true : fire;
	}

	// Variables used so the event only ever fires once
	return fire;
};

/*
 * Acts as wrapper to ensure code is only run if exsists in the event list
 * For any code in the callbacks, this will be equal to the Voila class
 */
Voila.prototype.when = function(events, cb, onReady) {
	var fire;

	// Defaults to running callback in the jQuery ready wrapper (if jQuery avalaible)
	onReady = typeof onReady === "undefined" ? true : onReady;

	fire = this.checkEvents(events) && typeof events !== 'undefined' && typeof cb === 'function';

	if(fire) {
		if(onReady) {
			if( typeof jQuery === 'function') {
				jQuery(document).on('ready', function() {
					cb.call(this);
				});
			} else {
				document.addEventListener("DOMContentLoaded", function() {
					cb.call(this);
				});
			}
		} else {
			cb.call(this);
		}
	}
};

/*
 * Save a function to a Voila method for use later
 */
Voila.prototype.save = function(name, cb) {
	if(typeof cb === 'function') {
		this.savedFunctions[name] = cb;
	}
};

/*
 * Run a saved function. The arg needs to be provided as an array
 */
Voila.prototype.run = function(name, args) {
	var run;

	run = name !== '';
	run = run && typeof this.savedFunctions[name] === 'function';

	if(run) {
		return this.savedFunctions[name].apply(this, args);
	}
};

// add default object to window, can create as many instances as possible
// and... Voila
window.voila = new Voila();