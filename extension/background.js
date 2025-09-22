chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle_app') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          // a message to the content script on the current page
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleApp' });
        }
      });
    }
  });