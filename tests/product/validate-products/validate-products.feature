Feature: Validating a product
  As a marketplace owner
  I want to review and validate newly created products
  So that I can ensure the quality and integrity of what is sold in my marketplace

  Background:
    Given the following products exist:
      | id         | name      | status           |
      | uE93daidQf | product1  | product_approved |
      | hxrK4YsVDd | product2  | product_approved |
      | KPuD21MmCx | product3  | product_draft    |
      | nBRhCg8Vme | product4  | product_draft    |
      | HXRhCg8Vme | product4  | product_draft    |
      | pxpK4YsVDd | product5a | product_rejected |
      | HXr80nxaU6 | Product5b | product_draft    |
      | HxrhbLNbEM | Product5C | product_rejected |
      | hXRXMVn1Tl | product5d | product_deleted  |

  Scenario: Approving an product
    When I approve an product with id "KPuD21MmCx"
    Then the product with id "KPuD21MmCx" should be marked as approved
    And the seller gets notified

  Scenario: Rejecting an product
    When I reject an product with id "KPuD21MmCx" for the reason "rejection reason"
    Then the product with id "KPuD21MmCx" should be marked as rejected
    And the seller gets notified