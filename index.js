/**
 * @format
 */

console.log('🔵 index.js: Starting...');

import { AppRegistry } from 'react-native';
console.log('🔵 index.js: AppRegistry imported');

import App from './App';
console.log('🔵 index.js: App imported');

import { name as appName } from './app.json';
console.log('🔵 index.js: appName =', appName);

console.log('🔵 index.js: Registering component...');
AppRegistry.registerComponent(appName, () => App);
console.log('✅ index.js: Component registered successfully!');
