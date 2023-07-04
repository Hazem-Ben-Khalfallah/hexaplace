# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Manage assets
    As a seller
    I want to create assets
    So that I can sell them on the marketplace.

    Scenario: Creating an asset
        Given I set the asset name
        And I set the asset description
        When I send a request to create an asset
        Then I receive my asset ID
        And I can verify that the created asset is exactly as configured
