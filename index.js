var fs = require('fs');
var moment = require('moment');

var credentials = require('credentials.js');
var startURL = 'https://www.europasat.com/accounts/clientarea.php';
var logfile = "usage.log";

var casper = require('casper').create();
var statsPageUrl = 'https://www.europasat.com/accounts/';

// console.log(fs.appendFile);

casper.start(startURL, function(){
  this.fill('form[action="dologin.php"]', credentials, true);
})

function getLink() {
  var link = document.querySelector('a[href^="clientarea.php?action=productdetails"]');
  return link.getAttribute('href');
}

function stripAmount(amount){
  return parseInt(amount.trim().replace(',',''));
}

casper.then(function(){
  statsPageUrl += this.evaluate(getLink);
  casper.open(statsPageUrl);
});

casper.waitFor(function() {
  return this.evaluate(function() {
    return !!document.querySelector('.ses-chart .panel:last-child .zone1 .pointer-label');
  });
}, function() {
  var usage = {
    download: this.evaluate(function() { return document.querySelector('.ses-chart .panel:first-child .zone1 .pointer-label').childNodes[0].nodeValue; }),
    upload: this.evaluate(function() { return document.querySelector('.ses-chart .panel:last-child .zone1 .pointer-label').childNodes[0].nodeValue; })
  }
  var timestamp = moment().format("YYYY-MM-DD HH:mm Z");
  if(!fs.isFile(logfile)) fs.touch(logfile);
  fs.write(logfile, stripAmount(usage.download) + ',' + stripAmount(usage.upload) + ',' + timestamp + '\n', 'a');
});

casper.run();
