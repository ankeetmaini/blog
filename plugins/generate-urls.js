#!/usr/bin/node

const fs = require('fs');
const parser = require('fast-xml-parser');

const netlifySlug = '${{ steps.netlify.outputs.url }}/';
const netlifySlug1 = 'adfdf';
const prodHostname = 'https://ankeetmaini.dev/';

const siteMap = fs.readFileSync('./_site/sitemap.xml').toString();

const dom = parser.parse(siteMap);

const urls = dom.urlset.url
    .filter(u => u && u.loc && !u.loc.includes('/tags/'))
    .map(u => u.loc.replace(prodHostname, netlifySlug1));

console.log(urls);