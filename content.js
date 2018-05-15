debounce = function(func, wait, immediate) {
  var result
  var timeout = null
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) result = func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) result = func.apply(context, args)
    return result
  }
}

const action = function() {
  var elements = document.getElementsByTagName('p')

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i]

    for (var j = 0; j < element.childNodes.length; j++) {
      var node = element.childNodes[j]

      if (node.nodeType === 3) {
        var text = node.nodeValue
        var replacedText = text.replace(/_.*?_/gi, function(m) {
          return m.replace(/_/g, '').italics()
        })

        replacedText = replacedText.replace(/\*.*?\*/gi, function(m) {
          return (
            '<span style="font-weight:bold">' + m.replace(/\*/g, '') + '</span>'
          )
        })

        const span = document.createElement('span')
        span.innerHTML = replacedText

        if (replacedText !== text) {
          element.replaceChild(span, node)
        }
      }
    }
  }
}

action()

// Create an observer instance.
var observer = new MutationObserver(
  debounce(function() {
    action()
  }, 1000)
)

// Config info for the observer.
var config = {
  childList: true,
  subtree: true
}

// Observe the body (and its descendants) for `childList` changes.
observer.observe(document.body, config)
