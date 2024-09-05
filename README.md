# Fragment

### API Server Setup

1. Create private Github
   ![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png 'Logo Title Text 1')
2. Clone repo

```
╭─ ~/Documents/Semester 5/DPS955/Lab1 ──────────────────── ✔  at 11:43:19 am ─╮
╰─ git clone https://github.com/CrisH2307/fragments.git                      ─╯
Cloning into 'fragments'...
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 4 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
Receiving objects: 100% (4/4), done.
```

3. Open a terminal and cd into your cloned repo

```
cd fragments
```

### npm setup

---

4. Initialize the folder as an npm project, using npm init -y, which will create a package.json file (NOTE: the -y flag answers 'yes' to all questions, but we'll modify some things below):

```
npm init -y
```

5. Open your project folder in VSCode (NOTE: . is the current directory, and we always want to open the entire fragments repo folder vs. individual files):

```
code .
```

6. Modify the generated package.json file to update the version to 0.0.1, make the module private (i.e., we won't publish this package to the npm registry), set the license to UNLICENSED (this will be closed- vs. open-sourced code), update author to your name, description, the repository's url, and remove unneeded keys. Your package.json will look something like this:

```js
{
  "name": "fragments",
  "private": true,
  "version": "0.0.1",
  "description": "Fragments back-end API",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/CrisH2307/fragments.git"
  },
  "author": "CRISHUYNH",
  "license": "UNLICENSED"
}
```

7.  In your terminal, run npm install to validate your package.json file, and fix any errors that it generates. This will also create a package-lock.json file.

```
╭─ ~/Documents/Semester 5/DPS955/Lab1/fragments  on main ⇡2 !1 ───────── ✔  at 12:23:21 pm ─╮
╰─ npm install                                                                             ─╯
up to date, audited 278 packages in 901ms
44 packages are looking for funding
 run `npm fund` for details
```

8.  In your terminal, commit the package.json and package-lock.json files to git. NOTE: it's a good practice to commit small changes to git frequently whenever we get something working, which I'll demonstrate below as we work through this lab:

```
─ ~/Documents/Semester 5/DPS955/Lab1/fragments  on main ⇡2 !1 ───────── ✔  at 12:23:29 pm ─╮
╰─ git add package.json package-lock.json                                                  ─╯
git commit -m "Initial npm setup"
On branch main
Your branch is ahead of 'origin/main' by 2 commits.
  (use "git push" to publish your local commits)
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md
no changes added to commit (use "git add" and/or "git commit -a")
```

9. Install and configure Prettier to automatically format our source code when we save files. Begin by installing Prettier as a Development Dependency (NOTE: prettier needs to be installed with an exact version vs. using an approximate ~ or ^ version):

```
─ ~/Documents/Semester 5/DPS955/Lab1/fragments  on main ⇡2 !1 ─────── 1 х  at 12:24:51 pm ─╮
╰─ npm install --save-dev --save-exact prettier                                            ─╯
up to date, audited 278 packages in 1s
```

Create a .prettierrc file, and use the following configuration (you can modify this if you want something different):

```
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "embeddedLanguageFormatting": "auto",
  "endOfLine": "lf",
  "insertPragma": false,
  "proseWrap": "preserve",
  "requirePragma": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false,
  "printWidth": 100
}
```

Create a .prettierignore file, which tells Prettier which files and folders to ignore when formatting. In our case, we don't want to format code in node_modules/ or alter the package.json or package-lock.json files:

```
node_modules/
package.json
package-lock.json
```

Install the Prettier - Code Formatter VSCode Extension.
Create a folder named .vscode/ in the root of your project, and add a settings.json file to it (i.e., .vscode/settings.json). These settings will override how VSCode works when you are working on this project, but not affect other projects:

```
{
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "files.eol": "\n",
  "files.insertFinalNewline": true
}
```

Now, whenever you modify a file and save it, Prettier should automatically format it for you. This saves a lot of time and makes our code more readable.
When you have it working, add and commit all your modified files to git:

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡2 !1
╰─ git add package.json package-lock.json .prettierignore .prettierrc .vscode/settings.json
    git commit -m "Add prettier"
    On branch main
    Your branch is ahead of 'origin/main' by 2 commits.
      (use "git push" to publish your local commits)
```

### ESLint setup

---

10. In your terminal, setup ESLint to lint our code:

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡2 !1
╰─ npm init @eslint/config@latest                       ─╯

> fragments@0.0.1 npx
> create-config

@eslint/create-config: v1.3.1

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · javascript
✔ Where does your code run? · browser
The config that you've selected requires the following dependencies:

eslint, globals, @eslint/js
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
☕️Installing...

up to date, audited 278 packages in 1s

44 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (3 moderate, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
Successfully created /Users/crishuynh/Documents/Semester 5/DPS955/Lab1/fragments/eslint.config.mjs file.
```

This setup process will have created an ESLint config file, eslint.config.mjs, which will look something like this:

```js
import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
];
```

Finally, install the ESLint VSCode Extension, so you get visual indicators when you have issues in your code.

11. Add a lint script to your package.json file to run ESLint from the command line. You can read more about the ESLint cli options if you are interested or have questions. NOTE: we don't have a src/ folder yet, but we will add it below:

```js
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint \"./src/**/*.js\""
},
```

12. Use git status to see which files have changed, then add and commit these files to git. NOTE: avoid using git add . and prefer to specify the files you want to add/commit manually. This helps avoid situations where you add files or folders that you don't mean to. With git, being explicit is better than being implicit:

```
─ ~/Doc/Se/D/L/fragments  on main ⇡2 !2
╰─ git status                                           ─╯
On branch main
Your branch is ahead of 'origin/main' by 2 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md
        modified:   eslint.config.mjs

no changes added to commit (use "git add" and/or "git commit -a")

╭─ ~/Doc/Se/D/L/fragments  on main ⇡2 !2
╰─ git add eslint.config.mjs package-lock.json package.json

╭─ ~/Doc/Se/D/L/fragments  on main ⇡2 +1 !1
╰─ git commit -m "Add eslint"                           ─╯
[main 83016bc] Add eslint
 1 file changed, 6 insertions(+), 5 deletions(-)
```

### Structured Logging and Pino Setup

---

13. Create a src/ folder to contain all of your source code. We use our project's root directory for configuration files, and put source code in src/:

```
mkdir src
```

14. Instead of console.log(), we need to be able to use proper Structured Logging in cloud environments, with JSON formatted strings. We'll use Pino to do it. Install all the necessary dependencies (NOTE: use --save to have the dependencies added to package.json automatically):

```
 ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ npm install --save pino pino-pretty pino-http        ─╯


up to date, audited 278 packages in 2s

44 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (3 moderate, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
```

15. Create and configure a Pino Logger instance in src/logger.js that we can use throughout our code to log various types of information:

```js
// src/logger.js

// Use `info` as our standard log level if not specified
const options = { level: process.env.LOG_LEVEL || 'info' };

// If we're doing `debug` logging, make the logs easier to read
if (options.level === 'debug') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = require('pino')(options);
```

16. Use git status to determine all the files that have changed, and add and commit them to git:

```
 ─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git status                                           ─╯
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git add eslint.config.mjs package-lock.json package.json src/

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git commit -m "Add pino logger"                      ─╯
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")

```

### Express App Setup

---

17. Install the packages necessary for our Express app, along with some commonly used middleware (NOTE: if you've not used any of these packages before, go read about them on https://www.npmjs.com/. Don't install and use code you don't understand!):

```
─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ npm install --save express cors helmet compression   ─╯


up to date, audited 278 packages in 1s

44 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (3 moderate, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
```

18. Create a src/app.js file to define our Express app. The file will a) create an app instance; b) attach various middleware functions for all routes; c) define our HTTP route(s); d) add middleware for dealing with 404s; and e) add error-handling middleware. Our initial server will only have a single route, a Health Check to determine if the server is accepting requests. NOTE: please don't copy/paste code that you don't understand, in the labs, or in general. If you read something and aren't sure what it does, do some research, ask questions, and understand it before you put it in production. While it's OK if you don't understand everything, it's not OK for you to stay that way. Learn as you go.

