QUnit.test('resize container', function(assert) {
    pvm.resizeContainerByTesting(500, 800);
    assert.ok(pvm.containerHeight() === 500);
    assert.ok(pvm.containerWidth() === 800);

    pvm.resizeContainerByTesting(437, 972);
    assert.ok(pvm.containerHeight() === 500);
    assert.ok(pvm.containerWidth() === 800);

    pvm.resizeContainerByTesting(721, 452);
    assert.ok(pvm.containerHeight() === 721);
    assert.ok(pvm.containerWidth() === 452);
});


QUnit.test('handle keyup', function(assert) {
    pvm.handleKeyup();

    assert.ok(pvm.moveTop() === false);
    assert.ok(pvm.moveRight() === false);
    assert.ok(pvm.moveBottom() === false);
    assert.ok(pvm.moveRight() === false);
});


QUnit.test('handle keydown', function(assert) {
    pvm.lockedMove(true);
    pvm.spaceKey(true);
    pvm.handleKeydownForTesting(32);
    assert.ok(pvm.spaceKey() === true);

    pvm.lockedMove(false);
    pvm.spaceKey(true);
    pvm.handleKeydownForTesting(32);
    assert.ok(pvm.spaceKey() === false);

    pvm.lockedMove(false);
    pvm.handleKeydownForTesting(37);
    assert.ok(pvm.lockedMove() === 'left' && pvm.moveLeft() === true);

    pvm.lockedMove(false);
    pvm.handleKeydownForTesting(38);
    assert.ok(pvm.lockedMove() === 'top' && pvm.moveLeft() === true);

    pvm.lockedMove(false);
    pvm.handleKeydownForTesting(39);
    assert.ok(pvm.lockedMove() === 'right' && pvm.moveLeft() === true);

    pvm.lockedMove(false);
    pvm.handleKeydownForTesting(40);
    assert.ok(pvm.lockedMove() === 'bottom' && pvm.moveLeft() === true);
});


QUnit.test('handle start', function(assert) {
    pvm.handleStartForTesting(32, 47);
    assert.ok(pvm.lastY() === 32 && pvm.lastX() === 47);
});


QUnit.test('handle end', function(assert) {
    pvm.handleEnd();

    assert.ok(pvm.moveTop() === false);
    assert.ok(pvm.moveRight() === false);
    assert.ok(pvm.moveBottom() === false);
    assert.ok(pvm.moveRight() === false);
    assert.ok(pvm.taped() === 0);
});