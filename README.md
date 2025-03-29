 OOSE Team Project

WSE interlock -- Are you struggling to find an intuitive system for users and admin in your university machine shop? Have no fear WSE Interlock is here! With a centralized kiosk for the admin command post of your dreams and an easy, user-friendly experience with interlock devices using the machine shop will be as easy as arrive, swipe, and build! Have questions on usage and analytics? With built in financial and authorization tools you'll have no worries on trust between users and the system!

- [Team Information & Agreement](./docs/team-agreement.md)
- [Requirements Specification](./docs/requirements-specification.md)
- [Project Roadmap](./docs/roadmap.md)
- [Technical Documentation](./docs/technical-documentation.md)

## Installing / Getting started

A quick introduction of the minimal setup you need to get the app up & running on a local computer. For example, your advisor might use the instruction here to run the application locally.

```shell

cd web
pnpm install
pnpm dev

cd ../api-database
pnpm install
pnpm dev

cd ../api-machine
conda activate machine_api
python server.py

```

## Developing

### We will outline the dependencies utilized on during development along with resources containing documentation for them.

#### Front End Dev Dependencies:
- [Eslint](https://eslint.org/docs/latest/) - 9.19.0
- [Node](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) - 22.13.4
- [React](https://react.dev/learn) - 19.0.3
- [Prettier](https://prettier.io/docs/install) - 3.5.1
- [TailwindCSS](https://tailwindcss.com/docs/installation/using-vite) - 5.7.2
- [Typescript](https://www.typescriptlang.org/docs/) - 5.7.2
- [Vite](https://vite.dev/guide/) - 6.1.0

#### Back End API Dependencies:
- [PostgresSQL](https://www.postgresql.org/download/) - 17.3
- [Drizzle-orm](https://orm.drizzle.team/docs/overview) - 0.39.3
- [Hono](https://hono.dev/docs/) - 4.7.1
- [Arctic](https://arcticjs.dev/) - 3.3.0

#### Machine API Dependencies:
Below is the information on setup for the Machine API development but first what does this section do? The Machine API is meant to facillitate the connection between the Interlock Application and the actual machine in the WSE Machine Shop. This allow for the use of Python scripts on the Rasberry PIs in the machine shop to send signals powering the machine based on met criteria or blocking usage if specifications aren't met.

- [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html)
 

To setup the machine api, start up anaconda_prompt and run the following command after navigating to the api-machine folder: 

```shell

cd /api-machine
conda env create -f machine-api.yml
```

To activate the created environment use the following command:

```shell
conda activate machine-api.yml
python server.py
```
#### Automated Testing Dependencies

- [Babel](https://babeljs.io/) - 7.26.10
- [Jest](https://jestjs.io/) - 29.7.0
- [Cypress](https://www.cypress.io/) - 14.1.0



## Running Hello World

[Here](https://interlock-api-database-v1.vercel.app/) is the deployed database API.

[Here](https://interlock-web-v1.vercel.app/) is the deployed web app.

We also have a dockerized version of the machine API, which you can find [HERE](https://github.com/cs421sp25-homework/team-10/pkgs/container/team-10-api-machine)

If you are unfamiliar with docker, read on to set it setup to run locally.

First install docker if you do not have it here: https://docs.docker.com/get-started/get-docker/

Next, make sure you have a github personal acess token. Make a standard token and give it all permissions. For more information, look here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

To make sure you are signed with your credentials, you can run the following commands in a terminal:

```shell
docker logout ghcr.io
docker login ghcr.io -u YOUR_GITHUB_USERNAME -p YOUR_PERSONAL_ACCESS_TOKEN
```

At this point, find "team-10-api-machine" in the "Packages" tab in the repository or by clicking [HERE](https://github.com/cs421sp25-homework/team-10/pkgs/container/team-10-api-machine) . To run on your machine, run the "install from command line" command at the top of page in your terminal, which is 
```shell
docker pull ghcr.io/cs421sp25-homework/team-10-api-machine:latest
```

After you download the image, go to the docker web app, and click on the "Images" tab, then click the "run" button on the image you want to run.
Then, click the "optional settings" button in the popup menu, and set a host port number.
Finally, open a web browser and naviagte to "http://localhost:PORT_NUMBER_YOU_PUT/", or if it is an API package, ping http://localhost:PORT_NUMBER_YOU_PUT/ with a GET request.

### Local Testing Process

For web enter pnpm install and then type pnpm dev and that will run web locally. 

### Usage Specifications

#### Admin Dashboard
##### Log In

Copy and paste the following into the input box: 

;1234567890777777;


##### Newly Added User

If testing newly added users, make sure to put a random charcter in the beginning and at the end of the card number as this mimics what the scanner will input when a card is scanned. 

##### Creating a User 

When creating a user, keep in mind that card numbers must be 16 digits and mark the checkbox if the user is an admin, which for the purposes of iteration 1 should be marked to test the user stories implented with this user.

##### Creating a BudgetCode

When creating a BudgetCode, keep in mind that the code must be 8 characters long. 

#### Interlock

To run the interlock side of the program (what is mounted on each machine), we must first simulate being a machine

##### Machine API

The machine API is how the program detects which machine the current instance of the program sees. Before reseting this data, make sure that your user has access to all machines and is an admin. To reset it entirely, 

```shell
cd api-machine

rm .env # this is the machine data

```

##### Web app

Then, go on the web app and log in with the card number. It will prompt you to select a machine for this system (as it does not recognize one as being stored). Choose a machine, and you will be taken to the interlock page. From here, you can select a budget code and press start. A `turn-on` request should be sent to the machine API. A timer should also display. When the finish button is pressed, a financial statement is created and the page goes back to the start page.

##### Financial Statements

Then, to view the financial statements, reconfigure the machine as a kiosk (with a similar process to before). Then, when in the admin dashboard, a button at the top titled "Send Financial Statements" will opena  dialog that allows for an email to be sent of all the financial statements. Currently, because of the Resend API, only the account owners email can be a receiver. To view them in the dashboard, a button is on the dialog. A list of all financial statements can be seen.



## Automated Testing

### Front End 

#### End-2-End & Component Testing
To run the automated front-end tests, run 

```shell

cd web

npx cypress run # this runs them on the console

npx cypress open # this runs them on the browser
```

This will go through all the testing suites for each component.

### Back End

To run the back-end tests, we used Jest. To run the testing suites,

```shell

pnpm test # this should be done in the parent directory of the project

```

This will display the results of all the testing suites in the console.


## Contributing
Refer to the [Contributing Guidelines](./CONTRIBUTING.md) for information on how to contribute to the project.

## Licensing

Refer to the [Project Repository License](./LICENSE.md) for information on how the project is licensed./