```js
// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// author and version from our package.json file
// TODO: make sure you have updated your name in the `author` section
const { author, version } = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
app.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo
  res.status(200).json({
    status: 'ok',
    author,
    // TODO: change this to use your GitHub username!
    githubUrl: 'https://github.com/REPLACE_WITH_YOUR_GITHUB_USERNAME/fragments',
    version,
  });
});

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // We may already have an error response we can use, but if not,
  // use a generic `500` server error and message.
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // If this is a server error, log something so we can see what's going on.
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

// Export our `app` so we can access it in server.js
module.exports = app;
```

### Express Server Setup

19. Install the stoppable package to allow our server to exit gracefully (i.e., wait until current connections are finished before shutting down):

```
 ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ npm install --save stoppable                         ─╯

up to date, audited 278 packages in 1s

44 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (3 moderate, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

```

20. Create a src/server.js file to start our server:

```
// src/server.js

// We want to gracefully shutdown our server
const stoppable = require('stoppable');

// Get our logger instance
const logger = require('./logger');

// Get our express app instance
const app = require('./app');

// Get the desired port from the process' environment. Default to `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    // Log a message that the server has started, and which port it's using.
    logger.info(`Server started on port ${port}`);
  })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
```

21. Run eslint and make sure there are no errors that need to be fixed:

```
╭─ ~/Doc/Se/DPS955/Lab1/fragments  on main ⇡3 !1 ─── 1 х  at 12:39:51 pm ─╮
╰─ npm run lint                                                          ─╯

