Feature: Validating a product
  As a marketplace owner
  I want to review and validate newly created products
  So that I can ensure the quality and integrity of what is sold in my marketplace

  Background:
    Given the following products exist:
      | id                                   | name      | status   |
      | b61d9370-7e4d-49fb-abc3-f1cef7307f87 | product1  | approved |
      | a6e211ae-cdde-4868-9a61-b683075c26d2 | product2  | approved |
      | 59a5894c-08e2-44e0-9a2c-89180b59c06b | product3  | draft    |
      | 33b1a923-3595-40f9-8569-49bee3489c50 | product4  | draft    |
      | 90e951c7-b9c8-4281-a490-03a8bd8ff7b1 | product4  | draft    |
      | ed4d6297-4191-413f-9180-198b98764151 | product5a | rejected |
      | 3b7afd65-7d1a-4f49-a975-8fa7dd984d73 | Product5b | draft    |
      | c3511c8a-9c38-4f6f-98b7-782e6b4a3d47 | Product5C | rejected |
      | 26bb257d-53c5-4e40-8c93-32f6a725a05d | product5d | deleted  |

  Scenario: Approving a product
    When I approve a product with id "59a5894c-08e2-44e0-9a2c-89180b59c06b"
    Then the product with id "59a5894c-08e2-44e0-9a2c-89180b59c06b" should be marked as approved
    And the seller gets notified

  Scenario: Rejecting a product
    When I reject a product with id "59a5894c-08e2-44e0-9a2c-89180b59c06b" for the reason "rejection reason"
    Then the product with id "59a5894c-08e2-44e0-9a2c-89180b59c06b" should be marked as rejected
    And the seller gets notified