/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
goog.module('goog.Thenable');
goog.module.declareLegacyNamespace();

/** @suppress {extraRequire} used in complex type */
const GoogPromise = goog.requireType('goog.Promise');  // for the type reference.

/**
 * Provides a more strict interface for Thenables in terms of
 * http://promisesaplus.com for interop with {@see GoogPromise}.
 *
 * @interface
 * @extends {IThenable<TYPE>}
 * @template TYPE
 */
function Thenable() {}

/**
 * Adds callbacks that will operate on the result of the Thenable, returning a
 * new child Promise.
 *
 * If the Thenable is fulfilled, the `onFulfilled` callback will be
 * invoked with the fulfillment value as argument, and the child Promise will
 * be fulfilled with the return value of the callback. If the callback throws
 * an exception, the child Promise will be rejected with the thrown value
 * instead.
 *
 * If the Thenable is rejected, the `onRejected` callback will be invoked with
 * the rejection reason as argument. Similar to the fulfilled case, the child
 * Promise will then be resolved with the return value of the callback, or
 * rejected with the thrown value if the callback throws an exception.
 *
 * @param {?(function(this:THIS, TYPE): VALUE)=} opt_onFulfilled A
 *     function that will be invoked with the fulfillment value if the Promise
 *     is fulfilled.
 * @param {?(function(this:THIS, *): *)=} opt_onRejected A function that will
 *     be invoked with the rejection reason if the Promise is rejected.
 * @param {THIS=} opt_context An optional context object that will be the
 *     execution context for the callbacks. By default, functions are executed
 *     with the default this.
 *
 * @return {RESULT} A new Promise that will receive the result
 *     of the fulfillment or rejection callback.
 * @template VALUE
 * @template THIS
 *
 * When a Promise (or thenable) is returned from the fulfilled callback,
 * the result is the payload of that promise, not the promise itself.
 *
 * @template RESULT := type('goog.Promise',
 *     cond(isUnknown(VALUE), unknown(),
 *       mapunion(VALUE, (V) =>
 *         cond(isTemplatized(V) && sub(rawTypeOf(V), 'IThenable'),
 *           templateTypeOf(V, 0),
 *           cond(sub(V, 'Thenable'),
 *              unknown(),
 *              V)))))
 *  =:
 *
 */
Thenable.prototype.then = function(
    opt_onFulfilled, opt_onRejected, opt_context) {};

/**
 * An expando property to indicate that an object implements
 * `Thenable`.
 *
 * {@see addImplementation}.
 *
 * @const
 */
Thenable.IMPLEMENTED_BY_PROP = '$goog_Thenable';

/**
 * Marks a given class (constructor) as an implementation of Thenable, so
 * that we can query that fact at runtime. The class must have already
 * implemented the interface.
 * Exports a 'then' method on the constructor prototype, so that the objects
 * also implement the extern {@see Thenable} interface for interop with
 * other Promise implementations.
 * @param {function(new:Thenable,...?)} ctor The class constructor. The
 *     corresponding class must have already implemented the interface.
 * @nocollapse
 */
Thenable.addImplementation = function(ctor) {
  if (COMPILED) {
    ctor.prototype[Thenable.IMPLEMENTED_BY_PROP] = true;
  } else {
    // Avoids dictionary access in uncompiled mode.
    ctor.prototype.$goog_Thenable = true;
  }
};

/**
 * @param {?} object
 * @return {boolean} Whether a given instance implements `Thenable`.
 *     The class/superclass of the instance must call `addImplementation`.
 */
Thenable.isImplementedBy = function(object) {
  if (!object) {
    return false;
  }
  try {
    if (COMPILED) {
      return !!object[Thenable.IMPLEMENTED_BY_PROP];
    }
    return !!object.$goog_Thenable;
  } catch (e) {
    // Property access seems to be forbidden.
    return false;
  }
};

exports = Thenable;
