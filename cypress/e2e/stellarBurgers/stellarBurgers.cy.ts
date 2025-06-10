describe('проверяем доступность приложения', function() {
  it('сервис должен быть доступен по адресу localhost:4000', function() {
    cy.visit('http://localhost:4000'); 
  });
});

describe('Burger Ingredient', () => {
  beforeEach(() => {
    // Загружаем фикстуру из файла fixtures/ingredients.json
    cy.fixture('ingredients').then((ingredients) => {
      // Перехватываем GET запрос
      cy.intercept('GET', '/api/ingredients', {
        statusCode: 200,
        body: ingredients
      }).as('getIngredients');
    });
    cy.visit('http://localhost:4000'); // открываем страницу
    cy.wait('@getIngredients'); // ждем запрос
    /// Очищаем куки
    Cypress.Cookies.debug(true);
    cy.clearCookies();
    // Загружаем фикстуру из файла fixtures/user.json
    cy.fixture('user').then((user) => {
      // Перехватываем POST запрос
      cy.intercept('POST', 'api/auth/login', {
        statusCode: 201,
        body: user
      }).as('getUser');
    });
    cy.fixture('order').then((order) => {
      // Перехватываем POST запрос
      cy.intercept('POST', 'api/orders', {
        statusCode: 201,
        body: order
      }).as('orderBurger');
    });
    cy.visit('http://localhost:4000/login'); // открываем страницу
    cy.get('input[name="email"]').type('email@email.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.wait('@getUser'); // ждем запрос
  });


  it('Добавление ингредиентов в список конструктора', () => {
    // Добавляем первую булку
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"] button').click();
    cy.get('.constructor-element_pos_top').find('span').contains('Краторная булка N-200i (верх)');
    cy.get('.constructor-element_pos_bottom').find('span').contains('Краторная булка N-200i (низ)');

    // Добавляем начинку
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"] button').click();
    cy.get('.constructor-element .constructor-element__row').find('span').contains('Биокотлета из марсианской Магнолии');

    // Добавляем соус
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"] button').click();
    cy.get('.constructor-element .constructor-element__row').find('span').contains('Соус Spicy-X');
  });
  
  it('Проверка модального окна ингредиента', () => {
    cy.get('[id="modals"]').should('be.empty');
    // Открываем модальное окно ингредиента
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[id="modals"]').should('not.be.empty');
    // Кликаем на кнопку закрытия
    cy.get('[id="modals"]').find('button').click();
    cy.get('[id="modals"]').should('be.empty');
    // Кликаем на оверлэй
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]').click();
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

  it('Заказ бургера', () => {
    cy.get('[id="modals"]').should('be.empty');
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"] button').click();
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@orderBurger');
    // проверяем что модальное окно открыто и отобрапжается номер заказа
    cy.get('[id="modals"]').should('not.be.empty');
    cy.get('[data-cy="modal-order-number"]').should('have.text', '80690');
    cy.get('[id="modals"]').find('button').click();
    // проверяем что модальное окно закрыто
    cy.get('[id="modals"]').should('be.empty');
    // проверяем что конструктор пуст
    cy.get('[data-cy="order-price"]').should('have.text', '0');
  });
});
