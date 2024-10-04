document.getElementById('run-button').addEventListener('click', function() {
    const code = document.getElementById('vibescript-code').value;
    const outputElement = document.getElementById('output');
    outputElement.value = ''; // Clear previous output

    try {
        const jsCode = translateVibeScriptToJS(code);
        executeJSCode(jsCode, outputElement);
    } catch (e) {
        outputElement.value = 'Error: ' + e.message;
    }
});

function translateVibeScriptToJS(code) {
    // Map VibeScript syntax to JavaScript syntax
    let jsCode = code;

    // Remove lines starting with #
    jsCode = jsCode.replace(/^\s*#.*$/gm, '');

    // Remove comments
    jsCode = jsCode.replace(/\/\/.*$/gm, ''); // Remove single-line comments
    jsCode = jsCode.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

    // Replace smart quotes with normal quotes
    jsCode = jsCode.replace(/[“”„”]/g, '"');
    jsCode = jsCode.replace(/[‘’‚‘’]/g, "'");

    // Extract string literals and store them
    const stringLiterals = [];
    jsCode = jsCode.replace(/(["'])(?:\\.|[^\\])*?\1/g, function(match) {
        stringLiterals.push(match);
        return `__STRING_LITERAL_${stringLiterals.length - 1}__`;
    });

    // Replace multi-word keywords without word boundaries
    jsCode = jsCode.replace(/just put the fries in the bag bro/g, 'else');
    jsCode = jsCode.replace(/fanumTax/g, 'break');

    // Replace single-word keywords with word boundaries
    const keywordMap = {
        '\\bvibe\\b': 'let',
        '\\bnoCap\\b': ';',
        '\\brizz4rizz\\b': '&&',
        '\\baura\\b': '||',
        '\\bnegativeAura\\b': '!',
        '\\bbet\\b': 'if',
        '\\bvibeCheck\\b': 'else if',
        '\\bmewing\\b': 'while',
        '\\bsigma\\b': 'for',
        '\\brizz\\b': 'function',
        '\\bgyatt\\b': 'return',
        '\\byap\\b': 'output',
        '\\bglaze\\(\\)': 'input()',
        '\\bnew\\b': 'new',
        '\\bsquad\\b': 'class',
        '\\bthis\\b': 'this',
        '\\bskibidi\\b': 'try',
        '\\bohio\\b': 'catch',
        '\\bstan\\b': 'continue'
    };

    for (const [vibeKeyword, jsKeyword] of Object.entries(keywordMap)) {
        const regex = new RegExp(vibeKeyword, 'g');
        jsCode = jsCode.replace(regex, jsKeyword);
    }

    // Restore string literals
    jsCode = jsCode.replace(/__STRING_LITERAL_(\d+)__/g, function(match, index) {
        return stringLiterals[index];
    });

    return jsCode;
}

function executeJSCode(jsCode, outputElement) {
    // Define input and output functions
    function input() {
        // Prompt the user for input
        const value = prompt('Input required:');
        return value;
    }

    function output(...args) {
        outputElement.value += args.join(' ') + '\n';
    }

    // Wrap the code in an IIFE and execute it
    const codeToExecute = `
        (function() {
            ${jsCode}
        })();
    `;

    // Execute the code with limited scope
    try {
        const FunctionConstructor = new Function('input', 'output', codeToExecute);
        FunctionConstructor(input, output);
    } catch (e) {
        outputElement.value += 'Error during execution: ' + e.message;
    }
}
