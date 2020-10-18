## Description
With COVID-19, people are now facing many more challenges than they had before. Introducing Chores Backspace, when there may come a time when you find yourself in need of help to complete a chore. Remove those chores off your list by accessing the application and requesting for help. Whether you are a senior who needs a helping hand or a working parent who just can’t find the time, this application connects those who are in need with those who are willing to help. 

## Features
- Register & Login
- Upload profile picture
- Request, accept, and complete chores
- Map marker locations for chores 

## Tools / Technologies
- React: Frontend
- Google Firebase 
  - Functions: Backend API
  - Authentication: Authenticate users
  - Cloud Firestore: Database
- Google Maps API: Display map & markers
- Google Geocoding API: Convert address into coordinates

## Challenges I ran into
#### Firebase Hosting issues
I was able to deploy the application using Firebase Hosting (https://chores-32286.web.app). However, I ran into problems connecting it to the Cloud Functions API that I had also deployed (https://us-central1-chores-32286.cloudfunctions.net/api). 
#### Domain Name
I was able to register a domain name using domain.com (https://choresback.space/). However, it seems that in order to connect a custom domain name to a Firebase Hosted app, it takes time to propagate domain changes. Given more time, choresback.space would be properly configured for accessing the app. 

## Accomplishments that I'm proud of
- Produced a working application that had all the features I had initially set out to complete
- Learned how to use Google Firebase for developing serverless functions
- Learned how to incorporate maps using Google Maps API

## What's next for <= Chores
- Reputation / points system for incentivizing users to help others
- Search bar to search chores by name, type, etc.
- Additional login methods 
- UI changes for better app experience
