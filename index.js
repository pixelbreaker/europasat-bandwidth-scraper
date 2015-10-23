
var credentials = require('credentials.js');
var startURL = 'https://www.europasat.com/accounts/clientarea.php';
var buttonText = 'Usage Graph';

var casper = require('casper').create();
var statsPageUrl = 'https://www.europasat.com/accounts/';

casper.start(startURL, function(){
  this.echo(credentials);
  this.fill('form[action="dologin.php"]', credentials, true);
})

function getLink() {
  var link = document.querySelector('a[href^="clientarea.php?action=productdetails"]');
  return link.getAttribute('href');
}

casper.then(function(){
  statsPageUrl += this.evaluate(getLink);
  console.log('statsPageUrl:', statsPageUrl);
  casper.open(statsPageUrl);
});

casper.waitFor(function() {
  return this.evaluate(function() {
    return !!document.querySelector('.ses-chart .panel:first-child .zone1 .pointer-label');
  });
}, function() {
  var downloadUsage = this.evaluate(function() {
    return document.querySelector('.ses-chart .panel:first-child .zone1 .pointer-label').childNodes[0].nodeValue.trim();
  });
  console.log('downloadUsage:', downloadUsage);
});
// casper.then(function(){
//   var downloadUsage = this.evaluate(function(){
//     return document.querySelector('.ses-chart .panel:first-child .zone1 .pointer-label').childNodes[0].nodeValue.trim();
//   });
//   console.log('downloadUsage:', downloadUsage);
// })






casper.run();
