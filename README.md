# (Simple) Predix Web App Starter

**Warning:** This application was not built by the Predix UI team. Use at your own risk!

# Description
This project is a barebones Predix web application built from the [PredixDev/predix-webapp-starter](https://github.com/PredixDev/predix-webapp-starter). This project is intended to work alongside the [PredixDev/predix-webapp-starter](https://github.com/PredixDev/predix-webapp-starter) but not replace. You should only use this application if you want a clean, simple Predix web application. If you intend to use UAA or Timeseries I recommend using [this](https://github.com/PredixDev/predix-webapp-starter) starter application.

> I recommend starting with this application, customizing it to your needs, and then use specific pieces of the [PredixDev/predix-webapp-starter](https://github.com/PredixDev/predix-webapp-starter) that you need for your project.

# Installation
### Get the source code
Make a directory for your project.  Clone or download and extract the starter in that directory.
```
git clone https://github.build.ge.com/212460520/predix-webapp-starter--simple.git
cd predix-webapp-starter--simple
```

### Install tools
If you don't have them already, you'll need node, bower and gulp to be installed globally on your machine.  

1. Install [node](https://nodejs.org/en/download/).  This includes npm - the node package manager.  
2. Install [bower](https://bower.io/) globally `npm install bower -g`  
3. Install [gulp](http://gulpjs.com/) globally `npm install gulp-cli -g`  

### Install the dependencies
Change directory into the new project you just cloned, then install dependencies.
```
npm install
bower install
```
## Running the app locally
The default gulp task will start a local web server.  Just run this command:
```
gulp
```
Browse to http://localhost:5000.
