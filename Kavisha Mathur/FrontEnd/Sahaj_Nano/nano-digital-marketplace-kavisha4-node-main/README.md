<p align="center">
<img src="http://nano.sahaj.ai/27ad2091b1714f583886.png" width="320" height="162" alt="Logo" title="NaN(O) logo">
</p>

# Digital Marketplace - a NaN(O) problemmm

## What is NaN(O)

At Sahaj, tech consultants operate at the intersection between engineering and art. Simply put, they are artisans who take on complex engineering problems in the software industry across a wide spectrum of domains. Their work is deeply rooted in first principles thinking - asking fundamental questions to dissect and understand a problem which eventually leads to one-of-a-kind solutions, each as distinct as a fingerprint.

Through NaN(O), a hackathon driven by Sahaj across multiple colleges in India, they want to instill a culture of applying first principles thinking to a problem statement.

------

## Problem statement

You are writing an application for the digital marketplace for women entrepreneurs where they can list their businesses to get a wider audience. You have been assigned to work on the backend side of the platform. Given the short time to market, the client has already hired a team who are experts in building HTTP applications. They have built the HTTP layer for you, but they are struggling to implement the functionalities of the application. That’s where you come into the picture. You need to implement the below 4 functionalities.

1. Create a Business Listing
2. Search for a specific Business Listing based on ID
3. Search Business Listings based on filters
4. Get all listed businesses.
5. Aggregate Business Listings based on given fields for grouping and function to be applied on the group for aggregation. Supported functions are as follows
   1. `COUNT`
   2. `MIN`
   3. `MAX`

Backend functionality is written such that requests will be accepted over HTTP and call methods define on store.js file. Your goal is to implement these methods as mentioned in the following expectations (Method contract). No databases/libraries can be used to store/maintain data.

