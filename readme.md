### Europasat Bandwidth Usage Scraper

I built this to keep track of my reported bandwidth usage on the satellite
ISP SES, sold by Europasat in the UK. I'm limited to 50Gb per month, but also
have unlimited, unrestriced downloads during the night. I want to keep track and
ensure that nothing I download during the night goes towards my usage.

To set up you'll need to be on OS X, have homebrew, casperjs and node installed.

```
brew install casperjs
```

You'll want to set it up as a crobjob using `crontab` too. I have it scraping
and saving values every 30 minutes.
