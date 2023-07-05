# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Create New Product
    As a marketplace seller
    I want to be able to create a new product
    So that it can be listed and sold in the marketplace

    Scenario: Creating a product
        Given I am logged in as a seller
        When I enter the following product details:
            | name       | description                    |
            | Smartphone | High-performance mobile device |
        And I submit the product
        Then the product should be created
        And the product should have the defined name
        And the product should have the defined description
        And the created product should be marked as draft
