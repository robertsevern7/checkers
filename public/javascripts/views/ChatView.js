define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'collections/Messages',
    'text!/templates/chatWindow.html'],
function($, _, Backbone, bootstrap, Messages, chatWindow) {
    var isPlayer1, messages;
    var ChatView = Backbone.View.extend({
        initialize: function(config) {
            isPlayer1 = config.isPlayer1;
            var initialMessages = config.initialMessages || [];

            messages = new Messages();

            for (var i = 0, len = initialMessages.length; i < len; i ++) {
                messages.add(initialMessages[i]);
            }

            this._fireBaseMessages = new Firebase(config.fireBaseLocation + config.gameId + '/messages');
            this._fireBaseMessages.on('child_added', $.proxy(this.addMessageLocally, this));

            this.render();
        },
        el: $('#chat-window'),
        template: _.template(chatWindow),
        render: function () {
            $(this.el).html(this.template({
                messages: messages.models
            }));

            return this;
        }, events: {
            'keyup .messageinput': 'addMessageToFirebase',
        },
        addMessageLocally:function(data) {
            messages.add(data.val());
            this.render();
        },
        addMessageToFirebase: function(ev) {
            var value = $('.messageinput').val();
            if (ev.which === 13 && value) {
                var message = {
                    player: isPlayer1 ? 1 : 2,
                    message: value
                };

                this._fireBaseMessages.push(message);
            }
        }
    });

    return ChatView;
})