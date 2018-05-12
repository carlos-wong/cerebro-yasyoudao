"use strict";

const React = require("react");
const debounce = require("p-debounce");
const { memoize } = require("cerebro-tools");
const Preview = require("./Preview.jsx").default;

const { keyfrom, key } = require("./config").youdao;
const qs = require("querystring");
const url = "http://fanyi.youdao.com/openapi.do";

function query_youdao(q) {
  const query = qs.stringify({
    keyfrom,
    key,
    type: "data",
    doctype: "json",
    version: "1.1",
    q
  });
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