> fragments@0.0.1 lint
> eslint "./src/**/*.js"
```

22. Test that the server can be started manually:

```
╭─ ~/Doc/Se/DPS955/Lab1/fragments  on main !2 ?2 ────── INT х  took 6m 59s  at 12:05:01 pm ─╮
╰─ node src/server.js                  ─╯
{"level":30,"time":1725552302992,"pid":36751,"hostname":"Criss-Macbook-Pro.local","msg":"Server started on port 8080"}
{"level":30,"time":1725552304937,"pid":36751,"hostname":"Criss-Macbook-Pro.local","req":{"id":1,"method":"GET","url":"/","query":{},"params":{},"headers":{"host":"localhost:8080","user-agent":"curl/8.4.0","accept":"*/*"},"remoteAddress":"::1","remotePort":63898},"res":{"statusCode":200,"headers":{"content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=15552000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","access-control-allow-origin":"*","cache-control":"no-cache","content-type":"application/json; charset=utf-8","content-length":"107","etag":"W/\"6b-wJF9oNwYCW2i+mCj6tlSPjPFJ1Y\"","vary":"Accept-Encoding"}},"responseTime":6,"msg":"request completed"}
{"level":30,"time":1725552310789,"pid":36751,"hostname":"Criss-Macbook-Pro.local","req":{"id":2,"method":"GET","url":"/","query":{},"params":{},"headers":{"host":"localhost:8080","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8","accept-language":"en-US,en;q=0.5","accept-encoding":"gzip, deflate, br, zstd","connection":"keep-alive","cookie":"csrftoken=y3eSNHcq7WXoKo8fRjo38UEb9CaDVWbD; ajs_anonymous_id=e78c0579-7a37-4154-8645-dc38b338965e; __clerk_db_jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJkdmJfMmhzT3RyMzJnNmFHbERIRW83Q0c0TkRQQnBEIn0.qk28UgXrUtx0mzmHICAK_q6NVZRSglcx0HLhFJS71vqHhQVUQd0Y77ozMOPaxbhSKjlrKc5oHK74-E-NFrreIKia4NXgGH6oGnE-oca2sGlYQKFyYtmLmflXE4F_k_o9s7LTMKrttVamVrs2yrDxYQvQySkEl4SO4C9F2jW41bM0_JAnlFYtzPzU4X7g62D4Z-8swgxuaSoANbWPqIJnWKMA6L5O6hCRWqnbMPIC_8h4CX5F-L2Azjf8GUurVlIla7UAVYU_hSq_JmWBPVjUDZ0kzKi2vZPxBupqdvVbEZ1zSQOHa9PfyFVRv9Z2tWIRpwKBQd3R7E-N2oixKtj6PA; __clerk_db_jwt_gBDWTzEu=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJkdmJfMmhzT3RyMzJnNmFHbERIRW83Q0c0TkRQQnBEIn0.qk28UgXrUtx0mzmHICAK_q6NVZRSglcx0HLhFJS71vqHhQVUQd0Y77ozMOPaxbhSKjlrKc5oHK74-E-NFrreIKia4NXgGH6oGnE-oca2sGlYQKFyYtmLmflXE4F_k_o9s7LTMKrttVamVrs2yrDxYQvQySkEl4SO4C9F2jW41bM0_JAnlFYtzPzU4X7g62D4Z-8swgxuaSoANbWPqIJnWKMA6L5O6hCRWqnbMPIC_8h4CX5F-L2Azjf8GUurVlIla7UAVYU_hSq_JmWBPVjUDZ0kzKi2vZPxBupqdvVbEZ1zSQOHa9PfyFVRv9Z2tWIRpwKBQd3R7E-N2oixKtj6PA; __session=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yaHNORThiS0wzTWRlVU5SMzAxaEVmdjY3RE8iLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3MjE4NTQzMzcsImlhdCI6MTcyMTg1NDI3NywiaXNzIjoiaHR0cHM6Ly93b3JrYWJsZS1tb25rZmlzaC0yNi5jbGVyay5hY2NvdW50cy5kZXYiLCJuYmYiOjE3MjE4NTQyNjcsInNpZCI6InNlc3NfMmpoenA3NkltMmJZTDNJeTZFUUlvckVCTDdtIiwic3ViIjoidXNlcl8yaHNWaTMxQzNJM0tGN0ZKNTFoblo1dFpQZWcifQ.ZgBDiT6owsA952XQjWtnPqjv5yhg2YMVgxRoM5q8Z5iEaM8DLXZQnxaBM2GXpuODazpZFAH0rQ2aqJUjTEtbBvBfxrP94hRr84cUBlkjKUom4ihQ3XgPViMKHSbebUmLzWfZgGxjP1R0oFuWFTHyuIPsbZtZ9qpu1nFIb8oWK3uW8FDax4YsN_tA5u_em5TGSg4a4lzJeCIDu73pWBEuhwXgkF7TkfIa6Pk-fX4f9eCkv3-DHaatrwX2kUEZjolkNg9nOYLqjD7B3BhmaKzfddpMg1VexIX350LetZIb3FYKgZWh43v-aWQLvfbDaYSGx7TzAagqXCpGuuiVL4y75w; __session_gBDWTzEu=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yaHNORThiS0wzTWRlVU5SMzAxaEVmdjY3RE8iLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3MjE4NTQzMzcsImlhdCI6MTcyMTg1NDI3NywiaXNzIjoiaHR0cHM6Ly93b3JrYWJsZS1tb25rZmlzaC0yNi5jbGVyay5hY2NvdW50cy5kZXYiLCJuYmYiOjE3MjE4NTQyNjcsInNpZCI6InNlc3NfMmpoenA3NkltMmJZTDNJeTZFUUlvckVCTDdtIiwic3ViIjoidXNlcl8yaHNWaTMxQzNJM0tGN0ZKNTFoblo1dFpQZWcifQ.ZgBDiT6owsA952XQjWtnPqjv5yhg2YMVgxRoM5q8Z5iEaM8DLXZQnxaBM2GXpuODazpZFAH0rQ2aqJUjTEtbBvBfxrP94hRr84cUBlkjKUom4ihQ3XgPViMKHSbebUmLzWfZgGxjP1R0oFuWFTHyuIPsbZtZ9qpu1nFIb8oWK3uW8FDax4YsN_tA5u_em5TGSg4a4lzJeCIDu73pWBEuhwXgkF7TkfIa6Pk-fX4f9eCkv3-DHaatrwX2kUEZjolkNg9nOYLqjD7B3BhmaKzfddpMg1VexIX350LetZIb3FYKgZWh43v-aWQLvfbDaYSGx7TzAagqXCpGuuiVL4y75w","upgrade-insecure-requests":"1","sec-fetch-dest":"document","sec-fetch-mode":"navigate","sec-fetch-site":"cross-site","sec-fetch-user":"?1","priority":"u=0, i"},"remoteAddress":"::ffff:127.0.0.1","remotePort":63908},"res":{"statusCode":200,"headers":{"content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=15552000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","access-control-allow-origin":"*","cache-control":"no-cache","content-type":"application/json; charset=utf-8","content-length":"107","etag":"W/\"6b-wJF9oNwYCW2i+mCj6tlSPjPFJ1Y\"","vary":"Accept-Encoding"}},"responseTime":1,"msg":"request completed"}
```

Next, try running curl http://localhost:8080 in another terminal (tip: use curl.exe vs. curl in Power Shell):

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ curl localhost:8080                         ─╯
{"status":"ok","author":"CRISHUYNH","githubUrl":"https://github.com/CrisH2307/fragments","version":"0.0.1"}%
```

