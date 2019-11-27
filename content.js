debounce = function(func, wait, immediate) {
  var result;
  var timeout = null;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};

const emoji = new EmojiConvertor();

const backtickStyle = `padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px; `;

const action = function() {
  var pElements = document.getElementsByTagName("p");
  var spanElements = document.getElementsByTagName("span");

  var elements = [...pElements, ...spanElements];

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
      var node = element.childNodes[j];

      if (node.nodeType === 3) {
        var text = node.nodeValue;
        var replacedText = text.replace(/_.*?_/gi, function(m) {
          return m.replace(/_/g, "").italics();
        });

        replacedText = replacedText.replace(/\*.*?\*/gi, function(m) {
          return (
            '<span style="font-weight:bold">' + m.replace(/\*/g, "") + "</span>"
          );
        });

        replacedText = replacedText.replace(/\~.*?\~/gi, function(m) {
          return (
            '<span style="text-decoration:line-through">' +
            m.replace(/\~/g, "") +
            "</span>"
          );
        });

        replacedText = replacedText.replace(/```[\w\W\s]*?```/gi, function(m) {
          return (
            `<code style="${backtickStyle}">` +
            m.replace(/```/g, "") +
            "</code>"
          );
        });

        replacedText = replacedText.replace(/\`.*?\`/gi, function(m) {
          return (
            `<code style="${backtickStyle}">` + m.replace(/\`/g, "") + "</code>"
          );
        });

        const span = document.createElement("span");
        replacedText = emoji.replace_colons(replacedText);
        span.innerHTML = replacedText;

        if (replacedText !== text) {
          element.replaceChild(span, node);
        }
      }
    }
  }
};

action();

// Create an observer instance.
var observer = new MutationObserver(
  debounce(function() {
    action();
  }, 1000)
);

// Config info for the observer.
var config = {
  childList: true,
  subtree: true
};

// Observe the body (and its descendants) for `childList` changes.
observer.observe(document.body, config);
