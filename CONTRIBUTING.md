## Releasing a new version
1. Submit new PR
2. Merge PR to main branch
3. The build will run and push a new pre-release version to NPM so you can install and test your changes
4. Checkout to main branch
5. Run `npm version [major|minor|patch]`. We should follow [semver](https://semver.org/) for versioning
6. Run `git push --tags`
7. The build will run and publish a new stable version to NPM.
