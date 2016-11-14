# HR - User Profile Updater

This app is aimed to help update user profiles in Tikal's website through updating the user's YAML profile page.

This is basically a YAML editor that is capable of editing and commiting YAML files hosted on Github

## Install

First, clone the repo via git:

```bash
git clone https://github.com/tikalk/hr-emplyee-profile-manager
```

And then install dependencies.

```bash
$ cd hr-emplyee-profile-manager && npm install
```


## Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run watch
$ npm run start
```

## Warning
Be sure not to commit any credential elements into the sourcebase - the github token is stored on a local file which should not be pushed to the repository under any circumstance!!!
