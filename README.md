# Pivotal tracker prepare commit

A simple git hook script that pre-populates your commit messages with the details
of a story started in Pivotal Tracker.

## Install

1. Install [babel-cli](https://babeljs.io) `npm install -g babel-cli`

2. Clone the repository

3. `npm install` on the project

Setup the necessary environment variables:

```
export PIVOTAL_TOKEN=""
export PIVOTAL_PROJECTID=""
export PIVOTAL_INITIALS=""
```

## Installing a hook

You'll need to symlink the git's pre commit message file in `.git/hooks/prepare-commit-msg` to the `prepare-commit-msg.js` file in this project.
