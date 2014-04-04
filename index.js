var fs = require('fs'),
    path = require('path');
var _ = require('underscore'),
    jsdom = require('jsdom'),
    request = require('request'),
    mkdirp = require('mkdirp'),
    clc = require('cli-color'),
    inquirer = require('inquirer');

var repoBaseURL = "http://repo1.maven.org/maven2/net/sf/saxon";
var artifactId = "Saxon-HE";
var metaDataXML = [repoBaseURL,artifactId,"/maven-metadata.xml"].join('/');

function getLatestReleaseVersion(next){
  jsdom.env(metaDataXML,["http://code.jquery.com/jquery.js"],function(err,root){
    if(err) return next(err);
    var version = root.$("metadata versioning release").text();
    if(_.isEmpty(version)){
      var err = new Error("Can't get version");
      return next(err);
    }
    next(null,version);
  });
};

function getSelectedVersion(next){
  jsdom.env(metaDataXML,["http://code.jquery.com/jquery.js"],function(err,root){
    if(err) return next(err);
    
    var vs = root.$("metadata versioning versions version");
    if(_.isEmpty(vs)){
      var err = new Error("Can't get versions");
      return next(err);
    }
    
    var versions = _.map(vs,function(o){ return root.$(o).text() });
    inquirer.prompt([{
      type: "list",
      name: "version",
      message: "choose saxon version",
      choices: versions
    }],function(ans){
      next(null,ans.version);
    });
  });
};

function downloadFromRepo(version, saveAs, next){
  var baseFolder = path.dirname(saveAs);
  mkdirp(baseFolder,function(err){
    var requestURL = [repoBaseURL,artifactId,version,artifactId+"-"+version+".jar"].join('/');
    var jarFile = fs.createWriteStream(saveAs);
    jarFile.on('close',function(){
      next(null);
    });
    var download = request.get(requestURL);
    download.pipe(jarFile);
  });
};

exports.getLatestReleaseVersion = getLatestReleaseVersion;
exports.getSelectedVersion = getSelectedVersion;
exports.downloadFromRepo = downloadFromRepo;

