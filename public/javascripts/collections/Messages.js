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
        }
    });

    return Messages;
});