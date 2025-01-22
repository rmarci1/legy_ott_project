import * as fs from 'fs';

export default async function convertImg(path: string){
    let buffer: Buffer;
    console.log('public/img/' + path)
    // fs.readFile('public/img/' + path, (err, data) => {
    //   if (err) throw err;
    // //   const content = data;
    // //   file = content.toString('base64');
    // //   return file;
    //     buffer = Buffer.from(data)
    // })
    const data = fs.readFileSync('public/img/' + path)
    // buffer = Buffer.from(data)
    return data;
}
