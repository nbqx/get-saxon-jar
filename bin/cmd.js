#!/usr/bin/env node
var fs = require('fs'),
    path = require('path');
var me = require('../');
var argv = require('yargs').argv,
    clc = require('cli-color');

var opts = {
  mode: 0,
  out: 'vendor/saxon9he.jar'
};

if(argv.l || argv.list) opts.mode = 1;
if(argv.o || argv.out) opts.out = argv.o || argv.out;

if(argv.h || argv.help){
  fs.createReadStream(__dirname+'/usage.txt').pipe(process.stdout);
}

var localJarPath = path.resolve(process.cwd(),opts.out);

if(opts.mode===1){
  console.log(clc.green('Get Versions From metadata.xml...'));
  me.getSelectedVersion(function(err,version){
    if(err) return console.log(clc.red(err.toString()));
    console.log(clc.green('Starting Download...'));
    me.downloadFromRepo(version,localJarPath,function(err){
      if(err) return console.log(clc.red(err.toString()));
      console.log(clc.green('Downloading Done: ')+localJarPath);
    });
  });
}else{
  console.log(clc.green('Get Latest Version From metadata.xml...'));
  me.getLatestReleaseVersion(function(err,version){
    if(err) return console.log(clc.red(err.toString()));
    console.log(clc.green('Starting Download...'));
    me.downloadFromRepo(version,localJarPath,function(err){
      if(err) return console.log(clc.red(err.toString()));
      console.log(clc.green('Downloading Done: '+localJarPath));
    });
  });
}
