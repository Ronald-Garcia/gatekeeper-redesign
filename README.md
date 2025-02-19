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
- [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html)
 

To setup the machine api, start up anaconda_prompt and run the following command after navigating to the api-machine folder: 

```shell
conda env create -f [env-yml-name].yml
```

To activate the created environment use the following command:

```shell
conda activate [env-yml-name]
```

## Running Hello World

To run this project's Hello World, you first need to install docker if you do not have it here: https://docs.docker.com/get-started/get-docker/

Next, make sure you have a github personal acess token. Make a standard token and give it all permissions. For more information, look here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

To make sure you are signed with your credentials, you can run the following commands in a terminal:

```shell
docker logout ghcr.io
docker login ghcr.io -u YOUR_GITHUB_USERNAME -p YOUR_PERSONAL_ACCESS_TOKEN
```

At this point, find the "Packages" tab in the repository. They have the names "team-10-web", and "team-10-api-machine". These packages correspond to the components they are named after. To run any one of them on your machine, click on the package, and run the "install from command line" command at the top of page in your terminal.

After you download the image, go to the docker web app, and click on the "Images" tab, then click the "run" button on the image you want to run.
Then, click the "optional settings" button in the popup menu, and set a host port number.
Finally, open a web browser and naviagte to "http://localhost:PORT_NUMBER_YOU_PUT/", or if it is an API package, ping http://localhost:PORT_NUMBER_YOU_PUT/ with a GET request.

## Contributing
Refer to the [Contributing Guidelines](./CONTRIBUTING.md) for information on how to contribute to the project.

## Licensing

Refer to the [Project Repository License](./LICENSE.md) for information on how the project is licensed./
