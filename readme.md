# WonderJournal 

Deployed on Render: [WonderJournal](https://wonderjournal.onrender.com/)

**Note:** When you first visit WonderJournal, it may take a long time to start the server as it is deployed using the free Render plan. This means the server goes to sleep after a period of inactivity. Thanks for your patience! 



## About WonderJournal

A journaling app that encourages mindfulness and the savoring of moments our every day lives. 

The application allows users to create and save'moments' that they wish to record and reflect on. These entries are made richer by the ability to upload associated image, audio, and video files. Tagging, filtering, and search functionality allows users to more easily find and group moments of interest. 

Future functionality will allow the sharing of these moments with via email and other forms of direct message.

<span style="color:red">Include product screenshots / video</span>



## Features

- **Moment creation**: journal about your moments and enrich your reflection process by attaching images, audio, or video. 
- **Tagging:** allows for users to easily group and find their moment entries with related themes. This can aid in the reflection process when considering considering  for example certian relationships or particular places and activities. 
- **Search / Filter:** by title, date, tag, or other info. Find the moment you are thinking of quickly and easily. 
- **Minimalist UI**: A mimimalist interface with few effects and a natural color scheme allows users space to reflect on their meanigful moments and create a distraction free writing experience. 




## Future Project updates

###### Technical Improvements
- [x] **Improve search as you type** : Using a debounce functrion to rate limit API calls with instant search
- [ ] **Front end validation:** This will help limit unnecssary calls to the API. I will most likely utilize a library such as [Formik](https://formik.org/). 



###### Feature Improvements
- **Uploading media**: storage via AWS S3
- **Moment sharing** via email via API such as [Sendgrid](https://sendgrid.com/)
- **Moment Review:** upcoming feature. Interactive view to reflect on your past moments.  Perhaps as an interactive timeline



## Tech Stack

<span style="color:red">Include logos</span>

- React
- Express & Node.js
- Postgres SQL
- AWS S3



## User Flow

![user flow diagram](/Users/adampecan/Documents/Springboard/Exercises/Capstone-2_WonderJournal/proposal/User Flow.png)



## High Level Project Architcture

<span style="color:red">Put diagram here</span>



## Database ERD

![Database entity relationship diagram](/Users/adampecan/Documents/Springboard/Exercises/Capstone-2_WonderJournal/proposal/db_erd.png)




## WonderJournal API	 

Express api with routes for user authentication and user, moment, tag, and media management. 

<span style="color:red">List routes / link to API reference</span>



## Technical Implementation

**Authentication:** using JWT and local stoarge

**Authorization:** authorization middleware to allow users to only access their own moments and content. Client side routes are protected with React Router. 

**Validation**: Back end validation is implemented via [jsonschema](https://www.npmjs.com/package/jsonschema). 

**Error Handling:** centralized middleware sends an error response in the following format:	

Client Side Routing:

Cloud Object Storage: 



## Local Installation

If you prefer to install WonderJournal locally, please follow these steps:

Clone the repo:

```
git clone https://github.com/adamnyk/capstone-2_WonderJournal.git
cd capstone-2_WonderJournal
```



Install dependencies:

```
npm install
```



Create database:

- install Postgres if needed [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- seed database:
  ```
  psql < backend/wonder_journal.sql
  ```



Run locally:

```
cd backend
npm run dev

cd ../frontend
npm run dev
```


Navigate to [http://localhost:5173/](http://localhost:5173/) or address indicated in the terminal




## Testing

- Unit and integration testing using [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest)

**Testing Status**: Initial backend testing of data models, routes, and authorization middleware has been completed. The app has also undergone an intial round of manual testing. Front end unit and integration testing via jest and react testing library is pending the development of new features. Updates will be given regarding continued progress. 



Running back-end tests:
```
cd backend
npm test
```
