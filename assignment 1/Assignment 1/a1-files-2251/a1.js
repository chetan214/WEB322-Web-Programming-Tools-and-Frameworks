/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Chetan Arora Student ID: 100976240 Date: 21 Jan 2025
*
********************************************************************************/ 
const fs = require('fs');
const readline = require('readline');

function listDirectory() {
    try {
        const items = fs.readdirSync('.');
        console.log("\nFiles and Directories in the current folder:");
        items.forEach((item, index) => console.log(`${index + 1}. ${item}`));
        return items;
    } catch (err) {
        console.log(`Error reading directory: ${err.message}`);
        return [];
    }
}

function processFile(fileName) {
    try {
         
         const content = fs.readFileSync(fileName).toString().replace(/\s+/g, ' ');
         
         const wordArray = content.replace(/[^\w\s\']/g, "").split(' ');
         
         const wordCount = wordArray.length;
         
         const longestWord = wordArray.reduce((a, b) => (a.length > b.length ? a : b), "");
          
         const charCount = content.length;
         
        console.log(`\nFile Name: ${fileName}`);
        console.log(`Number of Characters (including spaces): ${charCount}`);
        console.log(`Number of Words: ${wordCount}`);
        console.log(`Longest Word: ${longestWord}`);
    } catch (err) {
        console.log(`Error reading file: ${err.message}`);
    }
}

function processDirectory(directoryName) {
    try {
        const items = fs.readdirSync(directoryName);
        const sortedItems = items.sort().reverse(); 
        console.log(`\nFiles in the "${directoryName}" folder (reverse alphabetcal order):`);
        console.log(sortedItems.join(', '));
    } catch (err) {
        console.log(`Error reading directory: ${err.message}`);
    }
}

function main() {
    const items = listDirectory();
    if (items.length === 0) return;

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nEnter a file or directory name from the list above: ', (input) => {
        if (items.includes(input)) {
            const stats = fs.statSync(input);
            if (stats.isFile()) {
                processFile(input);
            } else if (stats.isDirectory()) {
                processDirectory(input);
            }
        } else {
            console.log('Invalid Input–Please select a valid directory or file name.');
        }

        rl.close();
    });
}

process.on('exit', () => {
    console.log(`\nExiting program. Current directory: ${process.cwd()}`);
});

main();