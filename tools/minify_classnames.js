const fs = require('fs');
const path = require('path');

module.exports = (files) => {

    let tmp = [];

    for(let i=0; i<files.length;i++) {

        let file = files[i];

        let name = path.basename(file);
        let new_name = name.split('.');
        new_name = new_name[0] + '.bak.' + new_name[new_name.length-1];
        let file_path = path.dirname(file);
        let new_file = path.join(file_path, new_name);

        console.log(name);
        console.log(new_name);

        fs.copyFileSync(file, new_file);
        fs.unlinkSync(file);

        files[i] = {
            input: new_file,
            output: file
        };

    }


    // The characters available to use for short class-names
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const numbers = '0123456789'.split('');
    const identifiers = [];
    const selectors = [];

    // The map that will hold the reference between the short names and the original ones
    const map = {};

    // Create short class names, which results in 260 unique class-names
    letters.forEach(letter => {
        numbers.forEach(number => {
            identifiers.push(`.${letter}${number}`)
        });
    });

    console.log(files);
    // Read each css file and build an array based on the selectors
    files.forEach(file => {
        console.log(file.input.substr(-4));
        if (file.input.split('.')[1] === '.css') {
            const fileContent = fs.readFileSync(file.input, { encoding: 'utf8' });

            /**
             * Conditions:
             * - Must start with either "." (classes) or "#" (ids)
             * - Must continue with a letter
             * - After one or multiple letters, optionally it can contain one or multiple letters again, numbers, dashes and underscores
             * - Must be followed by two curly braces facing each other with any character in between them
             * - Reference: https://stackoverflow.com/questions/12391760/regex-match-css-class-name-from-single-string-containing-multiple-classes
             */
            const regex = /(\.|#)[_a-z]+[a-z0-9-_]*(?![^\{]*\})/g;

            // We create a unique array containing all the selectors only once
            selectors.push(...new Set(fileContent.match(regex)));
        }
    });

    // Create a map containing the references between the original and the shortened class-names
    selectors.forEach((selector, index) => map[selector] = identifiers[index]);

    // Apply selectors to input files and generate the output
    files.forEach(file => {

        const containingFolder = path.basename(file.output);

        let fileContent = fs.readFileSync(file.input, { encoding: 'utf8' });

        if (!fs.existsSync(containingFolder)) {
            fs.mkdirSync(containingFolder, { recursive: true }); // recursive: true requires Node > 10.12.0
        }

        // Apply selectors to css
        if (file.input.substr(-4) === '.css') {
            Object.keys(map).forEach(key => {
                /**
                 * Conditions:
                 * - Must start with either "." (classes) or "#" (ids)
                 * - Must be a whole word
                 * - Must not end by a dash or underscore
                 * - ps.: We also need to strip the key to get rid of the "." or "#" from the beginning
                 */
                fileContent = fileContent.replace(new RegExp(`(?:\\.|#)(?:^|\\b)${key.substring(1)}(?:$|\\b)(?![-_])`, 'g'), map[key]);
            });

            fs.writeFileSync(file.output, fileContent);
        }

        // Apply selectors to html
        if (file.input.substr(-4) === 'html') {
            Object.keys(map).forEach(key => {
                /**
                 * Conditions:
                 * - Positive lookbehind, must start with "class" or "id"
                 * - Followed by a valid class name
                 * - Negative lookbehind, Not followed by dashes or underscores
                 * - Followed by a whole word (the class name itself)
                 * - Must not end by a dash or underscore
                 * - ps.: You need node version 9.x or above to use lookbehinds, else you need to use --harmony flag (https://node.green/)
                 */
                fileContent = fileContent.replace(new RegExp(`(?<=(?:class|id)="[a-z0-9-_\\s]*)(?<![-_])(?:^|\\b)${key.substring(1)}(?:$|\\b)(?![-_])`, 'g'), map[key].substring(1));
            });

            fs.writeFileSync(file.output, fileContent);
        }

        // Apply selectors to js
        if (file.input.substr(-3) === '.js') {
            Object.keys(map).forEach(key => {
                /**
                 * Conditions:
                 * - Positive lookbehind, must start with "class" or "id"
                 * - Followed by a valid class name
                 * - Negative lookbehind, Not followed by dashes or underscores
                 * - Followed by a whole word (the class name itself)
                 * - Must not end by a dash or underscore
                 */
                fileContent = fileContent.replace(new RegExp(`(?<=('|")([a-z0-9-_\\s]*)?)(?<![-_])(?:^|\\b)${key.substr(1)}(?:$|\\b)(?![-_])`, 'g'), map[key].substring(1));
            });

            fs.writeFileSync(file.output, fileContent);
        }
    });
};