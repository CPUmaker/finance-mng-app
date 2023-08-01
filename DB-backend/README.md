# DB-backend
backend of database project

Rules:

* Upload to the `develop` branch first, and then merge into the `master' branch after the meeting.

* Try to be as accurate as possible in each `commit`, and don't use meaningless records, such as "one".

* Communicate with each other if there are any problems.

## API Protocol

The following specification is based on `Web Protocol`.

* `GET` requests cannot pass data using the format `x-www-formurlencoded`, and can only construct `url` parameters to send the request to the backend.

* `POST` requests, on the contrary, need to use the format `x-www-formurlencoded` to send the request to the backend.

* **Front-end implementations must look at the POST/GET and the form of the request content!**

## Wiki

### Query the total amount of each type of interface for the current month

* Example

  `http://localhost:8000/api/core/bill/check_cost?user_id=1&month=1`

  * Query User #1's total amount for the month of January

* returning example

  <img src="https://i.loli.net/2020/10/06/BcwfOP2QSnIokRq.png" alt="image-20201006104714869" style="zoom:50%;" />

### Check the highest spending record of the month

* Example

  `http://localhost:8000/api/core/bill/check_high?user_id=1&month=1`

  * Check User #1's highest spending in January

* returning example

  <img src="https://i.loli.net/2020/10/06/Y4VnB3tidQHJv2T.png" alt="image-20201006105001477" style="zoom:50%;" />

### Enquire about the total expenditure and income for the year

* Example

  `http://localhost:8000/api/core/bill/check_allyear?user_id=1&year=2020`

  * Query 1 User 2020 Total Consumption

* returning example

  <img src="https://i.loli.net/2020/10/06/IvVAi7aOkmWurFp.png" alt="image-20201006105208194" style="zoom:50%;" />

### User Follow Up

* Example

  `http://localhost:8000/api/core/user/add_following_company`

  * Add a business to follow for a particular user

    > See the form in the picture for the exact user

* returning example

  <img src="https://i.loli.net/2020/10/06/8sHXrqW5oj3JtYZ.png" alt="image-20201006105435159" style="zoom:50%;" />

### Access to personal information

* Example

  `http://localhost:8000/api/core/user/check_self?user_id=3`

  * Check out user #3's business concerns

* returning example

  <img src="https://i.loli.net/2020/10/06/zeFubMmxSYfW2Qt.png" alt="image-20201006105611327" style="zoom:50%;" />

### New billing for a user

* Example

  `http://localhost:8000/api/core/bill/create`

  * New billing for user #1

* returning example

  <img src="https://i.loli.net/2020/10/09/bCVU6koWI47yOcP.png" alt="create_bill" style="zoom:50%;" />

### Query all bills owned by a particular user

* Example

  `http://localhost:8000/api/core/bill/query?user_id=1`

  * Check all bills for user #1

* returning example

  <img src="https://i.loli.net/2020/10/09/kJjI18ZumMqQiE9.png" alt="query_bill" style="zoom:50%;" />

### Find all bills in reverse chronological order

* Example

  `http://localhost:8000/api/core/bill/query-reversed?user_id=1`

* returning example

  <img src="https://i.loli.net/2020/10/14/ANbB9dhMWH7OZvU.png" alt="image-20201014140054298" style="zoom:50%;" />

### Modifying the information contained in a bill

* Example

  `http://localhost:8000/api/core/bill/modify`

  * Modify the information contained in Bill No. 3

* returning example

  <img src="https://i.loli.net/2020/10/09/AUM8P5FH12ma4gn.png" alt="modify_bill" style="zoom: 50%;" />

### Delete a bill

* Example

  `http://localhost:8000/api/core/bill/delete`

  * Delete #11 bill

* returning example

  <img src="https://i.loli.net/2020/10/09/F9ZPQqRbLayN8np.png" alt="delete_bill" style="zoom:50%;" />

### Register

> Invitation code to be added when it goes live

* Example

  `http://localhost:8000/api/core/register`

* returning example

  <img src="https://i.loli.net/2020/10/11/1qEhUFBOoYJg7VP.png" alt="image-20201011133005672" style="zoom:50%;" />

### Search all business listings

* Example

  `http://localhost:8000/api/core/user/list_company`

* returning example

  <img src="https://i.loli.net/2020/10/11/31XKeCqcVisYpLj.png" alt="image-20201011133155339" style="zoom:50%;" />

### Search all articles for this business (sent in reverse chronological order)

* Example

  `http://localhost:8000/api/core/article/list_article?company_id=1`

* returning example

  ![image-20201011133312536](https://i.loli.net/2020/10/11/xgj8aHPqS9oZmEO.png)

### Find all the details of this article

* Example

  `http://localhost:8000/api/core/article/require_article?article_id=1`

* returning example

  <img src="https://i.loli.net/2020/10/11/3SKRoTtyMreb9p8.png" alt="image-20201011133527790" style="zoom:50%;" />

### Get articles from all businesses followed by the user in the last twenty-four hours (sent in reverse chronological order)

* Example

  `http://localhost:8000/api/core/article/list_spec_article?user_id=3`

* returning example

  ![image-20201011133655620](https://i.loli.net/2020/10/11/1SvKWLstox2dpUO.png)