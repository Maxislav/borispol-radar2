
process.env.TZ = 'UTC';
import * as http  from 'http';
import * as fs from 'fs';
import * as dateFormat from 'dateformat';
import * as path from "path";

const irDir = path.resolve(__dirname, '../src', 'img', 'ir')

function ensureExists(path, mask: any, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = parseInt("0777", 8);;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

ensureExists(irDir, parseInt("0777", 8) , (err) =>{
	if(err) return console.error(err) 
	else {
		const d = new Date();
		const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours())
		const fileName = path.resolve(irDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif')) 

		fs.exists(fileName, (bool: boolean) =>  {
			if(!bool) {
				const file = fs.createWriteStream(fileName);
				const request = http
				.get("http://www.sat24.com/image2.ashx?region=eu&ir=true", function(response) {
				  response.pipe(file);
				  file.on('end', function() {
				      file.close();  // close() is async, call cb after close completes.
				    });
				})
				.on('error', (err: Error) => {
					console.error('Error -> ', err)
				});
			} else {
				console.log('File exist')
			}
		})
			
	}	
})


