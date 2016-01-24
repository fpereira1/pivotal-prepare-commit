#!/usr/bin/env babel-node

import {readFileSync, writeFileSync} from 'fs';
import {get} from 'request';

const {PIVOTAL_TOKEN, PIVOTAL_INITIALS, PIVOTAL_PROJECTID} = process.env;

[PIVOTAL_TOKEN, PIVOTAL_INITIALS, PIVOTAL_PROJECTID].forEach((item) => {
  if(!item) {
    throw new Error('Environment variables missing. Please folow the instructions in the README.md');
  }
});

var commitFile = process.argv[2];

// read contents from the commit file
var initialContents = readFileSync(commitFile).toString();

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

  var contents = json.join("\n\n\n");

  // write contents back out to .git/COMMIT_EDITMSG
  writeFileSync(commitFile, initialContents + contents);

  process.exit(0);

});
