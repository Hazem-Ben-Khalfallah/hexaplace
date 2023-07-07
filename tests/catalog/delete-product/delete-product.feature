Feature: delete products
  As a marketplace owner
  I want to be able to delete or archive a product
  So that I control want is sold on the marketplace

  Background:
    Given I am logged in as a marketplace owner
    And the following products exist:
      | id                                   | name     | status   |
      | b61d9370-7e4d-49fb-abc3-f1cef7307f87 | product1 | approved |
      | a6e211ae-cdde-4868-9a61-b683075c26d2 | product2 | rejected |
      | 59a5894c-08e2-44e0-9a2c-89180b59c06b | product3 | draft    |

  Scenario: Deleting a product if it is draft
    When I delete a product with id "59a5894c-08e2-44e0-9a2c-89180b59c06b"
    Then the product with id "59a5894c-08e2-44e0-9a2c-89180b59c06b" should not be available anymore

  Scenario: Archiving a product if it was already approved
    When I delete a product with id "b61d9370-7e4d-49fb-abc3-f1cef7307f87"
    Then I can still find the product with id "b61d9370-7e4d-49fb-abc3-f1cef7307f87"
    But the product should be marked as archived