Next, install jq and pipe the CURL output to it, which will pretty-print the JSON (NOTE: the -s option silences the usual output to CURL, only sending the response from the server to jq):

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ brew install jq                             ─╯
==> Downloading https://formulae.brew.sh/api/formu
########################################### 100.0%
==> Downloading https://formulae.brew.sh/api/cask.
########################################### 100.0%
Warning: jq 1.7.1 is already installed and up-to-date.
To reinstall 1.7.1, run:
  brew reinstall jq

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ jq --version                                ─╯
jq-1.7.1

─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ curl -s localhost:8080 | jq                 ─╯
{
  "status": "ok",
  "author": "CRISHUYNH",
  "githubUrl": "https://github.com/CrisH2307/fragments",
  "version": "0.0.1"
}

```

The jq utility is a powerful way to format, query, and transform JSON data. See the jq tutorial for more info about how to use it.
Finally, confirm that your server is sending the right HTTP headers. In the browser, open the Dev Tools and Network tab, then look for the Cache-Control and Access-Control-Allow-Origin (i.e., CORS) headers. Do the same thing with CURL using the -I flag or -i flag:

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ curl -i localhost:8080                      ─╯
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Cache-Control: no-cache
Content-Type: application/json; charset=utf-8
Content-Length: 107
ETag: W/"6b-wJF9oNwYCW2i+mCj6tlSPjPFJ1Y"
Vary: Accept-Encoding
Date: Thu, 05 Sep 2024 16:44:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"ok","author":"CRISHUYNH","githubUrl":"https://github.com/CrisH2307/fragments","version":"0.0.1"}%
```

