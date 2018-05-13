"use strict";

const React = require("react");
const debounce = require("p-debounce");
const { memoize } = require("cerebro-tools");
const Preview = require("./Preview.jsx").default;
var md5 = require("md5");

const { keyfrom, key } = require("./config").youdao;
const qs = require("querystring");
const url = "http://openapi.youdao.com/api";

function query_youdao(q) {
  var key = "LZFy0Ys97fCnWnb6f439ZD4hj37lOz8c";
  var salt = "ge9wo1si";
  let appKey = "0998295557105306";
  var str1 = appKey + q + salt + key;
  var sign = md5(str1);

  const query = qs.stringify({
    q: q,
    appKey: appKey,
    salt: salt,
    sign: sign,
    type: "data",
    doctype: "json",
    version: "1.1"
  });
  console.log("dump fetch url is:", url);
  return fetch(`${url}?${query}`).then(r => r.json());
}

const searchDict = debounce(memoize(query_youdao), 300);

const queryFromTerm = term => {
  const match = term.match(/^youdao (.+)$/);
  return match ? match[1].trim() : null;
};

export const fn = ({ term, display }) => {
  // Put your plugin code here
  const query = queryFromTerm(term);

  if (!query) {
    return;
  }

  display({ id: "dict-loading", title: "Searching Youdao dict ..." });
  searchDict(query).then(r => {
    console.log("query r is:", r);
    return display({
      id: "dict-loading",
      title: `${query} - ${r.translation[0]}`,
      getPreview: () => <Preview {...r} />
    });
  });
};
