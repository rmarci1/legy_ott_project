import * as fs from 'fs';

export default async function convertImg(path: string){
    const data = fs.readFileSync('public/img/' + path)
    return data;
}
