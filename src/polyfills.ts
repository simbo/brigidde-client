/**
 * @TODO: optimize/reduce polyfills, load only when needed
 * https://philipwalton.com/articles/loading-polyfills-only-when-needed/
 */

/**
 * IE9, IE10 and IE11 require all of the following polyfills
 * https://github.com/zloirock/core-js
 */
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/weak-map';
import 'core-js/es6/weak-set';
import 'core-js/es6/typed';

/**
 * Evergreen browsers require these
 */
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';

/**
 * IE10 and IE11 require the following for NgClass support on SVG elements
 * https://github.com/eligrey/classList.js
 */
import 'classlist.js';

/**
 * Required to support Web Animations `@angular/animation`.
 * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
 * https://github.com/web-animations/web-animations-js
 */
import 'web-animations-js';

/**
 * zone.js is required by Angular itself.
 * https://github.com/angular/zone.js/
 */
import 'zone.js/dist/zone';
