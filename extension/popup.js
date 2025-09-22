document.getElementById('openSettings').addEventListener('click', () => {
    chrome.tabs.create({ url: 'index.html' });
  });