# What is VizSurvey

I created VisSurvey out of a need to have a tool with survey questions with an accompanying visualization that could be data driven for my masters thesis reasearch. I had originally investigated using survey monkey and other tools; however, they lack the ability to embed visualizations or could't find any with a REST API that would allow me to make the visualizations driven off the survey questions, so I wrote VizHub.

The application is written in react using redux and axios. It fetches the survey question data in csv format from gist and will write back the survey questions to gist as well, so hosting question data and answers can be done for free. The application retrieves the survey questionaire data, and renders the questions in a click through format making the data avialable to the react component that wraps the D3 visualization.

I hope you find it useful.

# Architecture

The application is written in react using redux and axios. It fetches the survey question data in csv format from gist and will write back the survey questions to gist as well, so hosting question data and answers can be done for free. The application retrieves the survey questionaire data, and renders the questions in a click through format making the data avialable to the react component that wraps the D3 visualization.

# Setup

## Github Gist Setup

1. Follow the instructions at https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app to register you application to get a token.
2.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run deploy`

Will deploy the application to github pages via gh_pages package. Then surf to https://pcordone.github.io/vizsurvey?treatment_id=2 (http://localhost:3000/vizsurvey?treatment_id=3)

Change the participant_id to the value for the person taking the survey.

### `npm run cypress-open`

Opens cypress window to select and run cypress tests. Make sure to already have the app running with `npm start`.
https://docs.cypress.io/guides/guides/command-line

### `npm run cypress-run`

Runs cypress tests automatically in headless mode. Make sure to already have the app running with `npm start`.
https://docs.cypress.io/guides/guides/command-line

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### links I found useful while developing

Gives examples of using octokit for gist
https://www.liquidweb.com/kb/little-known-ways-to-utilize-github-gists/

Articles of interest regarding review of web charting and graphing libraries.
https://cube.dev/blog/dataviz-ecosystem-2021/

This blog posts shows how to create a react app and ad D3.js to it.
https://blog.logrocket.com/using-d3-js-v6-with-react/

This post shows how to setup eslint and prettier
https://medium.com/how-to-react/config-eslint-and-prettier-in-visual-studio-code-for-react-js-development-97bb2236b31a

This post shows how to incorporate a D3 visualization as a react component
https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app

Flexbox post
https://css-tricks.com/snippets/css/a-guide-to-flexbox/

#### D3 articles

https://bost.ocks.org/mike/selection/
https://bost.ocks.org/mike/nest/
https://www.animateddata.com/articles/d3/selections/
https://www.d3indepth.com/datajoins/

### Code I am crediting

object2Csv - https://gist.github.com/select/0e2aa49b98ea81db7c615e6560497c41

### Notes on React

React Hooks - provides an easy way of handling the component behavior and share the component logic
Redux - is a library for managing the global application state.

- single source of truth where data is stored in object tree store
- state is read only and can only change data in store by emitting actions
- changes are made with pure functions - To update store a reducer is written as a pure function.
  Redux should be used in applications that have several features. With these features sharing chunks of the same information.

### Media Querries

https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries

### SVG

https://crashcourse.housegordon.org/D3JS-Absolute-Units.html
https://crashcourse.housegordon.org/examples/svg_units.html
https://jenkov.com/tutorials/svg/svg-transformation.html
https://www.sarasoueidan.com/blog/svg-transformations/
https://codepen.io/basiacoulter/pen/xGweXz

### Calendar example

https://benclinkinbeard.com/d3tips/building-a-calendar-with-d3/?utm_content=bufferc1664&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer
https://codepen.io/bclinkinbeard/pen/MEZxMe
