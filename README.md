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
Here a few examples. I recommend using access tokens. Please see below
for the list of label presets available.

#### With username and password:
```
github-label -u codenameyau -r 'codenameyau/github-label'
```

#### With access token:
```
github-label -r 'codenameyau/github-label'
```

#### Specify label preset:
```
github-label -r 'codenameyau/github-label' -p angular
```

#### Specify your own JSON preset:
```
github-label -r 'codenameyau/github-label' -p 'path-to/preset.json'
```
