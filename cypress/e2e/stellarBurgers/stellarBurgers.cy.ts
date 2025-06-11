describe('проверяем доступность приложения', function() {
  it('сервис должен быть доступен', function() {
    cy.visit('/'); 
  });
});

describe('Burger Ingredient', () => {
  beforeEach(function() {
    // Загружаем фикстуры
    cy.fixture('ingredients').as('ingredients');
    cy.fixture('user').as('user');
    cy.fixture('order').as('order');
    
    // Перехватываем запросы
    cy.get('@ingredients').then((ingredients) => {
      cy.intercept('GET', '/api/ingredients', {
        statusCode: 200,
        body: ingredients
      }).as('getIngredients');
    });
    cy.get('@user').then((user) => {
      cy.intercept('POST', 'api/auth/login', {
        statusCode: 201,
        body: user
      }).as('getUser');
    });
    cy.get('@order').then((order) => {
      cy.intercept('POST', 'api/orders', {
        statusCode: 201,
        body: order
      }).as('orderBurger');
    });

    // открываем страницу
    cy.visit('/');
    cy.wait('@getIngredients');
    
    /// Очищаем куки
    Cypress.Cookies.debug(true);
    cy.clearCookies();
    
    // Авторизуемся
    cy.visit('login');
    cy.get('@user').then((user) => {
      cy.get('input[name="email"]').type(user.user.email);
      cy.get('input[name="password"]').type(user.user.password);
    });
    cy.get('button[type="submit"]').click();
    cy.wait('@getUser');
    });

  it('Добавление ингредиентов в список конструктора', function() {
    // Добавляем первую булку
    const bun = this.ingredients.data[0];
    const main = this.ingredients.data[1];
    const sauce = this.ingredients.data[2];
    cy.get(`[data-cy="ingredient-${bun._id}"] button`).click();
    cy.get('.constructor-element_pos_top').find('span').contains(`${bun.name} (верх)`);
    cy.get('.constructor-element_pos_bottom').find('span').contains(`${bun.name} (низ)`);

    // Добавляем начинку
    cy.get(`[data-cy="ingredient-${main._id}"] button`).click();
    cy.get('.constructor-element .constructor-element__row').find('span').contains(main.name);

    // Добавляем соус
    cy.get(`[data-cy="ingredient-${sauce._id}"] button`).click();
    cy.get('.constructor-element .constructor-element__row').find('span').contains(sauce.name);
  });
  
  it('Проверка модального окна ингредиента', function() {
    cy.get('[id="modals"]').should('be.empty');
    // Открываем модальное окно ингредиента
    const bun = this.ingredients.data[0];
    cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
    cy.get('[id="modals"]').should('not.be.empty');
    // Кликаем на кнопку закрытия
    cy.get('[id="modals"]').find('button').click();
    cy.get('[id="modals"]').should('be.empty');
    // Кликаем на оверлэй
    cy.get(`[data-cy="ingredient-${bun._id}"]`).click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[id="modals"]').should('be.empty');
  });

  it('Авторизация пользователя', () => {
    // проверяем наличие токенов в cookies и localStorage
    cy.getCookie('accessToken').should('have.property', 'value', 'accessToken');
    cy.window().then((win) => {
      const refreshToken = win.localStorage.getItem('refreshToken');
      expect(refreshToken).to.eq('refreshToken');
    });
  });

  it('Заказ бургера', function() {
    const bun = this.ingredients.data[0];
    cy.get('[id="modals"]').should('be.empty');
    cy.get(`[data-cy="ingredient-${bun._id}"] button`).click();
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@orderBurger');
    // проверяем что модальное окно открыто и отобрапжается номер заказа
    cy.get('[id="modals"]').should('not.be.empty');
    cy.get('[data-cy="modal-order-number"]').should('have.text', this.order.order.number);
    cy.get('[id="modals"]').find('button').click();
    // проверяем что модальное окно закрыто
    cy.get('[id="modals"]').should('be.empty');
    // проверяем что конструктор пуст
    cy.get('[data-cy="order-price"]').should('have.text', '0');
  });
});
