# voila.js
Wrap javascript code to only fire on certain Wordpress sections/pages

Tiny library used to run sections of code only when certain classes exsist in the body tag
Code can also be saved the an object and retried at a later point
The class contains settings and cache as well, all useful for making sites
 
Some ideas taken from http://goo.gl/EUTi53 by Paul Irish


## Usage
Simply add the voila.min.js file before all your javascript, and then wrap the page specific content in voila.when()

Avalaible functions

- voila.when(['event', 'names'], function() {}, wrap code in document ready: true/false) (within this function this is equal to the voila class to make life easier)
- voila.save('referenceName', function(att1, att2) { })
- voila.run('referenceName', [att1, att2])
- voila.settings.version, or voila.settings.debug (You can easily add more of these)
- voila.cache.body, or voila.cache.html

You can create as many instances as you wish by simply calling the following line after the voila.min.js code has been placed

```javascript
var project = new Voila();
```


## Examples of code

Here is an example of how you might use the library.
```html
<body class="home single"></body>
```

```javascript
voila.save('name', function(first, last) {
	console.log('name', first, last);
});

voila.when(['global', 'home'], function() {
	console.log('multiple classes, will be run');
});

voila.when('single', function() {
	console.log('single post only code, will be run');

	voila.run('name', ['mark', 'smith']);
});

voila.when(['test1', 'test2], function() {
	console.log('this wont be run');
});
```

Enojy!
