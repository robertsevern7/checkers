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
    'models/Tile',
    'collections/Tiles'],
function($, _, Backbone, bootstrap, firebase, GameView, TurnIndicatorView, Tile, Tiles) {
    $(function() {
        //TODO need to store this id as a cookie or something -- maybe local storage?
        var myId = Math.floor(Math.random()*10000000);

        var firebaseRef = new Firebase('https://checkers-game.firebaseio.com//checkers');
        var fireBaseGame;
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
        var gameView = new GameView();

        var Router = Backbone.Router.extend({
            routes: {
              "": "home",
              "game/:id": "game"
            }
        });

        var router = new Router;
        router.on('route:game', function(id) {
            fireBaseGame = new Firebase('https://checkers-game.firebaseio.com/checkers/' + id);

            board.on('moved', function() {
                fireBaseGame.update({
                    lastTurn: myId,
                    board: board.getData()
                });
            })

            fireBaseGame.on('value', function(data) {
                if (!data) {
                    return;
                }

                var gameOwner = data.val().gameOwner == myId;

                var yourTurn = data.val().lastTurn ? data.val().lastTurn != myId : gameOwner;
                turnIndicatorView.render(yourTurn);
                board.destroyAll();
                board.add(data.val().board)
                gameView.render(board, gameOwner, yourTurn);
            })
        })

        Backbone.history.start();
    });
})