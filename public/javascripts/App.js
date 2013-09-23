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
    'views/GameUrlView',
    'views/ChatView',
    'models/Tile',
    'collections/Tiles'],
function($, _, Backbone, bootstrap, firebase, GameView, TurnIndicatorView, GameOverView, GameUrlView, ChatView, Tile, Tiles) {
    var fireBaseLocation = 'https://checkers-game.firebaseio.com/checkers/';
    $(function() {
        var firebaseRef = new Firebase(fireBaseLocation);
        var fireBaseGame;
        var fireBaseBoard;
        var gameOwner;
        var myId;
        var board = new Tiles();
        $('.newgame').click(function() {
            var myId = Math.floor(Math.random()*10000000);
            var gameId = Math.floor(Math.random()*10000000);
            fireBaseGame = firebaseRef.child(gameId);
            var initialBoard = board.getInitialBoard();
            fireBaseGame.set({
                messages: [],
                game: {
                    gameOwner: myId,
                    board: initialBoard
                }
            });


            router.navigate('game/' + gameId + '?user=' + myId, {trigger:true});
        });

        var turnIndicatorView = new TurnIndicatorView();
        var gameOverView = new GameOverView();
        var gameView = new GameView();

        var Router = Backbone.Router.extend({
            routes: {
              "": "home",
              "game/:params": "game"
            },
            home: function() {
                $('.nogame-visible').show();
                $('.game-visible').hide();
            },
            game: function(params) {
                var gameId;
                var split = params.split('?');
                if (split.length === 0 || split.length > 2) {
                    return;
                } else if (split.length === 1) {
                    myId = Math.floor(Math.random()*10000000);
                    gameId = split[0];
                    router.navigate('game/' + gameId + '?user=' + myId, {trigger:true});
                    return;
                } else {
                    gameId = split[0];
                    myId = split[1].split('=')[1];
                }
                $('.nogame-visible').hide();
                $('.game-visible').show();
                fireBaseGame = new Firebase(fireBaseLocation + gameId);
                fireBaseGame.once('value', function(data) {
                    isGameOwner = data.val().game.gameOwner == myId;

                    if (isGameOwner) {
                        new GameUrlView();
                    }

                    var initialMessages = data.val().messages;
                    var chatView = new ChatView({
                        fireBaseLocation: fireBaseLocation,
                        gameId :gameId,
                        isPlayer1: isGameOwner,
                        initialMessages: initialMessages
                    });

                    //The board listeners TODO move into the view
                    fireBaseBoard = new Firebase(fireBaseLocation + gameId + '/game');
                    fireBaseBoard.on('value', $.proxy(setTheBoard, this, myId));
                    chatView.focusInput();
                });
            }
        });

        var router = new Router;

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

            gameView.render(board, isGameOwner, false, forcedMovePiece);

            var pieceCounts = board.getPieceCounts();

            if (!pieceCounts.player1) {
                updateData.winner = 2;
            } else if (!pieceCounts.player2) {
                updateData.winner = 1;
            }

            fireBaseBoard.update(updateData);
        })

        var setTheBoard = function(myId, data) {
            if (!data) {
                return;
            }

            //TODO split this out into a separate listener
            var winner = data.val().winner;

            var yourTurn = data.val().lastTurn ? data.val().lastTurn != myId : isGameOwner;
            turnIndicatorView.render(yourTurn, !!winner);
            gameOverView.render(winner);
            board.destroyAll();
            board.add(data.val().board)

            var forcedPiece = yourTurn && data.val().forcedMovePiece && data.val().forcedMovePiece.x != -1 && data.val().forcedMovePiece;
            gameView.render(board, isGameOwner, yourTurn, forcedPiece);
        }

        Backbone.history.start();
    });
})