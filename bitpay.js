/* jshint browser: true, strict: false, maxlen: false, maxstatements: false */
(function() {

  function warn() {
    if(window.console && window.console.warn) {
      window.console.warn.apply(window.console, arguments);
    }
  }

  if(window.bitpay) {
    warn('bitpay.js attempted to initialize more than once.');
    return;
  }

  var iframe = document.createElement('iframe');
  iframe.name = 'bitpay';
  iframe.class = 'bitpay';
  iframe.setAttribute('allowtransparency', 'true');
  iframe.style.display = 'none';
  iframe.style.border = 0;
  iframe.style.position = 'fixed';
  iframe.style.top = 0;
  iframe.style.left = 0;
  iframe.style.height = '100%';
  iframe.style.width = '100%';
  iframe.style.zIndex = '2147483647';

  var origin = 'https://bitpay.com';
  var onModalWillEnterMethod = function() {};
  var onModalWillLeaveMethod = function() {};

  function showFrame() {
    document.body.style.overflow = 'hidden';
    if (window.document.getElementsByName('bitpay').length === 0) {
      window.document.body.appendChild(iframe);
    }
    onModalWillEnterMethod();
    iframe.style.display = 'block';
  }

  function hideFrame() {
    onModalWillLeaveMethod();
    iframe.style.display = 'none';
    iframe = window.document.body.removeChild(iframe);
    document.body.style.overflow = 'auto';

  }

  function onModalWillEnter(customOnModalWillEnter) {
    onModalWillEnterMethod = customOnModalWillEnter;
  }

  function onModalWillLeave(customOnModalWillLeave) {
    onModalWillLeaveMethod = customOnModalWillLeave;
  }

  function receiveMessage(event){
    var uri;

    if(origin !== event.origin) {
      return;
    }
    if(event.data === 'close') {
      hideFrame();
    } else if(event.data === 'loaded') {
      showFrame();
    } else if(event.data && event.data.open) {
      uri = event.data.open;
      if(uri.indexOf('bitcoin:') === 0 || uri.indexOf('bitcoincash:') === 0) {
        event.preventDefault();
        if (event.data.mobile) {
          window.location.href = uri;
          return;
        }
        const iframe = document.createElement('iframe');
        iframe.src = uri;
        document.head.appendChild(iframe);
        setTimeout( function() {
          iframe.parentNode.removeChild(iframe);
        }, 100);
      }
    } else if(event.data && event.data.mailto) {
      uri = event.data.mailto;
      if(uri.indexOf('mailto:') === 0) {
        window.location = uri;
      }
    }
  }

  function showInvoice(invoiceId, params) {
    document.body.style.overflow = 'hidden';
    window.document.body.appendChild(iframe);
    var invoiceUrl = origin + '/invoice?id=' + invoiceId + '&v=3&view=modal';
    if (params && params.animateEntrance === false) {
      invoiceUrl += '&animateEntrance=false';
    }
    iframe.src = invoiceUrl;
  }

  function setApiUrlPrefix(urlPrefix) {
    origin = urlPrefix;
  }

  function enableTestMode(enable) {
    if(enable === false) {
      origin = 'https://bitpay.com';
      return;
    }
    origin = 'https://test.bitpay.com';
    warn('bitpay.js is running in test mode.');
  }

  function setButtonListeners() {
    var buttons = window.document.querySelectorAll('[data-bitpay-button]');
    for(var i = 0; i < buttons.length; i++) {
      var b = buttons[0];
      b.addEventListener('submit', showFrame);
    }
  }

  window.addEventListener('message', receiveMessage, false);
  setButtonListeners();

  window.bitpay = {
    showFrame: showFrame,
    hideFrame: hideFrame,
    showInvoice: showInvoice,
    onModalWillEnter: onModalWillEnter,
    onModalWillLeave: onModalWillLeave,
    enableTestMode: enableTestMode,
    setApiUrlPrefix: setApiUrlPrefix
  };

})();



window.bitpay.bitpay = window.bitpay;
module.exports = window.bitpay;
