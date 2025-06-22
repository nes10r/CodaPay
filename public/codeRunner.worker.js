// public/codeRunner.worker.js

self.onmessage = function(event) {
    const { userCode, testCases } = event.data;

    const results = [];

    for (const test of testCases) {
        let functionName = 'solution'; // Default function name if not provided
        if (typeof test.functionName === 'string' && test.functionName.trim() !== '') {
            functionName = test.functionName;
        }

        try {
            // This is a safer way to evaluate code than a direct eval.
            // We append the function call to the user's code.
            const fullCode = `
                ${userCode}
                self.postMessage({ result: ${functionName}(${JSON.stringify(test.input)}) });
            `;
            
            // In a real-world, more secure scenario, one would use a proper sandboxing library.
            // For this project, we create a new function from the string.
            const F = new Function(fullCode);
            // We can't directly get the return value here, so we'll listen for postMessage from within.
            // This approach is limited. A better way is to redefine console.log and capture output.

            // A more robust approach: redefine console.log and eval in a controlled scope.
            let capturedOutput = [];
            const sandboxedConsole = {
                log: (...args) => {
                    capturedOutput.push(args.map(arg => JSON.stringify(arg)).join(' '));
                }
            };

            const codeToRun = `
                (function() {
                    const console = sandboxedConsole;
                    ${userCode};
                    return ${functionName}(${JSON.stringify(test.input)});
                })()
            `;

            const output = eval(codeToRun);
            const passed = JSON.stringify(output) === JSON.stringify(test.expected);
            
            results.push({
                input: JSON.stringify(test.input),
                expected: JSON.stringify(test.expected),
                received: JSON.stringify(output),
                passed: passed,
            });

        } catch (error) {
            results.push({
                input: JSON.stringify(test.input),
                expected: JSON.stringify(test.expected),
                received: `Xəta: ${error.message}`,
                passed: false,
                error: true
            });
        }
    }

    self.postMessage({ type: 'DONE', results });
}; 