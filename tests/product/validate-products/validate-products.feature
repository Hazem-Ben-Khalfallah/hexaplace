Feature: Validating a product
  As a marketplace owner
  I want to review and validate newly created products
  So that I can ensure the quality and integrity of what is sold in my marketplace

  Background:
    Given the following products exist:
      | id         | name      | status           |
      | uE93daidQf | product1  | approved |
      | hxrK4YsVDd | product2  | approved |
      | KPuD21MmCx | product3  | draft    |
      | nBRhCg8Vme | product4  | draft    |
      | HXRhCg8Vme | product4  | draft    |
      | pxpK4YsVDd | product5a | rejected |
      | HXr80nxaU6 | Product5b | draft    |
      | HxrhbLNbEM | Product5C | rejected |
      | hXRXMVn1Tl | product5d | deleted  |

  Scenario: Approving a product
    When I approve a product with id "KPuD21MmCx"
    Then the product with id "KPuD21MmCx" should be marked as approved
    And the seller gets notified

  Scenario: Rejecting a product
    When I reject a product with id "KPuD21MmCx" for the reason "rejection reason"
    Then the product with id "KPuD21MmCx" should be marked as rejected
    And the seller gets notified