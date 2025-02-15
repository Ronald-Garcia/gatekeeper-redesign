 OOSE Team Project

WSE interlock -- Are you struggling to find an intuitive system for users and admin in your university machine shop? Have no fear WSE Interlock is here! With a centralized kiosk for the admin command post of your dreams and an easy, user-friendly experience with interlock devices using the machine shop will be as easy as arrive, swipe, and build! Have questions on usage and analytics? With built in financial and authorization tools you'll have no worries on trust between users and the system!

- [Team Information & Agreement](./docs/team-agreement.md)
- [Requirements Specification](./docs/requirements-specification.md)
- [Project Roadmap](./docs/roadmap.md)
- [Technical Documentation](./docs/technical-documentation.md)

## Installing / Getting started

A quick introduction of the minimal setup you need to get the app up & running on a local computer. For example, your advisor might use the instruction here to run the application locally.

```shell
commands here
```

## Developing

### We will outline the dependencies utilized on during development along with resources containing documentation for them.

#### Front End dev dependencies: 

 [Eslint][https://eslint.org/docs/latest/] - 9.19.0
 [Node][https://nodejs.org/en/learn/getting-started/introduction-to-nodejs] - 22.13.4
 [React][https://react.dev/learn] - 19.0.3
 [Prettier][https://prettier.io/docs/install] - 3.5.1
 [TailwindCSS][https://tailwindcss.com/docs/installation/using-vite] - 5.7.2
 [Typescript][https://www.typescriptlang.org/docs/] - 5.7.2
 [vite][https://vite.dev/guide/] - 6.1.0

#### Back End API Dependencies: 
[PostgresSQL][https://www.postgresql.org/download/] - 17.3
[Drizzle-orm][https://orm.drizzle.team/docs/overview]  - 0.39.3
[Hono][https://hono.dev/docs/] - 4.7.1
[Arctic][https://arcticjs.dev/] - 3.3.0


#### Machine API Dependencies: 
[Conda][https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html] - 

To setup the machine api, start up anaconda_prompt and run the following command after navigating to the api-machine folder: 

```shell
conda env create -f [env-yml-name].yml
```


#### Setup the database locally: 

Go to environment variables, once there you have to edit envornment varibles and select the PATH varibles and edit it. Once there you select the add option and add the following path: 

C:\Program Files\PostgreSQL\17\bin

After adding the path variable, restart VSCODE and run the following command on the home folder of the project: 

```shell
psql -U postgres -f setup_database.sql
psql -U postgres -d team10_db -c "SELECT * FROM users;"
```

For your password, ensure you setup a simple password you will remember as it is for local development. 


You should include what is needed (e.g. all of the configurations) to set up the dev environment. For instance, global dependencies or any other tools (include download links), explaining what database (and version) has been used, etc. If there is any virtual environment, local server, ..., explain here. 

Additionally, describe and show how to run the tests, explain your code style and show how to check it.

If your project needs some additional steps for the developer to build the project after some code changes, state them here. Moreover, give instructions on how to build and release a new version. In case there's some step you have to take that publishes this project to a server, it must be stated here. 

## Contributing
Refer to the [Contributing Guidelines](./CONTRIBUTING.md) for information on how to contribute to the project.

## Licensing

Refer to the [Project Repository License](./LICENSE.md) for information on how the project is licensed./