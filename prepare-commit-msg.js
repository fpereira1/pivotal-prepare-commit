#!/usr/bin/env babel-node

const {writeFileSync} = require('fs');
const {get} = require('request');

const {PIVOTAL_TOKEN, PIVOTAL_INITIALS, PIVOTAL_PROJECTID} = process.env;

[PIVOTAL_TOKEN, PIVOTAL_INITIALS, PIVOTAL_PROJECTID].forEach((item) => {
  if(!item) {
    throw new Error('Environment variables missing. Please folow the instructions in the README.md');
  }
});

let pivotalBase = 'https://www.pivotaltracker.com';
let pivotalPath = '/services/v5/projects/' + PIVOTAL_PROJECTID + '/stories';
let pivotalQuery = '?fields=name,story_type&filter=state:started owner:' + PIVOTAL_INITIALS;

get({
  url : pivotalBase + pivotalPath + pivotalQuery,
  json : true,
  headers : {
    'X-TrackerToken' : PIVOTAL_TOKEN
  }
}, function(err, response, json) {
  if(err) {
    throw new Error(err);
  }
  json = json.map((item) => {
    return `
# ${item.story_type.toUpperCase()}  ${item.name}
#
# [Finishes # ${item.id}]`;
  });

  var contents = "\n\n" + json.join("\n\n# ---\n\n");

  // write contents back out to .git/COMMIT_EDITMSG
  writeFileSync(process.argv[2], contents);

  process.exit(0);

});
