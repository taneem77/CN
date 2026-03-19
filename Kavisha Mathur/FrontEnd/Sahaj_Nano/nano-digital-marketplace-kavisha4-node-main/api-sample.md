## Data to be stored
```
{
    businessName: string,
    ownerName: string,
    category: string,
    city: string
}
```
---
## API
***

>##### GET /greeting
###### Response
* Code: 200
* Content: `Hello world!`
---

>##### POST /business-listing
###### Request & Response headers
Content-Type: application/json
###### Body
```
{
    "businessName": "microBiz",
    "ownerName": "Divy Sharma",
    "category": "Home Decor",
    "city": "Pune"
}
```
###### Success Response
* Status code: 201
* Content:
```
{
    "businessListingId": "1",
    "businessName": "microBiz",
    "ownerName": "Divy Sharma",
    "category": "Home Decor",
    "city": "Pune"
}
```
###### Error Response
* Status code: 400 if business name already exists
---

>##### GET /business-listing/1
###### URL Params
###### Success Response
* Status code: 200
* Content:
```
{
    "businessListingId": "1",
    "businessName": "microBiz",
    "ownerName": "Divy Sharma",
    "category": "Home Decor",
    "city": "Pune"
}
```
>##### GET /business-listing/3
###### Error Response
* Status code: 404
* Content:
```
{ message : "Business listing with id 3 was not found" }
```
---

>##### GET /business-listing/all
###### URL Params
###### Success Response
* Status code: 200
* Content:
```
[
    {
        "businessListingId": "1",
        "businessName": "microBiz",
        "ownerName": "Divy Sharma",
        "category": "Home Decor",
        "city": "Pune"
    },
    {
        "businessListingId": "2",
        "businessName": "Sweet Chariots",
        "ownerName": "Nidhi Patel",
        "category": "Home backer",
        "city": "Mumbai"
    }
]
```
---

>##### POST /business-listing/search
###### Request payload
```
{
    "fields": [
        {
            "fieldName": "category",
            "eq": "Home backer"
        },
        {
            "fieldName": "city",
            "neq": "Mumbai"
        }
    ],
  "condition": "OR"
}
```
###### Success Response
* Status code: 200
* Content:
```
[
    {
        "businessListingId": "1",
        "businessName": "microBiz",
        "ownerName": "Divy Sharma",
        "category": "Home Decor",
        "city": "Mumbai"
    },
    {
        "businessListingId": "2",
        "businessName": "Sweet Chariots",
        "ownerName": "Nidhi Patel",
        "category": "Home backer",
        "city": "Mumbai"
    }
]
```
---