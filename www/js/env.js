(function (window) {
    window.__env = window.__env || {};

    // API url
    if(localStorage.getItem('api_url')) {
        window.__env.apiUrl = 'http://snug.local/api/v1/';
    }
    else {
        window.__env.apiUrl = 'http://snugfeed.com/api/v1/';
    }

    // Base url
    window.__env.baseUrl = '/';

    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
}(this));