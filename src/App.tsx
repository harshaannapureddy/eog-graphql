/* eslint-disable quotes */
import React from 'react';
import { Provider } from 'react-redux';

import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import createStore from './Redux/Store';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import EOGMetrics from './Dashboard/EOGMetrics';

const store = createStore();
const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(39,49,66)',
        },
        secondary: {
            main: 'rgb(197,208,222)',
        },
        background: {
            default: 'rgb(226,231,238)',
        },
    },
});

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Provider store={store}>
                <Wrapper>
                    <Header />
                    <EOGMetrics />
                    <ToastContainer />
                </Wrapper>
            </Provider>
        </MuiThemeProvider>
    );
};

export default App;
