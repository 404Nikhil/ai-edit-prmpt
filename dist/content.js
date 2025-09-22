let iframe = null;
let activeElement = null;

function toggleApp() {
  if (iframe) {
    iframe.remove();
    iframe = null;
    return;
  }

  // Remember the element you were typing in
  activeElement = document.activeElement;

  iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('index.html');
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    z-index: 2147483647;
    background: rgba(0,0,0,0.5);
  `;
  document.body.appendChild(iframe);
}

// Listen for messages from the background script (shortcut)
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleApp') {
    toggleApp();
  }
});

window.addEventListener('message', (event) => {
  if (event.source !== iframe.contentWindow) return;

  const { type, text } = event.data;
  if (type === 'INSERT_TEXT' && activeElement) {
    // Insert the generated text into the original text area
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      activeElement.value = text;
    } else if (activeElement.isContentEditable) {
      activeElement.textContent = text;
    }
    toggleApp(); // Close the app after inserting
  }
});