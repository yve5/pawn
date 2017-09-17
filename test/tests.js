QUnit.test('handleKeyup', function(assert) {
    pvm.handleKeyup();

    assert.ok(pvm.moveTop() === false);
    assert.ok(pvm.moveRight() === false);
    assert.ok(pvm.moveBottom() === false);
    assert.ok(pvm.moveRight() === false);
});

QUnit.test('handleKeydown', function(assert) {
    pvm.handleKeydown();
});

QUnit.test('handleEnd', function(assert) {
    pvm.handleEnd();

    assert.ok(pvm.moveTop() === false);
    assert.ok(pvm.moveRight() === false);
    assert.ok(pvm.moveBottom() === false);
    assert.ok(pvm.moveRight() === false);
    assert.ok(pvm.taped() === 0);
});