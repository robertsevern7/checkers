define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'text!/templates/gameUrl.html'],
function($, _, Backbone, bootstrap, gameUrl) {
    var GameUrlView = Backbone.View.extend({
        initialize: function() {
            this.render();
            $(this.el).show();
        },
        el: $('#game-url'),
        template: _.template(gameUrl),
        render: function () {
            var url = window.location.href.split('?')[0];

            $(this.el).html(this.template({
                url: url
            }));

            return this;
        }
    });

    return GameUrlView;
})