// Workaround for https://github.com/jsdom/jsdom/issues/2524
import polyfillTextDecoder from './polyfills/polyfillTextDecoder'
import polyfillTextEncoder from './polyfills/polyfillTextEncoder'

if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef
  polyfillTextDecoder(window)
  // eslint-disable-next-line no-undef
  polyfillTextEncoder(window)
}
