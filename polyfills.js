// Import text encoding polyfill
import 'fast-text-encoding';
import 'whatwg-fetch';

// Simple ReadableStream polyfill
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {
    constructor(underlyingSource = {}, strategy = {}) {
      this._underlyingSource = underlyingSource;
      this._strategy = strategy;
      this._reader = null;
      this._state = 'readable';
      this._storedError = null;

      if (underlyingSource.start) {
        try {
          underlyingSource.start({
            enqueue: () => {},
            close: () => {
              this._state = 'closed';
            },
            error: (err) => {
              this._state = 'errored';
              this._storedError = err;
            },
          });
        } catch (error) {
          this._state = 'errored';
          this._storedError = error;
        }
      }
    }

    get locked() {
      return !!this._reader;
    }

    getReader() {
      if (this.locked) {
        throw new TypeError('ReadableStream is already locked');
      }

      this._reader = {
        read: () => Promise.resolve({ done: true, value: undefined }),
        releaseLock: () => {
          this._reader = null;
        },
        closed: Promise.resolve(),
      };

      return this._reader;
    }

    cancel(reason) {
      if (this._state === 'closed') {
        return Promise.resolve();
      }

      if (this._state === 'errored') {
        return Promise.reject(this._storedError);
      }

      this._state = 'closed';

      if (this._underlyingSource.cancel) {
        try {
          this._underlyingSource.cancel(reason);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      return Promise.resolve();
    }

    // Minimal implementation of other required methods
    tee() {
      return [new ReadableStream(), new ReadableStream()];
    }

    pipeThrough() {
      throw new Error('Not implemented');
    }

    pipeTo() {
      throw new Error('Not implemented');
    }
  };
}

export default {};
