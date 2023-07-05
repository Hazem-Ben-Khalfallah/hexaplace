# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Manage Orders and Order Items
  As a marketplace owner
  I want to manage the lifecycle of orders and order items
  So that I can ensure smooth order processing and fulfillment

  Scenario: Placing an order
    Given a customer with the name "John Doe" and an email address "john.doe@mail.com"
    And a product with the name "Awesome Product" and a price of $"99.99"
    When the customer places an order for "2" units of the product
    Then an order should be created
    And order items for the product should be created
    And the order status should be set as "PendingShipment"
    And an email is sent to the customer

  Scenario: Fulfilling an order
    Given an order with the status "WaitingForShipment"
    When the order is shipped to the customer
    Then the order status should be set as "Shipped"
    And an email is sent to the customer