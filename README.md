# github-label
[![NPM version](http://img.shields.io/npm/v/github-label.svg)](https://www.npmjs.org/package/github-label)

## Installation and Setup
```
npm install -g github-label
```

### Authentication with GitHub Access Token
Use this method if don't want to type your username and password.

Create a [Personal access token](https://github.com/settings/tokens) on GitHub
with the `repo` and `public_repo` permissions scopes enabled. Then add the following
environment variable in your `.bashrc` (Linux) or `.bash_profile` (Mac).

```bash
export GITHUB_LABEL_TOKEN='REPLACE THIS WITH YOUR TOKEN'
```

## Usage Examples
Here a few examples. Please see below for the list of available label presets.

##### Use one of the available label presets
```
github-label 'codenameyau/github-label' -p priority
```

##### Specify your own JSON preset
```
github-label 'codenameyau/github-label' -j 'path-to/preset.json'
```
