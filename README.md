# dontfollowme

A CLI for determining who doesn't want to be your instagram friend anymore. View unfollows, new follows, and non mutual follows. 

## Installation
This isn't up on npm yet, so the simplest way to use this at the moment is to clone this repo and run
```npm install```
Navigate to the root directory of the repo and run the command with `bin/dontfollowme` 

## Usage

Before each command define the env variables `IG_PASSWORD` and `IG_USERNAME` or export them like so
```
$ export IG_PASSWORD=mypassword
$ export IG_USERNAME=myusername
```
There are two main commands:

**Compare**: This shows new follows and unfollows. If you're running this for the first time you won't be able to see any new data since we diff a saved list of followers with an active / current list. 
```
$ bin/dontfollowme compare
```

**Not Friends**: Determine who doesn't follow you back. 
```
$ bin/dontfollowme notfriends
```
