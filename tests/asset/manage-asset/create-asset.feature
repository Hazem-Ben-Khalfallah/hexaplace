# This is a Gherkin feature file https://cucumber.io/docs/gherkin/reference/

Feature: Create an asset

Scenario: I create an asset
    Given I set the asset name
    And I set the asset description
    When I send a request to create an asset
    Then I receive my asset ID
    And I can verify that the created asset is exactly as configured
