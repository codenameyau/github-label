# github-label

[![NPM version](http://img.shields.io/npm/v/github-label.svg)](https://www.npmjs.org/package/github-label)
[![license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/codenameyau/github-label/blob/master/LICENSE)

Node command-line tool used to create or remove GitHub labels.
Predefined labels are available in the [presets folder](https://github.com/codenameyau/github-label/tree/master/presets).
You can also create and use your own labels with JSON.

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
Here a few examples. See the [presets directory](https://github.com/codenameyau/github-label/tree/master/presets)
for a list of available predefined label presets.

##### Output current labels
```
github-label 'codenameyau/github-label'
```

##### Create labels with the available presets
```
github-label 'codenameyau/github-label' -p priority
```

##### Create labels by specifying your own JSON preset
```
github-label 'codenameyau/github-label' -j 'path-to/preset.json'
```
