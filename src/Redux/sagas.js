/* eslint-disable quotes */
import { spawn } from 'redux-saga/effects';
import metricsSaga from '../Dashboard/saga';

export default function* root() {
    yield spawn(metricsSaga);
}
