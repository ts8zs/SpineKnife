// var ta1 = document.getElementById('ta1');
// var lines = ta1.value.split('\n');
// var atlasArray = [];
// for (let line = 0; line < lines.length; line++) {
//     const str = lines[line];
//     var lastKey;
//     if (str.indexOf('  ') != 0) {
//         atlasArray.push({});
//         var lastIndex = atlasArray.length - 1;
//         atlasArray[lastIndex][str] = [];
//         var lastKey = str;
//     } else {
//         var lastIndex = atlasArray.length - 1;
//         atlasArray[lastIndex][lastKey].push(str);
//     }
// }
// console.dir(atlasArray);


function atlasFliter(atlasString,partFliter) {
    var lines=atlasString.split('\n');
    var output = "";
    for (let line = 0; line < lines.length; line++) {
        function getFirstPartOf(str) {
            return str.split('-')[0];
        }
        const str = lines[line];
        if (line <= 5) {
            output += str + '\n';
        } else {
            if (str.indexOf('  ') != 0) {
                if (partFliter.indexOf(getFirstPartOf(str)) != -1) {
                    output += str + '\n';
                } else {
                    line += 6;
                }
            } else {
                output += str + '\n';
            }
        }
    }
    return output;
}

