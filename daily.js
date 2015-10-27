var moment = require('moment');
var AsciiTable = require('ascii-table');
var LineByLine = require('line-by-line');
var lr = new LineByLine('usage.log');

function parseLine(line) {
  var data = line.split(',');
  return {
    download: data[0],
    upload: data[1],
    datetime: moment(data[2], "YYYY-MM-DD HH:mm Z")
  }
}

var table = new AsciiTable('Daily Bandwidth Usage');
table.setHeading('Date', 'Download', 'Upload').setAlign(0, AsciiTable.RIGHT)

var startEntry, pEntry;
var dateFormat = 'ddd DD-MM-YYYY';
lr.on('line', function(line){
  var entry = parseLine(line);
  if(!startEntry) startEntry = entry;
  if(entry.datetime.date() - startEntry.datetime.date() > 0) {
    table.addRow(
      startEntry.datetime.format(dateFormat),
      entry.download - startEntry.download,
      entry.upload - startEntry.upload
    );

    // shift to new day
    startEntry = entry;
  }

  pEntry = entry;
});

lr.on('end', function() {
  if(pEntry!==startEntry) {
    table.addRow(
      startEntry.datetime.format(dateFormat),
      pEntry.download - startEntry.download,
      pEntry.upload - startEntry.upload
    )
  }

  var downloadPerc = Math.round((pEntry.download/42667)*100) + '%'
  var uploadPerc = Math.round((pEntry.upload/8533)*100) + '%'
  table.addRow(
    'Total used: ',
    pEntry.download + ' ('+ downloadPerc +')',
    pEntry.upload + ' ('+ uploadPerc +')'
  );
  console.log(table.toString());
});
