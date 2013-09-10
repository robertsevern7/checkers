require.config({
  baseUrl: '../public/javascripts',
  paths: {
    jquery: 'http://code.jquery.com/jquery',
    underscore: '../javascripts/lib/underscore',
    backbone: '../javascripts/lib/backbone',
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

define(['../../tests/spec/collections/TilesSpec'],
function() {
    (function() {
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };

        var currentWindowOnload = window.onload;

        execJasmine();

        function execJasmine() {
            jasmineEnv.execute();
        }
    })();
});