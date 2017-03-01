## KrowdSpace Server Software

**Please note:** KServer is written in ES6 and (for now) requires building with Babel to run in a NodeJS environment!
___
This is the K(rowdSpace)Server, the software that powers KrowdSpaces Backend Utilities!

---

**Building**
___

To Build, please CD into the Parent Dir, and run;

`npm install`

`npm run build`

There should now be a 'bin' Dir under the parent, this contains the output runnable code!

**Running**
___

To Run (after building), please CD into The Parent Dir, and;

For a session instance, run `node ./`

To keep it running as a backroung service, run `npm run runon` to start background service, and `npm stop stopall` to kill it.

___
Anyway, That should do it!

-Ott