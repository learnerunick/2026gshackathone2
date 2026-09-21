import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm,readFile} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';
import {collect} from '../scripts/build.mjs';
const sample=JSON.parse(await readFile(new URL('../data/contents/content-001/content.json',import.meta.url),'utf8'));
async function fixture(fn){const root=await mkdtemp(path.join(os.tmpdir(),'gs-content-'));await mkdir(path.join(root,'data/contents/a'),{recursive:true});try{await fn(root)}finally{await rm(root,{recursive:true,force:true})}}
async function put(root,item,folder='a'){await mkdir(path.join(root,'data/contents',folder),{recursive:true});await writeFile(path.join(root,'data/contents',folder,'content.json'),JSON.stringify(item))}
test('collect content and image/video assets with project-relative paths',()=>fixture(async root=>{
 const item={...sample,media:[{type:'image',src:'./data/contents/a/photo.webp'},{type:'video',src:'./data/contents/a/movie.mp4',poster:'./data/contents/a/poster.jpg'}]};
 for(const name of ['photo.webp','movie.mp4','poster.jpg'])await writeFile(path.join(root,'data/contents/a',name),'fixture');
 await put(root,item);const result=await collect(root);assert.equal(result.items.length,1);assert.equal(result.assets.length,3);
}));
test('missing media fails build',()=>fixture(async root=>{await put(root,{...sample,media:[{type:'image',src:'./data/contents/a/missing.png'}]});await assert.rejects(collect(root),/ENOENT/)}));
test('duplicate IDs fail build',()=>fixture(async root=>{await put(root,sample);await put(root,sample,'b');await assert.rejects(collect(root),/id/)}));
test('invalid JSON fails with filename',()=>fixture(async root=>{await writeFile(path.join(root,'data/contents/a/content.json'),'{bad');await assert.rejects(collect(root),/a\/content.json/)}));
test('unsafe media paths fail validation',()=>fixture(async root=>{await put(root,{...sample,media:[{type:'image',src:'../secret.png'}]});await assert.rejects(collect(root),/경로/)}));
test('unfinished folders ignored',()=>fixture(async root=>{assert.equal((await collect(root)).items.length,0)}));
