Feature: delete products
  As a marketplace owner
  I want to be able to delete or archive a product
  So that I control want is sold on the marketplace

  Background:
    Given I am logged in as a marketplace owner
    And the following products exist:
      | id         | name     | status   |
      | uE93daidQf | product1 | approved |
      | hxrK4YsVDd | product2 | rejected |
      | KPuD21MmCx | product3 | draft    |

  Scenario: Deleting a product if it is draft
    When I delete a product with id "KPuD21MmCx"
    Then the product with id "KPuD21MmCx" should not be available anymore

  Scenario: Archiving a product it was already approved
    When I delete a product with id "uE93daidQf"
    Then I can still find the product with id "uE93daidQf"
    But the product should be marked as archived