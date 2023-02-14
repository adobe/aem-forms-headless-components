# Introduction

This repository provides components for [Headless Adaptive Forms](https://experienceleague.adobe.com/docs/experience-manager-headless-adaptive-forms/using/overview.html?lang=en). You can use these packages with a React or React Native application.

## Versions

Node > 16.X<br/>
NPM > v8.3.1

The steps in this guide are tested against the above versions only. 
If your version is different then please try to upgrade or log an issue to see if that version can be supported.

# Development

## Getting Started

Our recommendation is to use [Node Version Manager](https://github.com/nvm-sh/nvm) so that you can manage multiple
installation of Node/NPM

### Clone the repository

Use `git clone https://github.com/adobe/aem-forms-headless-components` command to clone the repository.

### Bootstrap

Once you have cloned this repository and run the following command at the root directory of this project 

```
npm install
npx lerna bootstrap
```

### Build

```
npx lerna run build
```

### Tests

```
npx lerna run test
```

# Contributing

Please raise an issue and a PR.
