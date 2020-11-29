import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

var Datastore = require('react-native-local-mongodb')
, db = new Datastore({ filename: 'asyncStorageKey', storage: AsyncStorage, autoload: true });

export {db};