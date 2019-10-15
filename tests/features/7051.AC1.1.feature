Feature: Retrieve (v7) - Update the endpoint to retrieve the technical records
    Scenario: AC1.1 API Consumer retrieve the Vehicle Technical Records for - query parameter "status" not provided & vehicle has both "current" and "provisional" technical records
     Given I am an API Consumer
      When I send a request to AWS_CVS_DOMAIN/vehicles/{searchIdentifier}/tech-records
      And for the identified vehicle in the database there is a Technical Record with the "statusCode" = "current"
      And for the identified vehicle in the database there is a Technical Record with the "statusCode" = "provisional"
      Then for the query parameter "status", the default value "provisional_over_current" will be taken into account
      And the system returns a body message containing a single CompleteTechRecord
      And the statusCode of the Technical Records "provisional"
      And the system returns an HTTP status code 200 OK
     

 