# [**Fyle Challenge (Banks Info)**](https://www.notion.so/Fyle-Full-Stack-Coding-Challenge-db30c5cb91d54de1b330c16f22fc49f0) [Part 2]

## Live Demo [Link](https://banks-info.herokuapp.com/)

## API Using For Data Fetch
**1) Autocomplete API**
Autocomplete API to return possible matches based on the branch name ordered by IFSC code (ascending order) with limit and offset.

- **Endpoint: /api/branches/autocomplete?q=<>**

- **Example: /api/branches/autocomplete?q=**RTGS**&limit=3&offset=0**

```bash
curl -i -H "Accept: application/json" https://banks-branches-api.herokuapp.com/api/branches/autocomplete?q=bangalore&limit=5&offset=1

```

**2) Search API**

Search API to return possible matches across all columns and all rows, **ordered by IFSC code** (ascending order) with limit and offset.

```bash
curl -i -H "Accept: application/json" https://banks-branches-api.herokuapp.com/api/branches?q=delhi&limit=5&offset=1
```

-  **Endpoint: /api/branches?q=<>**
-  **Example: /api/branches?q=**Bangalore**&limit=4&offset=0**

## Banks Info Featurs
- [X] Single Page Application
- [X] Data Fetching Dynamically 
- [X] Add Fav Bank Funtionality (Using DSA Concept Without Any Bootstrap Library)
- [X] Availability For Choosing City, Data Limt, Page Number (Using DSA Concept Without Any Bootstrap Library)
- [X] Sorting Feature via Each Column Dynamically (Using DSA Concept Without Any Bootstrap Library)
- [X] Pagination ( Using DataStructure & Algorithem Concept Without Any Bootstrap Library )
- [X] Page State Saving in any City, Sorting Order, Current Page (Using DSA Concept Without Any Bootstrap Library)
- [X] Start Site In Same Page State Where Left Befor Window Load 

- [x] All Above Concept Made With DSA Concept Without Using Direct Bootstrap DataTable


## Task List
- [X] Setup node Server
- [X] Setup Credentials in Environment variable
- [X] Setup Postgresql Database Connection
- [X] Work on API
- [X] API Testing And Debuging
- [X] Database Add-On At Clever-Cloud.com [Link](https://www.clever-cloud.com/)
- [X] Application Deployment at Heroku-App [Link](https://www.heroku.com/)