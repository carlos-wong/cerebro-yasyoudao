"use strict";

const React = require("react");
const { clipboard, nativeImage } = require("electron");
const { memoize } = require("cerebro-tools");
const Preview = require("./Preview.jsx").default;
const md5 = require("md5");
const _ = require("lodash");
const Sound = require("react-sound").default;
const icon = require("./assets/icon.png");

const { keyfrom, key } = require("./config").youdao;
const qs = require("querystring");
const url = "http://openapi.youdao.com/api";

const youdao_zh_2_en = "zh-CHS2EN";

function query_youdao(q, display) {
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
  // console.log("dump fetch url is:", url);
  return fetch(`${url}?${query}`).then(async r => {
    // console.log("query r is:", r.json());
    let translated = await r.json();
    console.log("new r is:", translated.l);

    display({
      icon,
      id: "dict-loading",
      title: `${q} - ${translated.translation[0]}`,
      getPreview: () => <Preview {...translated} />
    });

    if (translated.l === youdao_zh_2_en) {
      let explains = translated.basic.explains;
      if (explains && explains.length > 0) {
        explains.forEach((data, index) => {
          display({
            icon,
            id: "dict-explains" + data,
            title: `回车拷贝 ${data}`,
            onSelect: () => {
              clipboard.writeText(data);
            }
          });
        });
      }
    }
  });
}

const searchDict = memoize(query_youdao);

var debounce_searchDict = _.debounce(searchDict, 800, { trailing: true });

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

  display({ icon, id: "dict-loading", title: "Searching Youdao dict ..." });

  debounce_searchDict(query, display);
};
