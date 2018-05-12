import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Preview extends Component {
  render() {
    const {query, basic, web} = this.props
    return (
      <div>
        <h2>{query}</h2>
        {basic && 
          <div>
            <h3>基本释义</h3>
            <p>{basic.phoentic}</p>
            <ul>
              {basic.explains.map(v => 
                <li key={v}>{v}</li>)}
            </ul>
            
          </div>
        }
        {web && 
          <div>
            <h3>网络释义</h3>
            <ul>
              {web.map(({key, value}) => 
                <li key={key}>{key}
                  <ol>
                    {value.map(v => <li key={v}>{v}</li>)}
                  </ol>   
                </li>)
              }
            </ul>
            
          </div>
        }
      </div>
    )
  }
}

Preview.propTypes = {
  query: PropTypes.string,
  basic: PropTypes.shape({
    explains: PropTypes.array,
    phoentic: PropTypes.string,
  }),
  errorCode: PropTypes.number,
  translate: PropTypes.array,
  web: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.array
  }))
}