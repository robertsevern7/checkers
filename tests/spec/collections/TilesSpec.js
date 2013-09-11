define([
    'models/Tile',
    'collections/Tiles'],
function(Tile, Tiles) {
    describe("Tiles", function() {
        var tiles;

        beforeEach(function () {
            tiles = new Tiles();
            var initial = tiles.getInitialBoard();
            tiles.destroyAll();
            tiles.add(initial)
        });

        it('Test a couple of initial positions - as we assume they are there later', function() {
            expect(1).toEqual(tiles.getModelForPosition(0, 0).get('player'));
            expect(1).toEqual(tiles.getModelForPosition(0, 2).get('player'));
            expect(1).toEqual(tiles.getModelForPosition(4, 2).get('player'));
            expect(2).toEqual(tiles.getModelForPosition(3, 5).get('player'));
            expect(2).toEqual(tiles.getModelForPosition(5, 7).get('player'));
            expect(2).toEqual(tiles.getModelForPosition(7, 5).get('player'));
        });

        //PLAYER 1
        it('No moves for piece trapped at back', function() {
            expect(0).toEqual(tiles.findPossibleMoves(0, 0).length);
        });

        it('One move for guy at the front on far left', function() {
            expect(1).toEqual(tiles.findPossibleMoves(0, 2).length);
            expect('1,3').toEqual(tiles.findPossibleMoves(0, 2)[0].toString());
        });

        it('Two moves for guy at the front in middle', function() {
            expect(2).toEqual(tiles.findPossibleMoves(4, 2).length);
            expect('3,3').toEqual(tiles.findPossibleMoves(4, 2)[0].toString());
            expect('5,3').toEqual(tiles.findPossibleMoves(4, 2)[1].toString());
        });

        //PLAYER 2
        it('No moves for piece trapped at back', function() {
            expect(0).toEqual(tiles.findPossibleMoves(5, 7).length);
        });

        it('One move for guy at the front on far left, going back', function() {
            expect(1).toEqual(tiles.findPossibleMoves(7, 5).length);
            expect('6,4').toEqual(tiles.findPossibleMoves(7, 5)[0].toString());
        });

        it('Two moves for guy at the front in middle, going back', function() {
            expect(2).toEqual(tiles.findPossibleMoves(3, 5).length);
            expect('2,4').toEqual(tiles.findPossibleMoves(3, 5)[0].toString());
            expect('4,4').toEqual(tiles.findPossibleMoves(3, 5)[1].toString());
        });

        it('Moving piece has effect', function() {
            tiles.movePiece([4, 2], [5, 3]);
            expect(0).toEqual(tiles.getModelForPosition(4, 2).get('player'));
            expect(1).toEqual(tiles.getModelForPosition(5, 3).get('player'));
        });

        function movePieces() {
            expect(false).toEqual(tiles.movePiece([5, 5], [6, 4]));
            expect(false).toEqual(tiles.movePiece([6, 2], [7, 3]));
            expect(false).toEqual(tiles.movePiece([4, 2], [5, 3]));
            expect(false).toEqual(tiles.movePiece([1, 5], [0, 4]));
            expect(false).toEqual(tiles.movePiece([2, 2], [1, 3]));
        }

        it('Move pieces to allow for taking positions', function() {
            movePieces();
            expect(0).toEqual(tiles.getModelForPosition(5, 5).get('player'));
            expect(0).toEqual(tiles.getModelForPosition(6, 2).get('player'));
            expect(0).toEqual(tiles.getModelForPosition(4, 2).get('player'));
            expect(0).toEqual(tiles.getModelForPosition(1, 5).get('player'));
            expect(0).toEqual(tiles.getModelForPosition(2, 2).get('player'));

            expect(2).toEqual(tiles.getModelForPosition(6, 4).get('player'));
            expect(1).toEqual(tiles.getModelForPosition(7, 3).get('player'));
            expect(1).toEqual(tiles.getModelForPosition(5, 3).get('player'));
            expect(2).toEqual(tiles.getModelForPosition(0, 4).get('player'));
            expect(1).toEqual(tiles.getModelForPosition(1, 3).get('player'));
        });

        it('Test various jumps', function() {
            movePieces();
            expect(1).toEqual(tiles.findPossibleMoves(6, 4).length);
            expect('4,2').toEqual(tiles.findPossibleMoves(6, 4)[0].toString());

            expect(1).toEqual(tiles.findPossibleMoves(7, 3).length);
            expect('5,5').toEqual(tiles.findPossibleMoves(7, 3)[0].toString());

            expect(1).toEqual(tiles.findPossibleMoves(5, 3).length);
            expect('4,4').toEqual(tiles.findPossibleMoves(5, 3)[0].toString());

            expect(1).toEqual(tiles.findPossibleMoves(1, 3).length);
            expect('2,4').toEqual(tiles.findPossibleMoves(1, 3)[0].toString());

            expect(1).toEqual(tiles.findPossibleMoves(0, 4).length);
            expect('2,2').toEqual(tiles.findPossibleMoves(0, 4)[0].toString());
        });

        it('Test upgraded jumps -- can go back or forward', function() {
            movePieces();
            tiles.movePiece([7, 5], [1, 5]);
            tiles.getModelForPosition(5, 3).set('upgraded', true);
            expect(4).toEqual(tiles.findPossibleMoves(5, 3).length);
            expect('4,4').toEqual(tiles.findPossibleMoves(5, 3)[0].toString());
            expect('7,5').toEqual(tiles.findPossibleMoves(5, 3)[1].toString());
            expect('4,2').toEqual(tiles.findPossibleMoves(5, 3)[2].toString());
            expect('6,2').toEqual(tiles.findPossibleMoves(5, 3)[3].toString());
        });

        it('Test taking pieces', function() {
            movePieces();

            expect(2).toEqual(tiles.getModelForPosition(6, 4).get('player'));
            expect(true).toEqual(tiles.movePiece([7, 3], [5, 5]));
            expect(0).toEqual(tiles.getModelForPosition(6, 4).get('player'));

            expect(1).toEqual(tiles.getModelForPosition(5, 5).get('player'));
            expect(true).toEqual(tiles.movePiece([6, 6], [4, 4]));
            expect(0).toEqual(tiles.getModelForPosition(5, 5).get('player'));
        });

        it('Test taking moves check', function() {
            movePieces();
            tiles.movePiece([7, 5], [1, 5]);

            expect(1).toEqual(tiles.findPossibleTakingMoves(5, 3).length);
            expect('7,5').toEqual(tiles.findPossibleTakingMoves(5, 3)[0].toString());

            expect(0).toEqual(tiles.findPossibleTakingMoves(1, 3).length);
        });

        /*it('Invalid move has no effect -- actually don't care, as long as I only show valid moves we're fine', function() {
            tiles.movePiece([0, 0], [1, 1]);
            expect(1).toEqual(tiles.getModelForPosition(0, 0).get('player'));
            expect(1).toEqual(tiles.getModelForPosition(1, 1).get('player'));
        });*/
    });
});