define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'models/Tile'],
function($, _, Backbone, bootstrap, Tile) {
    var Tiles = Backbone.Collection.extend({
        model: Tile,
        initialize: function() {
            _.extend(this, Backbone.Events);
        },

        getInitialBoard: function() {
            var tiles = [
                new Tile({player: 1, x: 0, y: 0}),
                new Tile({player: 0, x: 1, y: 0}),
                new Tile({player: 1, x: 2, y: 0}),
                new Tile({player: 0, x: 3, y: 0}),
                new Tile({player: 1, x: 4, y: 0}),
                new Tile({player: 0, x: 5, y: 0}),
                new Tile({player: 1, x: 6, y: 0}),
                new Tile({player: 0, x: 7, y: 0}),

                new Tile({player: 0, x: 0, y: 1}),
                new Tile({player: 1, x: 1, y: 1}),
                new Tile({player: 0, x: 2, y: 1}),
                new Tile({player: 1, x: 3, y: 1}),
                new Tile({player: 0, x: 4, y: 1}),
                new Tile({player: 1, x: 5, y: 1}),
                new Tile({player: 0, x: 6, y: 1}),
                new Tile({player: 1, x: 7, y: 1}),

                new Tile({player: 1, x: 0, y: 2}),
                new Tile({player: 0, x: 1, y: 2}),
                new Tile({player: 1, x: 2, y: 2}),
                new Tile({player: 0, x: 3, y: 2}),
                new Tile({player: 1, x: 4, y: 2}),
                new Tile({player: 0, x: 5, y: 2}),
                new Tile({player: 1, x: 6, y: 2}),
                new Tile({player: 0, x: 7, y: 2}),
            ];

            for (var i = 3; i < 5; i++) {
                for(var j = 0; j < 8; j++) {
                    tiles.push(new Tile({player: 0, x: j, y: i}));
                }
            }

            tiles.push(new Tile({player: 0, x: 0, y: 5}));
            tiles.push(new Tile({player: 2, x: 1, y: 5}));
            tiles.push(new Tile({player: 0, x: 2, y: 5}));
            tiles.push(new Tile({player: 2, x: 3, y: 5}));
            tiles.push(new Tile({player: 0, x: 4, y: 5}));
            tiles.push(new Tile({player: 2, x: 5, y: 5}));
            tiles.push(new Tile({player: 0, x: 6, y: 5}));
            tiles.push(new Tile({player: 2, x: 7, y: 5}));

            tiles.push(new Tile({player: 2, x: 0, y: 6}));
            tiles.push(new Tile({player: 0, x: 1, y: 6}));
            tiles.push(new Tile({player: 2, x: 2, y: 6}));
            tiles.push(new Tile({player: 0, x: 3, y: 6}));
            tiles.push(new Tile({player: 2, x: 4, y: 6}));
            tiles.push(new Tile({player: 0, x: 5, y: 6}));
            tiles.push(new Tile({player: 2, x: 6, y: 6}));
            tiles.push(new Tile({player: 0, x: 7, y: 6}));

            tiles.push(new Tile({player: 0, x: 0, y: 7}));
            tiles.push(new Tile({player: 2, x: 1, y: 7}));
            tiles.push(new Tile({player: 0, x: 2, y: 7}));
            tiles.push(new Tile({player: 2, x: 3, y: 7}));
            tiles.push(new Tile({player: 0, x: 4, y: 7}));
            tiles.push(new Tile({player: 2, x: 5, y: 7}));
            tiles.push(new Tile({player: 0, x: 6, y: 7}));
            tiles.push(new Tile({player: 2, x: 7, y: 7}));

            return tiles;
        },

        destroyAll: function () {
            while(this.models.length > 0) {
                this.models[0].destroy();
            }
        },

        findPossibleMoves: function(x, y) {
            x = x - 0;
            y = y - 0;
            var tile = this.models[getTileLocation(x , y)];
            var activePlayer = tile.get('player');
            var possible = [];
            var upgraded = tile.get('upgraded');

            if (upgraded) {
                var forwardMoves = this._findPossibleMoves(x, y, activePlayer, false);
                var backMoves = this._findPossibleMoves(x, y, activePlayer, true);
                return _.union(forwardMoves, backMoves);
            } else {
                var goingBack = activePlayer == 2;
                return this._findPossibleMoves(x, y, activePlayer, goingBack);
            }
        },

        _findPossibleMoves: function(x, y, activePlayer, goingBack) {
            var possible = [];

            var nextY = goingBack ? (y - 1) : (y + 1);
            var yPossible = goingBack ? (y > 0) : (y < 7);

            if (yPossible) {
                if (x > 0) {
                    var player = this.models[getTileLocation(x - 1, nextY)].get('player');
                    if (!player) {
                        possible.push([x - 1, nextY])
                    } else if (player !== activePlayer) {
                        var move = this._nextJumpPossible(x - 1, nextY, (nextY < y), false);
                        move && possible.push(move)
                    }
                }

                if (x < 7) {
                    var player = this.models[getTileLocation(x + 1, nextY)].get('player');
                    if (!player) {
                        possible.push([x + 1, nextY]);
                    } else if (player !== activePlayer) {
                        var move = this._nextJumpPossible(x + 1, nextY, (nextY < y), true);
                        move && possible.push(move)
                    }

                }
            }

            return possible;
        },

        _nextJumpPossible: function(x, y, goingBack, toRight) {
            var nextY = goingBack ? (y - 1) : (y + 1);
            var yPossible = goingBack ? (y > 0) : (y < 7);

            if (yPossible) {
                if (!toRight && x > 0) {
                    if (!this.models[getTileLocation(x - 1, nextY)].get('player')) {
                        return [x - 1, nextY];
                    }
                }

                if (toRight && x < 7) {
                    if (!this.models[getTileLocation(x + 1, nextY)].get('player')) {
                        return [x + 1, nextY];
                    }
                }
            }
        },

        findPossibleTakingMoves: function(x, y) {
            var possibleMoves = this.findPossibleMoves(x, y);
            var takingMoves = [];
            for (var i =0, len = possibleMoves.length; i < len; i++) {
                if (Math.abs(possibleMoves[i][0] - x) === 2 && Math.abs(possibleMoves[i][1] - y) === 2) {
                    takingMoves.push(possibleMoves[i]);
                }
            }

            return takingMoves;
        },

        movePiece: function(moveFromPos, moveToPos) {
            var from = this.models[getTileLocation(moveFromPos[0], moveFromPos[1])];
            var to = this.models[getTileLocation(moveToPos[0], moveToPos[1])];
            var removed = false;

            if (Math.abs(moveToPos[0] - moveFromPos[0]) === 2 && Math.abs(moveToPos[1] - moveFromPos[1]) === 2) {
                var removedPiece = this.models[getTileLocation(((moveFromPos[0] - 0) + (moveToPos[0] - 0))/2, ((moveFromPos[1] - 0) + (moveToPos[1] - 0))/2)];
                removedPiece.set('player', 0);
                removed = true;
            }

            var movingPlayer = from.get('player');
            to.set('player', movingPlayer);

            var upgrade = movingPlayer == 1 && moveToPos[1] == 7 || moveToPos[1] == 0;
            to.set('upgraded', !!(upgrade || from.get('upgraded')));

            from.set('player', 0);
            from.set('upgraded', false);

            var possibleMoves = removed ? this.findPossibleTakingMoves(moveToPos[0], moveToPos[1]) : [];

            this.trigger('moved', !!possibleMoves.length, moveToPos[0], moveToPos[1]);

            return removed;
        },

        getPieceCounts: function() {
            var p1 = 0;
            var p2 = 0;

            for (var i = 0, len = this.models.length; i < len; i++) {
                console.log(this.at(i).get('player'))
                if (this.at(i).get('player') == 1) {
                    p1++;
                } else if (this.at(i).get('player') == 2) {
                    p2++;
                }
            }

            return {
                player1: p1,
                player2: p2
            }
        },

        getData: function() {
            return _.map(this.models, function(model) {
                var data = {
                    player: model.get('player'),
                    x: model.get('x'),
                    y: model.get('y'),
                    upgraded: !model.get('upgraded')
                }
                if (model.get('forceNextMove') !== undefined) {
                    data.forceNextMove = model.get('forceNextMove');
                }

                return data;
            })
        },

        getModelForPosition: function(x, y) {
            return this.models[getTileLocation(x, y)];
        }
    });

    function getTileLocation(x, y) {
        return 8*(y-0)+(x-0);
    }

    return Tiles;
});