(Fastest applications win)[https://knowyourmeme.com/memes/i-am-speed].

------

### Technical details
1. Your repository needs to have a `Dockerfile` that starts your HTTP web app (This is already given!)
2. Your HTTP app need to expose APIs ([API contract](#api-contract)) on port 8080 (Also all done, unless you mess around and break things)
3. No existing databases, libraries and services can be used to store the data
4. Application needs to persist data across restarts
5. No limitation on the programming language
6. Do not touch the GitHub actions code. It is used to test your code automatically and score it. Any modifications will lead to immediate disqualification.
7. Maximum time a single request can take is 5 seconds
8. Data should be persisted in `./digital-marketplace`
9. Do not touch the GreetingController. Let it be.

------ 

### Score Distribution
1. Implementation of create, search, read all and read by id of business listings - 101
2. Persisting data across application restarts - 200
3. Throughput of the application - 460
4. Implementation of aggregation functionality - 240
-------
#### FAQ
1. Do not run a development webserver with watch enabled in your app. Your tests will fail.
2. If your greeting end point test is not passing, please check the output you produce. It needs to be exactly what is requested.
3. When in doubt, please check the Github Actions logs for details
4. Logs for the performance tests will not be shared

## Data to be stored
```
{
    businessListingId: string
    businessName: string,
    ownerName: string,
    category: string,
    city: string,
    establishmentYear: int
}
```

---
## Method contract

>##### create(businessListingRequest)
Creates a new entry in store and returns all the details with businessListingId. For any Business listing, business name will be unique.

* Params
  * businessListingRequest of following type
    ```
    {
       businessName: string,
       ownerName: string,
       category: string,
       city: string,
       establishmentYear: int
    }
    ```
* Returns
  * businessListing of following type
    ```
    {
        businessListingId: string
        businessName: string,
        ownerName: string,
        category: string,
        city: string,
        establishmentYear: int
    }
    ```
  * null if business name already exists  
---

>##### read(id)
Returns the specified business listing.

* Params
  * id of type string
* Returns
  * businessListing of following type if found
    ```
    {
        businessListingId: string
        businessName: string,
        ownerName: string,
        category: string,
        city: string,
        establishmentYear: int
    }
    ```
   * null if listing with given id not found 

---

##### search(searchRequest)
Search business listings with different criteria.

* Params:
  * searchCriteria – SearchCriteria object with following details
    * condition - Value will be either `AND`/`OR`
    * fields - collection of filter criterion
      * fieldName - Value will be one of `ownerName`/`category`/`city` etc
      * eq - optional value hold to check for equality the value stored in the requested `fieldName`
      * neq - ptional value hold to check for non equality the value stored in the requested `fieldName`
      * Either of `eq` or `neq` needs to be supplied - never both.
    * Example:
      ```json
      {
        condition: OR/AND,
        fields: [
            {
                fieldName: string,
                eq: string/number
            },
            {
                fieldName: string,
                neq: string/number
            }
        ]
      }
      ```
* Returns:
  * Collection of BusinessListing matching for given search criteria which is of following type
    ```
    [{
        businessListingId: string
        businessName: string,
        ownerName: string,
        category: string,
        city: string,
        establishmentYear: int
    }.......]
    ```
  * Empty collection if nothing matches


##### readAll()
Return the list of all business listings.

* Params - None
* Returns
  * Collection of businessListing of following type
    ```
    [{
        businessListingId: string
        businessName: string,
        ownerName: string,
        category: string,
        city: string,
        establishmentYear: int
    }.......]
    ```

##### aggregate(aggregateCriteria)
Returns collection of aggregated object for given aggregate criteria.

* Params:
  * aggregateCriteria – AggregateCriteria object with following details
      * groupByFields - List of field names to group by
      * aggregationRequests - collection of aggregation request
          * fieldName - Value will be one of `ownerName`/`category`/`city` etc
          * function - Value will be one of `COUNT`/`MIN`/`MAX`
          * alias - Value will be string and it to be used as key for aggregated value in return object
      * Example:
        ```json
        {
          "groupByFields": ["city","category"],
          "aggregationRequests": [
              {
                  "fieldName": "establishmentYear",
                  "function": "MAX",
                  "alias": "lastEstablishmentYear"
              },
              {
                  "fieldName": "establishmentYear",
                  "function": "MIN",
                  "alias": "firstEstablishmentYear"
              },
              {
                  "fieldName": "businessName",
                  "function": "COUNT",
                  "alias": "totalListedBusinesses"
              }
          ]
        }
        ```
* Returns:
  * Collection of following type
    ```
    [
      {
          "city": "Mumbai",
          "category": "Home Decor",
          "lastEstablishmentYear": 2023,
          "firstEstablishmentYear": 2010,
          "totalListedBusinesses": 4
      },
      {
          "city": "Mumbai",
          "category": "Home backer",
          "lastEstablishmentYear": 2023,
          "firstEstablishmentYear": 2010,
          "totalListedBusinesses": 2
      }
    ]
    ```
  * Empty collection if nothing matches
----
[API Sample Request Response](api-sample.md)(This is already implemented and should work as expected with above specified method contract)
---
## Competition rules

Check <a href="http://nano.sahaj.ai/rules.html" target="_blank">rules and scoring</a> pages for details. When in doubt, ask the organizers and we will add clarifications to the page.


## Sample Instructions for coding/committing
* git clone `git repository url` (Skip this step if using github codespaces)
* cd `repository name` (Skip this step if using github codespaces)
* Check for health check [server.js](server.js)
* Goto [store.js](store.js)
* Begin coding
* To test your code locally run following command
  * npm install
  * npm test
* Code needs to be tested via github? Execute following commands in the terminal location of your repository
  * git add .
  * git commit -m 'any message regarding your changes'
  * git push
* Wait for build to complete in github actions logs.
* If build is green, you should see the score on the leader board, else check with actions logs.

## Sample Instructions for Codespaces installation
* On your browser after accepting the github invitation,
  * Celect "Code" dropdown
  * Select the "Codespaces" tab.
  * Select "Create codespace on main"
* Continue from step 3 of Sample Instructions for coding/commit