Once you are satisfied that your code is working, stop the server (CTRL + c) and add and commit the files you've updated:

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git status
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git add package-lock.json package.json src/app.js src/server.js

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git commit -m "Initial work on express app and server"
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

### Server Startup Scripts

---

23. Install the nodemon package, so we can automatically reload our server whenever the code changes (NOTE: if you're using TypeScript instead of JavaScript, be aware of the tsc-watch package, which does something similar). Because this is a Development Dependency (i.e., not needed for running our code), we use --save-dev vs. --save:

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ npm install --save-dev nodemon              ─╯

up to date, audited 278 packages in 1s

44 packages are looking for funding
  run `npm fund` for details

5 vulnerabilities (3 moderate, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
```

24. Add some npm scripts to package.json in order to automatically start our server. The start script runs our server normally; dev runs it via nodemon, which watches the src/\*\* folder for any changes, restarting the server whenever something is updated; debug is the same as dev but also starts the node inspector on port 9229, so that you can attach a debugger (e.g., VSCode):

```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint \"./src/**/*.js\"",
  "start": "node src/server.js",
  "dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
},
```

Try starting your server using all three methods, and use CTRL + c to stop each:

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ npm start                                                          ─╯

> fragments@0.0.1 start
> node src/server.js

{"level":30,"time":1725554926438,"pid":40293,"hostname":"Criss-Macbook-Pro.local","msg":"Server started on port 8080"}
^C

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ npm run dev                                                        ─╯

> fragments@0.0.1 dev
> LOG_LEVEL=debug nodemon ./src/server.js --watch src

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./src/server.js`
[12:49:22.409] INFO (40325): Server started on port 8080
^C

╭─ ~/Doc/Se/D/Lab1/fragments  on main ⇡3 !1 ─── INT х  at 12:49:23 pm ─╮
╰─ npm run debug                                                      ─╯

> fragments@0.0.1 debug
> LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node --inspect=0.0.0.0:9229 ./src/server.js`
Debugger listening on ws://0.0.0.0:9229/fa149715-ddc5-4fd8-9dae-867170d10574
For help, see: https://nodejs.org/en/docs/inspector
[12:49:37.841] INFO (40375): Server started on port 8080

```

The debug script allows you to connect a debugger (e.g., VSCode) to your running process. In order to set this up, add a new file to your .vscode/ folder named launch.json, with the following contents:

```
// .vscode/launch.json

{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    // Start the app and attach the debugger
    {
      "name": "Debug via npm run debug",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run-script", "debug"],
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```

Try setting a breakpoint in your Health Check route (src/app.js) (i.e., on the line res.status(200).json({) and start the server via VSCode's debugger. Use curl/curl.exe or your browser to load http://localhost:8080 and watch your breakpoint get hit.

Once you are satisfied that all of the scripts work, add and commit the files you've changed to git:

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git status
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
 ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git add package-lock.json package.json .vscode/

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git commit -m "Add startup scripts, nodemon, and VSCode debug launch config"
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")

╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git push                                    ─╯
Enumerating objects: 22, done.
Counting objects: 100% (22/22), done.
Delta compression using up to 12 threads
Compressing objects: 100% (16/16), done.
Writing objects: 100% (16/16), 33.75 KiB | 16.88 MiB/s, done.
Total 16 (delta 6), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (6/6), completed with 2 local objects.
To https://github.com/CrisH2307/fragments.git
   8424e43..83016bc  main -> main

```

25. Update the README.md file to include instructions on how to run the various scripts you just created (i.e., lint, start, dev, debug). Include everything you think you might forget. You're going to spend a lot of time working in this code, so it's a good idea to document everything you can. Good docs are better than faulty memories! Marks will be deducted if your README is incomplete.

When you're done, add and commit your doc changes:

```
git add README.md
git commit -m "Update README with details on running the server"
```

26. Push

```
╭─ ~/Doc/Se/D/L/fragments  on main ⇡3 !1
╰─ git push                                    ─╯
Enumerating objects: 22, done.
Counting objects: 100% (22/22), done.
Delta compression using up to 12 threads
Compressing objects: 100% (16/16), done.
Writing objects: 100% (16/16), 33.75 KiB | 16.88 MiB/s, done.
Total 16 (delta 6), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (6/6), completed with 2 local objects.
To https://github.com/CrisH2307/fragments.git
   8424e43..83016bc  main -> main
```
