const test = require('node:test');
const assert = require('node:assert/strict');
const { openSite, importFile } = require('./helpers.cjs');
test('project title preserves the logo and suffix but removes executable HTML', async () => {
  const { dom, w, errors } = await openSite();
  const logo = 'data:image/png;base64,iVBORw0KGgo=';
  await importFile(w, '#load-project-input', JSON.stringify({titleHTML:'<img class="max-h-16 w-auto" src="'+logo+'" onerror="window.pwned=1"><span class="text-xl">題名</span><svg onload="window.pwned=1"></svg><script>window.pwned=1</script>', cards:[]}));
  const title=w.document.getElementById('sheet-title');
  assert.equal(title.querySelector('img').getAttribute('src'),logo);
  assert.equal(title.querySelector('span').textContent,'題名');
  assert.equal(title.querySelectorAll('[onerror],script,svg').length,0);
  assert.equal(w.pwned,undefined);
  assert.deepEqual(errors,[]);
  dom.window.close();
});
test('missing sanitizer leaves the existing title intact', async () => {
  const { dom,w }=await openSite();
  const before=w.document.getElementById('sheet-title').innerHTML;
  w.DOMPurify=undefined;
  await importFile(w,'#load-project-input',JSON.stringify({titleHTML:'<img src=x onerror="window.pwned=1">',cards:[]}));
  assert.equal(w.document.getElementById('sheet-title').innerHTML,before);
  dom.window.close();
});
