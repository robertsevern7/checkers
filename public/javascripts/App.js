configureRequire();

function htmlEncode(value){
    return $('<div/>').text(value).html();
}

define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'firebase',
    'views/GameView',
    'views/TurnIndicatorView',
    'views/GameOverView',
    'models/Tile',
    'collections/Tiles'],
function($, _, Backbone, bootstrap, firebase, GameView, TurnIndicatorView, GameOverView, Tile, Tiles) {
    $(function() {
        //TODO need to store this id as a cookie or something -- maybe local storage?
        var myId = Math.floor(Math.random()*10000000);

        var firebaseRef = new Firebase('https://checkers-game.firebaseio.com//checkers');
        var fireBaseGame;
        var gameOwner;
        var board = new Tiles();
        $('#newgame').click(function() {
            //TODO probably need a guaranteed unique # from the server
            var gameId = Math.floor(Math.random()*10000000);
            router.navigate('game/' + gameId, {trigger:true});
            fireBaseGame = firebaseRef.child(gameId);
            var initialBoard = board.getInitialBoard();
            fireBaseGame.set({
                gameOwner: myId,
                board: initialBoard
            });
        });

        var turnIndicatorView = new TurnIndicatorView();
        var gameOverView = new GameOverView();
        var gameView = new GameView();

        var Router = Backbone.Router.extend({
            routes: {
              "": "home",
              "game/:id": "game"
            }
        });

        var router = new Router;
        router.on('route:game', function(id) {
//            fireBaseGame && fireBaseGame.un('value', setTheBoard);
            fireBaseGame = new Firebase('https://checkers-game.firebaseio.com/checkers/' + id);
            fireBaseGame.on('value', setTheBoard);
        })

        board.on('moved', function(forceNextMove, x, y) {
            var updateData = {
                board: board.getData()
            }

            var forcedMovePiece;
            if (!forceNextMove) {
                updateData.lastTurn = myId;
                updateData.forcedMovePiece = {x: -1, y: -1};
            } else {
                forcedMovePiece = {x: x, y: y};
                updateData.forcedMovePiece = forcedMovePiece;
            }

            gameView.render(board, gameOwner, false, forcedMovePiece);

            var pieceCounts = board.getPieceCounts();

            if (!pieceCounts.player1) {
                updateData.winner = 2;
            } else if (!pieceCounts.player2) {
                updateData.winner = 1;
            }

            fireBaseGame.update(updateData);
        })

        var setTheBoard = function(data) {
            if (!data) {
                return;
            }

            gameOwner = data.val().gameOwner == myId;

            var winner = data.val().winner;
            var yourTurn = data.val().lastTurn ? data.val().lastTurn != myId : gameOwner;
            turnIndicatorView.render(yourTurn, !!winner);
            gameOverView.render(winner);
            board.destroyAll();
            board.add(data.val().board)
            var forcedPiece = yourTurn && data.val().forcedMovePiece && data.val().forcedMovePiece.x != -1 && data.val().forcedMovePiece;
            gameView.render(board, gameOwner, yourTurn, forcedPiece);
        }

        Backbone.history.start();
    });
})