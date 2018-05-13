import React, { Component } from "react";
import PropTypes from "prop-types";
const Sound = require("react-sound").default;

const play_sound = false;
const youdao_en_2_zh = "EN2zh-CHS";

export default class Preview extends Component {
  render() {
    const { query, basic, web, speakUrl, l } = this.props;
    return (
      <div>
        {() => {
          if (play_sound) {
            return (
              speakUrl && (
                <Sound
                  url={speakUrl}
                  playStatus={Sound.status.PLAYING}
                  playFromPosition={300 /* in milliseconds */}
                />
              )
            );
          }
        }}
        <h2>{query}</h2>
        {basic && (
          <div>
            {l === youdao_en_2_zh && (
              <p>
                音标: {basic["phonetic"]}, uk: {basic["uk-phonetic"]}, us:{" "}
                {basic["us-phonetic"]}
              </p>
            )}

            <h3>基本释义</h3>
            <ul>{basic.explains.map(v => <li key={v}>{v}</li>)}</ul>
          </div>
        )}
        {web && (
          <div>
            <h3>网络释义</h3>
            <ul>
              {web.map(({ key, value }) => (
                <li key={key}>
                  {key}
                  <ol>{value.map(v => <li key={v}>{v}</li>)}</ol>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

Preview.propTypes = {
  query: PropTypes.string,
  basic: PropTypes.shape({
    explains: PropTypes.array,
    phoentic: PropTypes.string
  }),
  speakUrl: PropTypes.string,
  translate: PropTypes.array,
  l: PropTypes.string,
  web: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.array
    })
  )
};
