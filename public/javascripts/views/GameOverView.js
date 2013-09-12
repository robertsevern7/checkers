define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'text!/templates/winnerIndicator.html'],
function($, _, Backbone, bootstrap, winnerIndicator) {
    var GameOverView = Backbone.View.extend({
        el: $('#winnerindicator'),
        template: _.template(winnerIndicator),
        render: function (winner) {
            $(this.el).html(this.template({
                player: winner
            }));

            if (winner) {
                $(this.el).removeClass('completely-hidden');
            } else {
                $(this.el).addClass('completely-hidden');
            }

            return this;
        }
    });

    return GameOverView;
})