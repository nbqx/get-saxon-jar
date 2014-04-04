var fs = require('fs'),
    should = require('should');
var me = require('../');

describe('get-saxon-jar',function(){
  var jarPath = __dirname+"/saxon.jar";

  describe('getLatestReleaseVersion',function(){
    it('should be `9.5.1-5`',function(done){
      me.getLatestReleaseVersion(function(err,version){
        version.should.be.equal('9.5.1-5');
        done();
      });
    });
  });

  describe('getSelectedVersion',function(){
    var ans = '9.4';
    it('should be selected `9.4`',function(done){
      me.getSelectedVersion(function(err,version){
        version.should.be.equal('9.4');
        done();
      });
    });
  });

  describe('downloadFromRepo',function(){
    it('should download jar file',function(done){
      var version = '9.4';
      me.downloadFromRepo(version,jarPath,function(err){
        fs.exists(jarPath,function(ext){
          ext.should.be.true;
          done();
        });
      });
    });
  });

  after(function(){
    fs.unlinkSync(jarPath);
  });
  
});
