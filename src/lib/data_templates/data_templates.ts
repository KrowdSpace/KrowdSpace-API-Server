/**
 * data_templates.ts
 * 
 * Loads and exports all added data templates.
 */

import projects from './projects';
import register from './register';
import users from './users';

export default [
    ...projects,
    ...register,
    ...users,
]