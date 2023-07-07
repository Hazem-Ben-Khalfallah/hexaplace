# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Manage Orders and Order Items
  As a marketplace owner
  I want to manage the lifecycle of orders and order items
  So that I can ensure smooth order processing and fulfillment

  Scenario: Placing an order
    Given a customer with the name "John Doe" and an email address "john.doe@mail.com"
    And the following products exist:
      | id                                   | name               | price |
      | b61d9370-7e4d-49fb-abc3-f1cef7307f87 | Awesome Product    | 99.99 |
      | a6e211ae-cdde-4868-9a61-b683075c26d2 | Impressive Product | 10.99 |
    And the customer has added "2" units of the product "b61d9370-7e4d-49fb-abc3-f1cef7307f87" in an order
    And the customer has added "1" units of the product "a6e211ae-cdde-4868-9a61-b683075c26d2" in an order
    When the customer places the order
    Then the order total price should equal to $"110.98"
    Then the order status should be set as "placed"
    And order items for the products should be created
    And an email is sent to the customer
