import {readFile,writeFile,mkdir,readdir,copyFile,rm,lstat,rename} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import '../src/content-schema.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export async function collect(sourceRoot=root) {
  const base=path.join(sourceRoot,'data/contents');
  const dirs=(await readdir(base,{withFileTypes:true})).filter(d=>d.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name));
  const items=[], assets=new Set();
  for(const dir of dirs){
    if(!/^[a-zA-Z0-9_-]+$/.test(dir.name)) throw new Error('콘텐츠 폴더명은 영문·숫자·_-만 사용: '+dir.name);
    const jsonPath=path.join(base,dir.name,'content.json');
    // Incomplete folders without content.json are not yet ready for publishing.
    let raw;try{raw=await readFile(jsonPath,'utf8')}catch(error){if(error.code==='ENOENT')continue;throw error}
    let item;try{item=JSON.parse(raw);globalThis.validateItems([item])}catch(error){throw new Error(dir.name+'/content.json: '+error.message)}
    for(const media of item.media||[]){
      for(const key of ['src',...(media.poster?['poster']:[])]){
        const ref=media[key];
        if(!ref.startsWith('./data/contents/'+dir.name+'/'))throw new Error('미디어는 자신의 콘텐츠 폴더에 있어야 합니다: '+ref);
        const ext=path.extname(ref).toLowerCase();
        const allowed=key==='poster'||media.type==='image'?['.jpg','.jpeg','.png','.webp','.gif','.avif']:['.mp4','.webm','.ogg'];
        if(!allowed.includes(ext))throw new Error('지원하지 않는 미디어 확장자: '+ref);
        const stat=await lstat(path.join(sourceRoot,ref));
        if(!stat.isFile()||stat.isSymbolicLink())throw new Error('일반 미디어 파일만 허용: '+ref);
        assets.add(ref);
      }
    }
    items.push(item);
  }
  globalThis.validateItems(items);
  return {items,assets:[...assets]};
}
export async function build(){
  const {items,assets}=await collect();
  const text=JSON.stringify(items,null,2)+'\n';
  await writeFile(path.join(root,'data/contents.json.tmp'),text);
  await rename(path.join(root,'data/contents.json.tmp'),path.join(root,'data/contents.json'));
  const dist=path.join(root,'dist');await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
  for(const name of ['index.html','src/app.js','src/style.css','src/content-schema.js','data/contents.json',...assets]){
    const destination=path.join(dist,name);await mkdir(path.dirname(destination),{recursive:true});await copyFile(path.join(root,name),destination);
  }
  await writeFile(path.join(dist,'.nojekyll'),'');
  console.log('Built '+items.length+' contents, '+assets.length+' media files → dist/');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
