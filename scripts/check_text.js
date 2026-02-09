const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Helper to parse arguments manually
function parseArgs(args) {
    const parsed = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            // Check if next arg is value or another flag
            if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                parsed[key] = args[i + 1];
                i++;
            } else {
                parsed[key] = true;
            }
        }
    }
    return parsed;
}

async function loadVocabulary(vocabDir) {
    const sensitiveWords = new Set();
    
    try {
        if (!fs.existsSync(vocabDir)) {
            console.error(`Error: Vocabulary directory not found: ${vocabDir}`);
            return sensitiveWords;
        }

        const files = fs.readdirSync(vocabDir);
        for (const file of files) {
            if (path.extname(file) === '.txt') {
                const filePath = path.join(vocabDir, file);
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const lines = content.split(/\r?\n/);
                    for (const line of lines) {
                        const word = line.trim();
                        if (word) {
                            sensitiveWords.add(word);
                        }
                    }
                } catch (err) {
                    console.warn(`Warning: Failed to read ${file}: ${err.message}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error reading vocabulary directory: ${err.message}`);
    }

    return sensitiveWords;
}

async function checkFile(targetFile, sensitiveWords) {
    if (!fs.existsSync(targetFile)) {
        console.error(`Error: Target file not found: ${targetFile}`);
        return;
    }

    const foundIssues = [];
    let lineNum = 0;

    const fileStream = fs.createReadStream(targetFile);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        lineNum++;
        const lineContent = line.trim();
        for (const word of sensitiveWords) {
            if (lineContent.includes(word)) {
                foundIssues.push({ lineNum, word, content: lineContent });
            }
        }
    }

    if (foundIssues.length > 0) {
        console.log(`Found ${foundIssues.length} sensitive word occurrences in ${targetFile}:`);
        for (const issue of foundIssues) {
            const shortContent = issue.content.length > 50 ? issue.content.substring(0, 50) + '...' : issue.content;
            console.log(`Line ${issue.lineNum}: Found '${issue.word}' in text: ...${shortContent}...`);
        }
        process.exit(1);
    } else {
        console.log(`No sensitive words found in ${targetFile}.`);
        process.exit(0);
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    if (!args.target_file) {
        console.error("Error: --target_file argument is required.");
        process.exit(1);
    }

    const targetFile = args.target_file;
    // Default to bundled vocabulary
    const defaultVocabDir = path.join(__dirname, '..', 'assets', 'vocabulary');
    const vocabDir = args.vocab_dir || defaultVocabDir;

    console.log(`Loading vocabulary from: ${path.resolve(vocabDir)}`);
    const sensitiveWords = await loadVocabulary(vocabDir);
    console.log(`Loaded ${sensitiveWords.size} sensitive words.`);

    console.log(`Checking file: ${targetFile}`);
    await checkFile(targetFile, sensitiveWords);
}

main();
