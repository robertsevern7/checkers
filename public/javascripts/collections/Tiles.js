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

        findPossibleMoves: function(x, y, goingBack) {
            var activePlayer = this.models[getTileLocation(x , y)].get('player');
            var possible = [];

            var nextY = goingBack ? (y - 1) : (y + 1);
            var yPossible = goingBack ? (y > 0) : (y < 7);

            if (yPossible) {
                if (x > 0) {
                    var player = this.models[getTileLocation(x - 1, nextY)].get('player')
                    if (!player) {
                        possible.push([x - 1, nextY])
                    } else if (player !== activePlayer) {
                        var move = this._nextJumpPossible(x - 1, nextY, goingBack, false);
                        move && possible.push(move)
                    }
                }

                if (x < 7) {
                    var player = this.models[getTileLocation(x + 1, nextY)].get('player')
                    if (!player) {
                        possible.push([x + 1, nextY]);
                    } else if (player !== activePlayer) {
                        var move = this._nextJumpPossible(x + 1, nextY, goingBack, true);
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

        movePiece: function(moveFromPos, moveToPos) {
            var from = this.models[getTileLocation(moveFromPos[0], moveFromPos[1])];
            var to = this.models[getTileLocation(moveToPos[0], moveToPos[1])];
            var removed = false;

            if (Math.abs(moveToPos[0] - moveFromPos[0]) === 2 && Math.abs(moveToPos[1] - moveFromPos[1]) === 2) {
                var removedPiece = this.models[getTileLocation(((moveFromPos[0] - 0) + (moveToPos[0] - 0))/2, ((moveFromPos[1] - 0) + (moveToPos[1] - 0))/2)];
                removedPiece.set('player', 0);
                removed = true;
            }

            to.set('player', from.get('player'));
            from.set('player', 0);


            this.trigger('moved');

            return removed;
        },

        getData: function() {
            return _.map(this.models, function(model) {
                return {
                    player: model.get('player'),
                    x: model.get('x'),
                    y: model.get('y')
                }
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