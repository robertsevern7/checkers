define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'text!/templates/turnIndicator.html'],
function($, _, Backbone, bootstrap, turnIndicator) {
    var TurnIndicatorView = Backbone.View.extend({
        el: $('#turnindicator'),
        template: _.template(turnIndicator),
        render: function (yourTurn) {
            $(this.el).html(this.template({
                yourTurn: yourTurn
            }));
            return this;
        }
    });

    return TurnIndicatorView;
})