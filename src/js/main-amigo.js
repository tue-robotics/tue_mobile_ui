require.config({
    baseUrl: 'js/lib',

    // mapping of name --> file
    paths: {
        'jquery-hashchange': 'jquery.ba-hashchange',
    },

    // define older (non AMD) modules
    shim: {
        'jquery-hashchange': ['jquery'],
        'bootstrap': ['jquery'],
    }
});

require([
    'pagenav'
], function() {
    console.log('all dependencies loaded');
});