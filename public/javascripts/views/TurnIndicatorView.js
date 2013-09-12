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
        render: function (yourTurn, gameFinished) {
            $(this.el).html(this.template({
                yourTurn: yourTurn,
                gameFinished: gameFinished
            }));

            if (gameFinished) {
                $(this.el).addClass('completely-hidden');
            } else {
                $(this.el).removeClass('completely-hidden');
            }

            return this;
        }
    });

    return TurnIndicatorView;
})