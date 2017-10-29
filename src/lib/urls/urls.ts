/**
 * urls/urls.ts
 * 
 * Loads and Exports all the specified URL templates
 */

import register from './register';
import users from './users';
import projects from './projects';
import stats from './stats';

import purchase from './purchase';

import admin from './admin';

export default [
    ...register,
    ...users,
    ...projects,
    ...stats,
    ...purchase,
    ...admin,
];
