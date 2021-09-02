## Releasing a new version
1. Submit new PR
2. Merge PR to main branch
3. Checkout to main branch
4. Run `npm version [major|minor|patch]`. We should follow [semver](https://semver.org/) for versioning
5. Run `git push --tags`

Once you push the tag, a Github action will publish the new version to NPM registry
