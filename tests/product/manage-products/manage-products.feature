# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Manage products
    As a seller
    I want to create products
    So that I can sell them on the marketplace.

    Scenario: Creating an product
        Given I set the product name
        And I set the product description
        When I send a request to create an product
        Then I receive my product ID
        And I can verify that the created product is exactly as configured
