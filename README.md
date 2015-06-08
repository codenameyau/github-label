# github-label
Node CLI for creating GitHub labels

## Installation and Setup
```
npm install -g github-label
```

### Authentication with GitHub Access Token
Use this method if don't want to type your username and password.

Create a [Personal access token](https://github.com/settings/tokens) on GitHub
with the `repo` and `public_repo` permission scopes enabled.

Then add the following environment variable in your `.bashrc` / `.bash_profile`

```bash
export GITHUB_LABEL_TOKEN='REPLACE THIS WITH YOUR TOKEN'
```

## Usage Examples
Here a few examples. Please see below for the list of available label presets.

#### Specify label preset:
```
github-label 'codenameyau/github-label' -p priority
```

#### Specify your own JSON preset:
```
github-label 'codenameyau/github-label' -j 'path-to/preset.json'
```
