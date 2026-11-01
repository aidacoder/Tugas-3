


describe('Automation Testing - Login OrangeHRM', () => {

    beforeEach(() => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    });

    // LOG-001: Login dengan username dan password valid
    it('LOG-001 - Login menggunakan data valid', () => {

        cy.get('input[placeholder="Username"]').type('Admin');
        cy.get('input[placeholder="Password"]').type('admin123');

        cy.contains('button', 'Login').click();

        cy.url().should('include', '/dashboard');
    });

    // LOG-002: Login dengan password salah
    it('LOG-002 - Login menggunakan password salah', () => {

        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('salah123');
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-alert-content-text')
            .should('contain', 'Invalid credentials');
    });

    // LOG-003: Login dengan username salah
    it('LOG-003 - Login menggunakan username salah', () => {

        cy.get('input[name="username"]').type('SalahUser');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-alert-content-text')
            .should('contain', 'Invalid credentials');
    });

    // LOG-004: Login tanpa username
    it('LOG-004 - Login tanpa mengisi username', () => {

        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-input-field-error-message')
            .should('contain', 'Required');
    });

    // LOG-005: Login tanpa password
    it('LOG-005 - Login tanpa mengisi password', () => {

        cy.get('input[name="username"]').type('Admin');
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-input-field-error-message')
            .should('contain', 'Required');
    });

    // LOG-006: Login tanpa mengisi kedua kolom
    it('LOG-006 - Login tanpa username dan password', () => {

        cy.get('button[type="submit"]').click();

        cy.get('.oxd-input-field-error-message')
            .should('have.length', 2);
    });

    // LOG-007: Memeriksa tipe input password
    it('LOG-007 - Memeriksa tipe input password', () => {

        cy.get('input[name="password"]')
            .should('have.attr', 'type', 'password');
    });

    // LOG-008: Memeriksa kolom username terlihat
    it('LOG-008 - Memeriksa kolom username terlihat', () => {

        cy.get('input[name="username"]')
            .should('be.visible');
    });

    // LOG-009: Login menggunakan password karakter khusus
    it('LOG-009 - Login menggunakan password karakter khusus', () => {

        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('Admin@123!');
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-alert-content-text')
            .should('contain', 'Invalid credentials');
    });

    // LOG-010: Memeriksa kolom password terlihat
    it('LOG-010 - Memeriksa kolom password terlihat', () => {

        cy.get('input[name="password"]')
            .should('be.visible');
    });

    // LOG-011: Memeriksa fitur Forgot Password
    it('LOG-011 - Membuka halaman Forgot Password', () => {

        cy.get('.orangehrm-login-forgot-header').click();

        cy.get('h6')
            .should('contain', 'Reset Password');
    });

    // LOG-012: Login menggunakan tombol Enter
    it('LOG-012 - Login menggunakan tombol Enter', () => {

        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin123{enter}');

        cy.get('h6').should('contain', 'Dashboard');
    });

});

