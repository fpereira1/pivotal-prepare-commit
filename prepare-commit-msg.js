#!/usr/bin/env babel-node

const {writeFileSync} = require('fs');
const {get} = require('request');

const {PIVOTAL_TOKEN, PIVOTAL_INITIALS, PIVOTAL_PROJECTID} = process.env;

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

  var contents = `

#
#
# From here you can use any of these templates
# if they are commented out they appear in the commit message
#
# Go ahead an un-comment the ticket you worked on!
  `;

  contents += "\n\n" + json.join("\n\n# ---\n\n");

  // write contents back out to .git/COMMIT_EDITMSG
  writeFileSync(process.argv[2], contents);

  process.exit(0);

});
