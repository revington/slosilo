describe('register account process', function () {
    describe('user validation', function () {
        it("should fail if 'user.email is in use");
        it("should fail if 'user.name is empty");
        it("should fail if 'user.surname is empty");
        it("should fail if 'user.password is empty");
    });
    describe('new user', function () {
        describe('.uid', function () {
            it('should have a uid');
        });
        describe('.password', function () {
            it('should have a hashed password');
            it('should be tested with plaintext password');
        });
        describe('.created_at', function () {
            it('should have a created_at field');
            it('should be valid unix datetime');
        });
    });
});
