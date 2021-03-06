define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'text!/templates/boardTemplate.html'],
function($, _, Backbone, bootstrap, boardTemplate) {
    var GameView = Backbone.View.extend({
        el: $('#board'),
        template: _.template(boardTemplate),
        render: function (board, gameOwner, yourTurn, forcedPiece) {
            this.board = board;
            this.yourTurn = yourTurn;
            var toDraw = board.models;

            if (gameOwner) {
                var reversed = [];

                for (var i = board.models.length - 1; i >= 0; i--) {
                    reversed.push(board.models[i]);
                }

                toDraw = reversed;
            }

            this.gameOwner = gameOwner;
            $(this.el).html(this.template({
                board: toDraw,
                reversed: !gameOwner,
                forcedPiece: forcedPiece
            }));

            if (forcedPiece) {
                var possibleMoves = this.board.findPossibleTakingMoves(forcedPiece.x, forcedPiece.y);
                this.highlightPossibleMoves(possibleMoves);
                this.selectPieceDisallowed = true;
            } else {
                this.selectPieceDisallowed = false;
            }

            return this;
        },
        events: {
            'mouseenter .active': 'highlightPiece',
            'mouseleave .active': 'unhighlightPiece',
            'click .active': 'selectPiece',
            'click .possibleMove': 'makeMove'
        },
        highlightPiece: function(event) {
            if (this.yourTurn && !this.selectPieceDisallowed) {
                $(event.target).addClass('pieceover');
            }
        },
        unhighlightPiece: function(event) {
            $(event.target).removeClass('pieceover');
        },
        selectPiece: function(event) {
            if (this.yourTurn && !this.selectPieceDisallowed) {
                $('.pieceselect').each(function() {
                    if ($(this).hasClass('pieceselect')) {
                        $(this).removeClass('pieceselect');
                    }
                });
                $(event.target).addClass('pieceselect');
                var pos = $(event.target).attr('data-position').split(',');
                var x = pos[0] - 0;
                var y = pos[1] - 0;

                var possibleMoves = this.board.findPossibleMoves(x, y);
                this.highlightPossibleMoves(possibleMoves);
            }
        },

        highlightPossibleMoves: function(possibleMoves) {
            $('.possibleMove').each(function() {
                if ($(this).hasClass('possibleMove')) {
                    $(this).removeClass('possibleMove');
                }
            });

            for (var i = 0, len = possibleMoves.length; i < len; i++) {
                var possibleMove = possibleMoves[i];
                $( "[data-position='" + possibleMove[0] + "," + possibleMove[1] + "']").addClass('possibleMove');
            }
        },

        makeMove: function(event) {
            var moveToPos = $(event.target).attr('data-position').split(',');
            var selectorClass = this.selectPieceDisallowed ? '.forcedmove' : '.pieceselect';
            var moveFromPos = $(selectorClass).attr('data-position').split(',');
            this.board.movePiece(moveFromPos, moveToPos);
        }
    });

    return GameView;
});