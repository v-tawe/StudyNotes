import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const e = React.createElement

class APP extends React.Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {
        const vditor = new Vditor('vditor', {
            toolbarConfig: {
                pin: true,
            },
            cache: {
                enable: false,
            },
            after () {
                vditor.setValue('Hello, Vditor + React!')
            },
        })
    }

    render () {
        return e(
            'div',
            {id: 'vditor'},
        )
    }
}

ReactDOM.render(e(APP), document.querySelector('#app'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
