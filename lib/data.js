const fs = require('fs');
const path = require('path');
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '../.data/');
// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);
            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (error2) => {
                if (!error2) {
                    fs.close(fileDescriptor, (error3) => {
                        if (!error3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file!');
                        }
                    })
                } else {
                    callback('Error writing to new file!')
                }
            })
        } else {
            callback('There was an error, file may exists!')
        }
    })
};
// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    })
};
// upadate existing file
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false)
                                } else {
                                    callback('Error closing file!');
                                }
                            })
                        } else {
                            callback('Error writing to file')
                        }
                    })
                } else {  
                    console.log('Error trancating file');
                }
            })
        } else {
            console.log(`Error updating. file may not exists!`);
        }
    })
};

// Delete existing file
lib.delete = (dir, file, callback)=>{
    // unlink
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err)=>{
        if(!err){
            callback(false)
        } else{
            callback('Error deleting file');
        }
    })
}





module.exports = lib;
