Feature: Manage assets

  Background:
    Given the following assets exist:
      | id         | name    | categoryId                           | status           | ownerType | ownerId                       |
      | uE93daidQf | asset1  | 3d8a6c65-c02a-4cf5-a390-8c61339c70e7 | product_approved | OPERATOR  |                               |
      | hxrK4YsVDd | asset2  | 3d8a6c65-c02a-4cf5-a390-8c61339c70e7 | product_approved | OPERATOR  |                               |
      | KPuD21MmCx | asset3  | 3d8a6c65-c02a-4cf5-a390-8c61339c70e7 | product_draft    | OPERATOR  |                               |
      | nBRhCg8Vme | asset4  | d28aa1d1-9b8d-4b2a-b055-769dbf8c8f86 | product_draft    | SELLER    | 18d7ff97-8d15-4c91-88b5-8a1bd |
      | HXRhCg8Vme | asset4  | d28aa1d1-9b8d-4b2a-b055-769dbf8c8f86 | product_draft    | OPERATOR  |                               |
      | pxpK4YsVDd | asset5a | d28aa1d1-9b8d-4b2a-b055-769dbf8c8f86 | product_rejected | OPERATOR  |                               |
      | HXr80nxaU6 | Asset5b | d28aa1d1-9b8d-4b2a-b055-769dbf8c8f86 | product_draft    | OPERATOR  |                               |
      | HxrhbLNbEM | Asset5C | d28aa1d1-9b8d-4b2a-b055-769dbf8c8f86 | product_rejected | OPERATOR  |                               |
      | hXRXMVn1Tl | asset5d | d28aa1d1-9b8d-4b2a-b055-769dbf8c8f86 | product_deleted  | OPERATOR  |                               |

  Scenario: I approve one asset
    When I approve asset with id "KPuD21MmCx"
    Then I can check that the asset with id "KPuD21MmCx" is approved
    And The seller get notified

  Scenario: I reject one asset
    When I reject asset with id "KPuD21MmCx" for the reason "rejection reason"
    Then I can check that the asset with id "KPuD21MmCx" is rejected
    And The seller get notified