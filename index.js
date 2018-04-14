// Gets the URL of the current active tab
const getCurrentTabUrl = callback => {
  const queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, tabs => {
    const tab = tabs[0];
    const url = tab.url;

    callback(url);
  });
}

// Loads the selected theme
const loadTheme = theme => {
  /*
    To add new themes:

    The theme parameter is passed from the html dropdown menu
    The theme paramter should match a .css file with the same name, e.g.:
      <option value='dark'>Dark</option> when selected will load './dark.css'
  */

  chrome.tabs.insertCSS({
    file: `./themes/${ theme }.css`
  });
}

// Retrieves chrome storage, checks for saved theme
const getSavedTheme = callback => {
  chrome.storage.sync.get('replTheme', items => {
    callback(chrome.runtime.lastError ? null : items.replTheme);
  });
}

// Saves current theme to chrome storage
const saveTheme = theme => {
  const items = { replTheme: theme };

  chrome.storage.sync.set(items);
}

/*
  When page loads, checks url for 'repl.it'
    Checks chrome storage for saved theme, loads if found
    Listens for changes to selected theme
*/

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl(url => {
    if (/repl.it/gi.test(url)) {
      const dropdown = document.getElementById('repl-theme-dropdown');

      getSavedTheme(savedTheme => {
        if (savedTheme) {
          loadTheme(savedTheme);
          dropdown.value = savedTheme;
        }
      });

      dropdown.addEventListener('change', () => {
        loadTheme(dropdown.value);
        saveTheme(dropdown.value);
      });
    }
  });
});
