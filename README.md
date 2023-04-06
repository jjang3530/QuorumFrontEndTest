# Autovance UI Code Challenge

## Background

This challenge is intended to be a short simulation of the environment and technologies that we work with every day at Autovance. More important than actually solving the problem, we want to see how you approach these sorts of problems and how you approach learning the technologies that are essential to your success on Autovance's development team. A secondary goal of this challenge is to demonstrate your working knowledge of TypeScript, Angular, NPM, and Git.

**This challenge is not pass / fail**. We want you to perform as well as you can in an environment where you are comfortable. Your solution will be judged on the following elements:

1. Behavior: Does the application do what the user expects it to do?
2. Design: Is the resulting application aesthetically pleasing? Is it usable across device form factors?
3. Robustness: Does the application handle errors reasonably? Did the developer make an effort to test their code?
4. Completeness: Did the solution solve the entire problem, or only certain parts of it? 

Throughout the process, your interviewer remains as a first-class resource, and is available for pair programming and any questions: do not hesitate to reach out to [millerj@quorumdms.com](mailto:millerj@quorumdms.com) at any time during the exercise.

## The Problem

XYZ Motors is a car dealership that generates leads from a wide variety of sources (in-store visits, referrals from their BDC, Kijiji ads, the MyDeal digital retailing tool, etc).
However, because the systems that generate these leads don't talk to one another, it is often the case that a person browsing XYZ Motors' website will submit multiple lead
entries if they indicate that they are interested in test driving or looking at one or more vehicles (or if the prospective customer clicks on a Kijiji ad and then walks into the dealership later that day, for example).

Your task is to use the Autovance Leads API (bundled in this repo as `leads-api.js`) to build a front-end application that will help the sales staff at XYZ Motors manage their
leads. In order to do this, they require a user interface that will allow them to perform the following tasks:

* Display a list of all the leads that were received through the various lead generation platforms that the dealership uses
* For each lead in the list, show a list of "potential duplicates" associated with that lead
* Allow the sales staff to mark one or more "potential duplicates" as "actual duplicates" of a given lead

To facilitate each of these tasks, the Leads API offers the following methods: 

* `GET /api/leads`: returns a list of all the leads that the dealership has received in the last 30 days
* `GET /api/leads/:lead_id/potential-duplicates`: returns a list of "potential duplicates" associated with a given lead (note that this route will only return the `lead_id`s of the potential duplicates, not the full lead objects: you can assume that if an ID appears in this list, its corresponding object will appear in the `GET /api/leads` response)
* `PUT /api/leads/:lead_id`: update a lead object on the server

Lead objects have the following shape:

```typescript
export interface Lead {
  // a GUID that uniquely identifies each lead object
  lead_id: string;

  // If the lead is a duplicate of another lead, this field
  // indicates the GUID of the lead that was duplicated.
  // If the lead is not a duplicate, or it has not been marked
  // as such, this field will be returned as `null`
  duplicate_of: string | null; 

  // the source through which the lead was submitted 
  // (could be an application, a website, or an in-person activity)
  source: string;

  // the first name of the prospective customer
  first_name: string;

  // the last name of the prospective customer
  last_name: string;

  // the e-mail address of the prospective customer
  email: string;

  // the cell phone number of the prospective customer
  cell_phone: string;

  // the home phone number of the prospective customer
  home_phone: string;
}
```

To mark Lead A (`lead_id === eb59dab2-b25f-4986-96fd-93a2d31f5a51`) as a duplicate of Lead B (`lead_id === 25341576-8eff-43fd-b1ea-e71b248621be`), it is necessary to set Lead A's `duplicate_of` field to Lead B's `lead_id` (this can be done using the `PUT /api/leads/:lead_id` method). The resulting objects should look like this:

```json
{
  "lead_id": "eb59dab2-b25f-4986-96fd-93a2d31f5a51",
  "first_name": "Lead A",
  "duplicate_of": "25341576-8eff-43fd-b1ea-e71b248621be",
  ...
}
```

```json
{
  "lead_id": "25341576-8eff-43fd-b1ea-e71b248621be",
  "first_name": "Lead B",
  "duplicate_of": null,
  ...
}
```


## Instructions

1. Make a private clone of the repo and do all of your work inside of this clone
  * Click 'use this template' on the top right of the GitHub page and create a private clone
  * IMPORTANT: Do not fork this repository, as the fork will be publicly-visible (consider using a new GitHub account if you are concerned about discretion)
2. Install all dependencies using `npm install` (ensure that you have NodeJS 12+ and NPM installed before proceeding with this)
3. Run the Angular development server on port 4200 using `ng serve`
4. Run the Autovance Leads API server on port 3000 using `node leads-api.js`
5. Complete the code to solve the problem described above
6. Create a small technical write-up that describes how you solved the problem, and put it in `DESCRIPTION.md`
7. Add @xjph to the private repository and send an e-mail to millerj@quorumdms.com once you've pushed your completed project up to GitHub

## Notes 

* Data in the Leads API is only persisted in-memory, it does not connect to a real database and does not write its state out to disk at any point. If you restart the `leads-api` process, the data will be reset to its original state.
* Due to government budget cuts, cosmic rays, and a variety of mitigating factors, the Leads API is notoriously unreliable: requests will frequently fail with HTTP 500 errors, so it is your responsibility to catch these errors in the application and surface them to the user in an appropriate manner.


## Rules

* You must build your solution within the existing Angular app from this repository (follow the instructions above to create a private clone): no other frameworks, such as React or Vue, are allowed
* You may install third-party libraries if you feel so inclined, but please do so only through NPM (linking to CDN-hosted libraries is not permitted)
* You may not make any modifications to `leads-api.js` or `mock-data.json` whatsoever, and you may not write your own back-end API


--- 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

