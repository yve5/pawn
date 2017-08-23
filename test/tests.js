QUnit.test( "The firstname is John", function(assert) {
    assert.ok(avm.firstName() == "John");
});

QUnit.test( "The firstname is Bertington", function(assert) {
    assert.ok(avm.lastName() == "Bertington");
});

QUnit.test( "The fullname is John Bertington", function(assert) {
    assert.ok(avm.fullName() == "John Bertington");
});