var helper = {
  /**
   * debouncing, executes the function if there was no new event in $wait milliseconds
   * @param func
   * @param wait
   * @param scope
   * @returns {Function}
   */
  debounce: function (func, wait, scope) {
    let timeout
      return function () {
        let context = scope || this
        let args = arguments
        let later = function () {
          timeout = null
          func.apply(context, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
  },

  /**
   * in case of a "storm of events", this executes once every $threshold
   * @param fn
   * @param threshhold
   * @param scope
   * @returns {Function}
   */
  throttle: function (fn, threshhold, scope) {
    threshhold || (threshhold = 250)
    let last, deferTimer
    return function () {
      let context = scope || this
      let now = +new Date()
      let args = arguments
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer)
        deferTimer = setTimeout(function () {
          last = now
          fn.apply(context, args)
        }, threshhold)
      } else {
        last = now
        fn.apply(context, args)
      }
    }
  }
}

export { helper }
