/**
 * OttUtil.js
 * Otter's Utilities 'n Stuff
 * (C) Ben Otter (Benjamin McLean), 2017
 */

/**
 * @param {String} json - String containing JSON Data.
 * @returns {Object|Null} - Returns Object on success, null on failure.
 */
export function JSON2OBJ(json)
{
    let ret = null;
    try{ret = JSON.parse(json)}catch(e){console.log(e)};
    return ret;
}

/**
 * Copies and updates properties of a new object onto an old one.
 * @param {Object} old - Object to Update and Modify
 * @param {Object} newO - Object to Update From
 */
export function updateObj(old, newO)
{
    let n = Object.create(newO);
    for(let prop in n)
        old[prop] = n[prop];
            
    return old;
}