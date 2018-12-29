Feature: Performing a Login
	As a user I want to login

	Background:
		Given I am on the login page

	Scenario: Performing a Login
		When I enter "demo" into the username input
		When I enter "demo" into the password input
		And  Retrieve the token
		Then I should see the dashboard page