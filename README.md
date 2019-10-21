# github-label

[![NPM version](http://img.shields.io/npm/v/github-label.svg)](https://www.npmjs.org/package/github-label)
[![license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/codenameyau/github-label/blob/master/LICENSE)

Node CLI to clone, create or remove GitHub labels. Add screenshot with confirmation prompt.

Predefined label examples are available in the [examples folder](https://github.com/codenameyau/github-label/tree/master/examples).

## Installation and Setup
```
npm install -g github-label
```

### Authentication with GitHub Access Token
Use this method if don't want to type your username and password.

Create a [Personal access token](https://github.com/settings/tokens) on GitHub
with the `repo` and `public_repo` permissions enabled. Then add the following
environment variable in your `.bashrc` (Linux) or `.bash_profile` (Mac).

```bash
export GITHUB_LABEL_TOKEN='REPLACE THIS WITH YOUR TOKEN'
```

## Usage Examples

Clone and replace all labels from one repository to another.

```sh
gh-label --clone https://github.com/facebook/react --to https://github.com/codenameyau/github-label
```

Other usage.
```
Usage: gh-label [options]

Options:

  -h, --help            output usage information
  -V, --version         output the version number
  -j, --json [value]    Specify your own JSON label preset.
  -s, --skip            Skip existing labels instead of updating them.
  -r, --remove          Remove a GitHub label preset.
  -R, --remove-all      Removes all labels.
```

## Other Usages
When specifying the GitHub repository, you can either use the shorthand or full url.

```bash
# Output the labels for the repository. Both are the same.
gh-label 'codenameyau/github-label'
gh-label 'https://github.com/codenameyau/github-label'

# Create labels by specifying your own JSON.
gh-label 'codenameyau/github-label' --create-from 'path-to/labels.json'

# Delete all labels from a given json file.
gh-label 'codenameyau/github-label' --remove-from 'path-to/labels.json'

# Remove all labels.
gh-label 'codenameyau/github-label' --remove-all
```
