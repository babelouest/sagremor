var gulp = require('gulp');
var config = require('./config');
var gulpAppBuildTasks = require('gulp-app-build-tasks');

gulpAppBuildTasks.apply(config, gulp);
