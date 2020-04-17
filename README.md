This project is an example of how to a 'real-world' app with highly dynamic data in a serverless fashion using React hooks, FaunaDB, and Cloudinary. It uses the Fauna Query Language (FQL) and starts with a frontend-only approach that directly accesses the serverless database FaunaDB for data storage, authentication, and authorization. 

<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/stack1.png?raw=true" width="400">

A few features are still missing and will be covered in future articles, including streaming, pagination, benchmarks, and a more advanced security model with short-lived tokens, JWT tokens, single sign-on (possibly using a service like Auth0), IP-based rate limiting (with Cloudflare workers), e-mail verification (with a service like SendGrid), and HttpOnly cookies.

<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/stack2.png?raw=true" width="400">


## Setup the project
This app was created with Create React App, to start using it we need to: 

### Install npm packages
`npm run install`

### Setup the database

To set up the project, go to the [FaunaDB Dashboard](https://https://dashboard.fauna.com/) and sign up. 

<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/sign_up.png?raw=true" width="600">

Once you are in the dashboard, click on New Database, fill in a name, and click Save. 
<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/new_database.png?raw=true" width="600">
<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/new_database2.png?raw=true" width="600">

You should now be on the "Overview" page of your new database. 
Next, to manipulate the database from within our setup scripts, we need a key. Click on the Security tab in the left sidebar, then click the New key button. 
<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/admin_key.png?raw=true" width="600">

In the "New key" form, the current database should already be selected. For "Role", leave it as "Admin" and give it a name.
<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/admin_key2.png?raw=true" width="600">
Next, click Save and copy the key secret displayed on the next page. It will not be displayed again.
<img src="https://github.com/fauna-brecht/fwitter/blob/master/readme/admin_key3.png?raw=true" width="600">


You now have the option to place it in your environment variables via .env.local, we have provided an example file .env.local.example that you can rename. Although the .env.local file is gitignored, make sure not to push your admin key, this key is powerful and meant to stay private. The setup scripts will therefore also ask you the key if you did not place it in your environment vars so you could opt to paste them in then instead.

```
REACT_APP_LOCAL___ADMIN=fnADpZWKPWACCyDrAWqjJrIqkwBaaDPBst4Zrn1Z
```

We have prepared a few scripts so that you only have to run the following commands to initialize your app, create all collections, and populate your database. The scripts will ask for the admin token that you have created and will give you further instructions.  
```
// run setup, this will create all the resources in your database
// provide the admin key when the script asks for it. 
npm run setup
```
When this script has finished setting up everything you will receive a new key. This key is the bootstrap key that has very tight permissions (it can only register and login) and will be used to bootstrap our application. 
```
REACT_APP_LOCAL___BOOTSTRAP_FAUNADB_KEY=<insert faunadb bootstrap key>
```

### Populate the database (optional)
We also provided a script that adds some data to the database (accounts, users, fweets, comments, likes, etc..) for you to play around with. 
```
// with almost no permissions that you need to place in your .env.local as the
// script suggestions
npm run populate
```

### Setup cloudinary. 

We use [Cloudinary](https://cloudinary.com/) to allow users to upload media which will be linked to the data of our application such as video and images. Currently, this is only used when a user creates a new Fweet with the media button on the right. To see this feature in action, create an account with Cloudinary and add your cloudname and a public template (there is a default template called ‘ml_default’ which you can make public) to the environment. 
```
REACT_APP_LOCAL___CLOUDINARY_CLOUDNAME=<cloudinary cloudname>
REACT_APP_LOCAL___CLOUDINARY_TEMPLATE=<cloudinary template>
```

## Run the project
This project has been created with [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)and therefore has the same familiar commands such as 

`npm start`

to start your application. 

## Tests
Although we did our best to comment all FaunaDB queries as extensively as possible and even wrote the queries in multiple steps that gradually increase the complexity, some developers find it easier to look at the results of tests to see how something works.For those guys/girls we have added a few integration tests to show how a few of the queries work. 

### Set up the tests
In FaunaDB you can make as many databases as you want and place them in other databases.
This can come in handy if you want to run multiple integration tests concurrently against FaunaDB or just to keep
An overview. We chose to run each test suite in one database. These tests expect that you have created a database and placed an admin key for that database in .env.test.local for which we also provided an example file. You can choose to keep your database for tests separated from your application database but you can also simply paste in the admin key that you used before, the tests will create and destroy child test databases for you on the fly when tests run.
```
REACT_APP_TEST__ADMIN_KEY=<your test database key>
```

### Run the tests
`npm test`
