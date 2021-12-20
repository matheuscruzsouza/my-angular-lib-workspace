# MyWorkspace

[![Publish package ngx-gundb to Github Package Registry](https://github.com/matheuscruzsouza/my-angular-lib-workspace/actions/workflows/ngx-gundb.yaml/badge.svg?branch=main)](https://github.com/matheuscruzsouza/my-angular-lib-workspace/actions/workflows/ngx-gundb.yaml)

[![Publish package ngx-text-editor to Github Package Registry](https://github.com/matheuscruzsouza/my-angular-lib-workspace/actions/workflows/ngx-text-editor.yaml/badge.svg?branch=main)](https://github.com/matheuscruzsouza/my-angular-lib-workspace/actions/workflows/ngx-text-editor.yaml)

This project is a workspace to build angular libraries.

## Login from github registry

```bash
npm login --scope=@OWNER --registry=https://npm.pkg.github.com
```

## Install from main repo

```bash
npm install --registry=https://registry.npmjs.org/ 
```

## Local test

to test the library in the local environment, run the following codes:

In the workspace folder:

```sh
ng build <library name> && cd dist/<library name> && npm link && cd ../..
```

In the test project folder:

```sh
npm link <library name> && ng s
```

## To publish

```sh
cd dist/<library name> && npm publish --access public && cd ../..
```

## Links

- Repository: [https://github.com/matheuscruzsouza/my-angular-lib-workspace](https://github.com/matheuscruzsouza/my-angular-lib-workspace)
  - In case of sensitive bugs like security vulnerabilities, please contact
    matheuscruzsouza@gmail.com directly instead of using issue tracker. We value your effort
    to improve the security and privacy of this project!

## Versioning

0.0.1.0

## Authors

- **Matheus Cruz de Souza**: [@matheuscruzsouza - Github](https://github.com/matheuscruzsouza)

Please follow github and join us!
Thanks to visiting me and good coding!
