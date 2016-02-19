/*!
 * Voila
 * 0.1.1
 *
 * Tiny library used to run sections of code only when certain classes exsist in the body tag
 * Code can also be saved the an object and retried at a later point
 * The class contains settings and cache as well, all useful for making sites
 *
 * Some ideas taken from http://goo.gl/EUTi53 by Paul Irish
 */

function Voila() {
	// Try and keep the properities clean
	this.settings = {
		version: '0.1.0',
		debug: false
	};

	this.cache = {
		html: jQuery('html'),
		body: jQuery('body')
	};

	this.savedFunctions = {};

	// For wordpress, the events list is made up of classes found in the body classes
	this.eventsList = [];
	var that = this;

	jQuery.each(document.body.className.split(/\s+/), function(i, classname) {
    	jQuery.merge(that.eventsList, [classname]);
	});
}

/*
 * Finds the single event in eventList
 */
Voila.prototype.findEvent = function(name) {
	if(name === 'global' || jQuery.inArray(name, this.eventsList) != -1) {
		return true;

	} else {
		return false;
	}
};

/*
 * Returns if the event input matches anything in the event list
 */
Voila.prototype.checkEvent = function(name) {
	var that = this,
		fire = false;

	// If an array is given, work through each index item
	if(jQuery.isArray(name)) {

		jQuery.each(name, function(i, single) {
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

	// Defaults to running callback in the jQuery ready wrapper
	onReady = typeof onReady === "undefined" ? true : onReady;

	fire = this.checkEvent(events) && typeof events !== 'undefined' && typeof cb === 'function';

	if(fire) {
		if(onReady) {
			jQuery(document).ready(cb.call(this));
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