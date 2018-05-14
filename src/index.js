"use strict";

const React = require("react");
const { clipboard, nativeImage } = require("electron");
const { memoize } = require("cerebro-tools");
const Preview = require("./Preview.jsx").default;
const md5 = require("md5");
const _ = require("lodash");
const Sound = require("react-sound").default;
const icon = require("./assets/icon.png");
const log = require("loglevel");
log.setLevel("silent");

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

    display({
      icon,
      id: "dict-loading",
      title: `${q} - ${translated.translation[0]}`,
      getPreview: () => <Preview {...translated} />
    });

    if (translated.l === youdao_zh_2_en) {
      let explains = translated.basic.explains;
      let webExplains = translated.web;

      let ret = show_basic_explain(explains, display);
      ret = _.uniq(_.concat(ret, show_web_explain(webExplains, display)));
      log.debug("query ret is:", ret);
      ret.forEach((value, index) => {
        display({
          icon,
          id: "dict-explains" + value,
          title: `[copy] ${value}`,
          onSelect: () => {
            clipboard.writeText(value);
          }
        });
      });
    }
  });
}

function show_basic_explain(explains, display) {
  if (explains && explains.length > 0) {
    let ret = [];
    explains.forEach((data, index) => {
      const match = data.match(/^\[.*\] (.+)$/);
      let data_remove_identification = match ? match[1].trim() : null;
      if (data_remove_identification == null) {
        data_remove_identification = data;
      }
      let data_after_separate = data_remove_identification.split(/[；；。.]/);
      if (data_after_separate && data_after_separate.length > 0) {
        data_after_separate.forEach((value, index) => {
          if (value && value.length > 0) {
            ret[ret.length] = value;
            // display({
            //   icon,
            //   id: "dict-explains" + value,
            //   title: `[copy] ${value}`,
            //   onSelect: () => {
            //     clipboard.writeText(value);
            //   }
            // });
          }
        });
      }
    });
    return ret;
  } else {
    return [];
  }
}

function show_web_explain(webExplains, display) {
  let ret = [];
  if (webExplains && webExplains.length > 0) {
    let firstValue = webExplains[0].value;
    firstValue.forEach((data, index) => {
      ret[ret.length] = data;
      // display({
      //   icon,
      //   id: "dict-web-explains" + data,
      //   title: `[copy] ${data}`,
      //   onSelect: () => {
      //     clipboard.writeText(data);
      //   }
      // });
    });
  }
  return ret;
}

const searchDict = memoize(query_youdao);

var debounce_searchDict = _.debounce(searchDict, 800, { trailing: true });

const queryFromTerm = term => {
  const match = term.match(/^youdao (.+)$/);
  return match ? match[1].trim() : null;
};

const queryFromTermShortcurt = term => {
  const match = term.match(/^d (.+)$/);
  return match ? match[1].trim() : null;
};

export const fn = ({ term, display }) => {
  // Put your plugin code here
  let query = queryFromTerm(term);

  if (!query) {
    query = queryFromTermShortcurt(term);
    if (!query) {
      return;
    }
  }

  display({ icon, id: "dict-loading", title: "Searching Youdao dict ..." });

  debounce_searchDict(query, display);
};
