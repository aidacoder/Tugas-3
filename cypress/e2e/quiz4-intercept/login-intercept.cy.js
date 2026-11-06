


describe('QUIZ 4 - LOGIN INTERCEPT ORANGEHRM', () => {

    const loginUrl =
        'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    beforeEach(() => {
        cy.visit(loginUrl);

        cy.get('input[placeholder="Username"]', {
            timeout: 20000
        }).should('be.visible');
    });

    // LOG-001: Valid Login
    it('LOG-001 - Valid Login', () => {

        cy.intercept('GET', '**/dashboard/index').as('dashboard');

        cy.get('input[placeholder="Username"]').type('Admin');
        cy.get('input[placeholder="Password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.wait('@dashboard').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
        });

        cy.url().should('include', '/dashboard');
    });

    // LOG-002: Invalid Password
    it('LOG-002 - Invalid Password', () => {

        cy.intercept('POST', '**/auth/validate').as('wrongPassword');

        cy.get('input[placeholder="Username"]').type('Admin');
        cy.get('input[placeholder="Password"]').type('salah123');
        cy.get('button[type="submit"]').click();

        cy.wait('@wrongPassword').then((interception) => {
            expect(interception.request.method).to.equal('POST');
            expect(interception.response.statusCode).to.equal(302);
        });

        cy.contains('Invalid credentials').should('be.visible');
    });

    // LOG-003: Invalid Username
    it('LOG-003 - Invalid Username', () => {

        cy.intercept({
            method: 'POST',
            pathname: '/web/index.php/auth/validate'
        }).as('wrongUser');

        cy.get('input[placeholder="Username"]').type('UserSalah');
        cy.get('input[placeholder="Password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.wait('@wrongUser').then((interception) => {
            expect(interception.request.method).to.equal('POST');
            expect(interception.response.statusCode).to.equal(302);
            expect(interception.request.url).to.include('auth/validate');
        });

        cy.contains('Invalid credentials').should('be.visible');
    });

    // LOG-004: Invalid Username and Password
    it('LOG-004 - Invalid Username and Password', () => {

        cy.intercept('POST', '**/auth/validate', (req) => {
            req.alias = 'bothWrong';
        });

        cy.get('input[placeholder="Username"]').type('WrongUser');
        cy.get('input[placeholder="Password"]').type('WrongPass123');
        cy.get('button[type="submit"]').click();

        cy.wait('@bothWrong').then((interception) => {
            expect(interception.request.method).to.equal('POST');
            expect(interception.response.statusCode).to.equal(302);
            expect(interception.response).to.exist;
        });

        cy.contains('Invalid credentials').should('be.visible');
    });

    // LOG-005: Empty Username
    it('LOG-005 - Empty Username', () => {

        cy.intercept('POST', '**/auth/validate').as('emptyUsername');

        cy.get('input[placeholder="Password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-input-field-error-message')
            .should('contain', 'Required');

        cy.get('@emptyUsername.all').should('have.length', 0);
    });

    // LOG-006: Empty Password
    it('LOG-006 - Empty Password', () => {

        cy.intercept('POST', '**/auth/validate').as('emptyPassword');

        cy.get('input[placeholder="Username"]').type('Admin');
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-input-field-error-message')
            .should('contain', 'Required');

        cy.get('@emptyPassword.all').should('have.length', 0);
    });

    // LOG-007: Empty Username and Password
    it('LOG-007 - Empty Username and Password', () => {

        cy.intercept('POST', '**/auth/validate').as('emptyBoth');

        cy.get('button[type="submit"]').click();

        cy.get('.oxd-input-field-error-message')
            .should('have.length', 2);

        cy.get('@emptyBoth.all').should('have.length', 0);
    });

    // LOG-008: Lowercase Username
    it('LOG-008 - Lowercase Username', () => {

        cy.intercept('POST', '**/auth/validate').as('lowercaseUser');

        cy.get('input[placeholder="Username"]').type('admin');
        cy.get('input[placeholder="Password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.wait('@lowercaseUser').then((interception) => {
            expect(interception.request.method).to.equal('POST');
            expect(interception.response.statusCode).to.equal(302);
        });

        cy.url().should('include', '/dashboard');
    });

});
