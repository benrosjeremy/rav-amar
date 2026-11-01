const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=path=>fs.readFileSync(path,'utf8');
let lang='he';
const context={window:{},localStorage:{getItem:k=>k==='site_lang'?lang:null}};
vm.createContext(context);
vm.runInContext(src('data/i18n.js'),context,{timeout:3000});
context.D={};
context.window.D=context.D;
vm.runInContext(src('data/pidx.js'),context,{timeout:3000});

test('site scripts parse without syntax errors',()=>{
 for(const path of ['app.js','reader.js','data/i18n.js']){
  assert.doesNotThrow(()=>new vm.Script(src(path),{filename:path}));
 }
});

test('interface labels change between Hebrew, French and English',()=>{
 lang='he';assert.equal(context.window.siteUi('הכול'),'הכול');
 lang='fr';assert.equal(context.window.siteUi('הכול'),'Tout');
 assert.equal(context.window.siteUi('שירה ותפילה'),'Poésie et prière');
 lang='en';assert.equal(context.window.siteUi('הכול'),'All');
 assert.equal(context.window.siteUi('שיעורים לפי פרשת השבוע'),'Lessons by weekly Torah portion');
});

test('all indexed portion names have English and French translations',()=>{
 const names=context.D.pidx.order.flatMap(([,portions])=>portions);
 assert.equal(names.length,51);
 for(const name of names){
  lang='fr';assert.notEqual(context.window.sitePortion(name),name,'Missing French: '+name);
  lang='en';assert.notEqual(context.window.sitePortion(name),name,'Missing English: '+name);
 }
});

test('book descriptions have both translations while original titles are preserved',()=>{
 const app=src('app.js');
 const text=app.slice(0,app.indexOf('const CATS='));
 const books=new Function(text+';return BOOKS')();
 assert.ok(books.length>=18);
 for(const item of books){
  lang='fr';assert.notEqual(context.window.siteUi(item.d),item.d,'Missing French book description: '+item.t);
  lang='en';assert.notEqual(context.window.siteUi(item.d),item.d,'Missing English book description: '+item.t);
 }
 assert.match(app,/lang="he" dir="rtl">\$\{b\.t\}/);
});

test('original Torah data is never loaded from translation dictionary',()=>{
 const reader=src('reader.js');
 assert.match(reader,/\$\{esc\(it\.t\)\}/);
 assert.match(reader,/\$\{paras\(it\.p/);
 assert.ok(!src('data/i18n.js').includes('D.bereshit='));
 assert.ok(!src('data/i18n.js').includes('D.shut='));
});

test('language switching refreshes dynamic interface labels',()=>{
 const app=src('app.js'),reader=src('reader.js');
 assert.match(app,/site-language-changed/);
 assert.match(reader,/site-language-changed/);
 assert.match(app,/addEventListener\('submit',e=>/);
});
