function configureRequire() {
  require.config({
      paths: {
        firebase: 'https://cdn.firebase.com/v0/firebase',
        jquery: 'http://code.jquery.com/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        bootstrap: '../bootstrap/js/bootstrap'
      },
      shim: {
          underscore: {
            exports: '_'
          },
          backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
          },
          bootstrap: {
            deps: ["jquery"],
            exports: "Bootstrap"
          }
        }
    });
}