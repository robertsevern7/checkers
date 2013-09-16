define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'models/Message'],
function($, _, Backbone, bootstrap, Message) {
    var Messages = Backbone.Collection.extend({
        model: Message,
        initialize: function() {
            _.extend(this, Backbone.Events);

            this.add({
                player: 1,
                message: 'Hi there'
            });

            this.add({
                player: 1,
                message: 'Do you want to play a game?'
            });

            this.add({
                player: 2,
                message: 'Go on then'
            });

            this.add({
                player: 1,
                message: 'Here is some long text that will need to wrap or something. !!!!!!!!!!!!! !!!!!!!! !!!!!!!! !!!!!!!1'
            });
        }
    });

    return Messages;
});