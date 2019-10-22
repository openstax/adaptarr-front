## Installation and build

We had to modify few of Slate packages to make them work with our configuration, so we are installing everything from our own pkg server.
`yarn install --registry https://npm.pkg.naukosfera.com`

If you are using `yarn.lock` file which is included in this repo you can also just use `yarn` command.

Build with `yarn build`. All files will be moved to `./build/*`

## Starting dev server

1. Install and start [adaptarr-server](https://github.com/openstax-poland/adaptarr-server/)
2. Run `yarn start`

Please make sure that you have configured nginx to handle server and web app on the same domain.
Example configuration for nginx:
```
upstream adaptarr {
  server 0.0.0.0:8080;
}
upstream front {
  server 0.0.0.0:3000;
}
server {
  listen 80;
  listen [::]:80;
  server_name adaptarr.test;
  root /dev/null;
  try_files $uri @front;
  client_max_body_size 400M;
  location @front {
    proxy_set_header X-Forwarded_Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_pass http://front;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_redirect http:// $scheme://;
  }
  location ~ ^/api/v1/(events|conversations/.+/socket) {
    proxy_set_header X-Forwarded_Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_pass http://adaptarr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
  location ~ ^/(login|logout|api|register|reset|elevate|join) {
    proxy_set_header X-Forwarded_Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_pass http://adaptarr;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_redirect http:// $scheme://;
  }
}
```

Please notice that port which we've used for adaptarr server: `8080` should correspond to
configuration in `config.toml` in `adaptarr-server`. The same applies for other variables like `server_name` which will correspond with `domain` in configuration file for server. This domain should be also added in `/etc/hosts`.

## Folder structure and some importat files
```
├── config - webpack config folder.
│    └── jest
├── public - files which should be included in build folder.
│    ├── images
│    └── locale - localization files
│        ├── en
│        │    ├── document.ftl
│        │    └── ui.ftl
│        └── pl
│             ├── document.ftl
│             └── ui.flt
├── scripts - webpack standard scripts.
├── src
│    ├── @types - types declaration for modules which doesn't provide them or our modification of those which does.
│    ├── api - declarations of classes which we use to handle api endpoints.
│    ├── assets - global assets for entire application. For now there are only global styles.
│    ├── components - components which will be used in more than one place.
│    ├── config - we hold here custom axios instance and sentry configuration files.
│    ├── containers - large components which are kind of containers for many different components.
│    ├── helpers - small helper functions for different components.
│    ├── hooks - our custom react hooks used across application.
│    ├── locale
│    │    └── data.json - cases, languages (used in app), allLanguages - code and names for all languages.
│    └── screens - folder with components handling routes.
│    │    └── app
│    │        ├── Book - `/book/:id`
│    │        ├── Books - `/books`
│    │        ├── Dashboard - `/`
│    │        ├── DraftDetails - `/draft/:id`
│    │        ├── Draft - `/draft/:id/:action` - `action: 'edit' | 'view`
│    │        ├── Error404 - `/*`
│    │        ├── Helpdesk - `/helpdesk`
│    │        ├── Invitations -`/invitations`
│    │        ├── Modules - `/modules`
│    │        ├── NotificationsCentre - `/notifications`
│    │        ├── Processes - `/processes`
│    │        ├── Profile - `/users/:id`
│    │        ├── Resources - `/resources`
│    │        ├── Settings - `/settings`
│    │        └── Teams `/teams/:id?/:tab?` - `tab: 'members' | 'roles'`
│    ├── store - redux store.
│    │    ├── actions
│    │    ├── constants
│    │    ├── reducers
│    │    └── types
│    ├── App.tsx - main app component.
│    ├── index.tsx - entry file for whole application.
│    ├── l10n.tsx - main component for localization.
│    └── registerServiceWorker.ts
├── images.d.ts
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.prod.json
├── tsconfig.test.json
├── tslint.yaml
└── yarn.lock
```

## Typescript configuration

Configuration of typescript is inside `tsconfig.json`.

If you want to add custom configuration for production or tests, please use `tsconfig.prod.json` and `tsconfig.test.json`

## Main standards

- Use `.tsx` files if you are using `React` in those files and `.ts` if you are not.

- Reusable components for which there is chance that they will be used in other places should be created in `/src/components`.

- Large components, which are using multiple of smaller components and / or containing more advanced logic are hold in `/src/containers`.

- Components which are part of other component / container should be created in separate `components` folder inside their parent.

- We are using BEM methodology for managing styles. Global styles are hold in `/src/assets/styles/shared.css`, rest of them should be created directly in component folder in `index.css` file.

- Do not use semicolons. If you have to, use them at the beginning of next line.

- Use `axios` instances from `src/config/axios` to make api calls.

- If you are writing helper function for some component, take a moment and think if this function may be useful in other places. If yes - add it to `src/helpers`.

- When importing component from `src/components` or container from `src/containers` please use whole path. When importing "local" component use relative path.

- When writing interfaces for components' props and state should be prefixed with component name and exported (only if necessary), ex. `export interface MyComponentProps {...}`
type

- Use `.tsx` extension for files which are using `react` and `ts` for those which does not.

Please be aware that not all of current files meet those standards yet. If you work on feature which require updating files which doesn't meet standard then feel free to adjust it.

## ESLint and TSLint

We are using ESLint config which was created for our foundations projects: [eslint-config-openstax-poland](https://github.com/openstax-poland/eslint-config-openstax-poland/) and few TSLint rules.

Specific configuration can be found in `.eslintrc.yaml` and `tslint.yaml`

IF you are using VSCode then you can use this additional config for `dbaeumer.vscode-eslint` extension:
`/adaptarr-front/.vscode/settings.json`
```JSON
{
  "eslint.autoFixOnSave": true,
  "eslint.packageManager": "yarn",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    { "language": "typescript", "autoFix": true },
    { "language": "typescriptreact", "autoFix": true }
  ]
}
```

Please run `yarn lint` before commiting to make sure that there are no lint errors.

## Localization

We are using [Fluent](https://projectfluent.org) for localization. All files with texts are hold in `plublic/locale/` in proper folders. We are using separate files for texts inside web application - `ui.ftl` and in the document (`/drafts/:id/:action`) - `document.ftl`.

When you are adding new text to the application, please remember about adding placeholder value:
`<Localized id="l10nId">Placeholder value</Localized>`

Most of the time `id` will be descriptive enough, but if you have doubts if you or someone else will understand what did you mean month later, then just add description above `id`.

Always remember to add description for used `Variables` and `Fragments`:
```
# Variables ($kind = assigned):
# - $actor (string): name of the user who assigned $module to recipient
#
# Fragments ($kind = assigned):
# - <actor> ... </actor>: link to actor's profile
```

## Api classes

We are using classes to handle communication with api. All of them are in `src/api/*`.

Most of data which application needs to work is prefeched when app is loading in - `App.tsx` - and pushed to the global store.

For example, we are fetching list of modules, books, users etc. All of those are transofrmed into proper classes so for example when user enters `/books/` we are displaying already fetched books list taken from the global store and pass `book` instances of `Book` to the `<BookCard>` component which then uses class methods to update title, content or delete this book.

Those prefetched lists are useful in many cases, because data from them is used in more than one place.

## Redux store

All files are inside `src/store`.

Store is divided to `actions`, `constants`, `reducers`, `types` folders and have main `index.ts` file.

### How to add new methods to the store:

1. Add proper `const` and `type` to `src/store/constants/index.ts`
2. Add `interface` for your action.
3. Add this interface to then main `export type <<Name>>Action = ...`
4. Create `const` function with return type of your interface.
5. Create `reducer` in `src/store/reducers/...` based on other reducers.
6. Add your reducer into `src/store/reducers/index.ts`.

### How to import from the store:

Dispatch actions directly by importig `store` and given `action`:
```js
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

store.dispatch(addAlert('success', 'l10n-id-for-success-message'))
```

Add imported values as props to the component:
```js
import { connect } from 'react-redux'
import { State } from 'src/store/reducers/'
import { FetchBooksMap, fetchBooksMap } from 'src/store/actions/Books'

interface ComponentNameProps {
  booksMap: {
    isLoading: IsLoading
    booksMap: BooksMap
  }
  fetchBooksMap: () => void
}

export const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

export const mapDispatchToProps = (dispatch: FetchBooksMap) => {
  return {
    fetchBooksMap: () => dispatch(fetchBooksMap()),
  }
}

class ComponentName extends React.Component<ComponentNameProps> {
  componentDidMount() {
    this.props.fetchBooksMap()
  }

  componentDidUpdate() {
    if (!this.props.booksMap.isLoading) {
      // Loading done, print booksMap.
      console.log(this.props.booksMap.booksMap)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentName)
```

## Sentry

We are using [Sentry](https://sentry.io/welcome/) to monitor exceptions on staging and production server.

Config file is in `src/config/sentry.ts`.

Unhandled errors will be catched by `ErrorBoundary` component which will send an error to the server and give user possibilty to attach report.

## Tests

We do not have any tests yet. There are placeholder files like `tsconfig.test.json` and `App.tst.tsx` which might be our starting point when we decide to write tests.

## Service worker

We were using service worker but it was disabled for now since it was causing too many problems with refreshing cache after updates. However we will probably want to use it again we we will have time to configure it properly.


# Adding new component in few steps

1. Will this component be used in more than one place? For example in more than one screen or containers? Yes - put it in `src/components` | No - it should be in parent directory in `./components` folder.

2. How to name it? Simple ideas are often the best. Use your first thought and update it if better idea will come to your mind.

3. Import modules / helpers / components etc. in given order:
- npm modules,
- api classes,
- redux store actions, types,
- helpers and hooks,
- local components,
- global components,
- containers,
- other files,
- css.
Start from "all" imports: `import * as XXX from 'xxx'`,
then default imports: `import XXX from 'xxx'`,
at then end partial imports: `import { xxx } from 'xxx'`.

4. Declare and export (optional) type for component' props, ex: `export interface MyComponentProps {...}`.

5. If you will be using redux, please declare `mapStateToProps` / `mapDispatchToProps` in this place.

6. Write your component. If it will be class component, remember of `private` and `public` keywords befor methods.

7. Export component as default.

8. If you have to create small, local helper component like `OptionLabel` for `Select` then you can declare it under the export line.
