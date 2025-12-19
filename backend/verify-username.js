const http = require('http');

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

(async () => {
    const testCases = [
        { name: '12345', valid: false, desc: 'Only numbers (Reject)' },
        { name: '999', valid: false, desc: 'Only numbers (Reject)' },
        { name: '1ayush', valid: false, desc: 'Starts with number (Reject)' },
        { name: 'ayush1', valid: true, desc: 'Letters then numbers (Accept)' },
        { name: 'harsh_07', valid: true, desc: 'Letters, underscore, number (Accept)' },
        { name: '_test', valid: false, desc: 'Starts with underscore (Reject check)' } // My regex ^[A-Za-z] requires letter start.
    ];

    console.log('--- Testing Username Validation ---');

    for (const test of testCases) {
        process.stdout.write(`Testing "${test.name}" (${test.desc}): `);
        const res = await makeRequest('/auth/signup', 'POST', {
            name: test.name,
            email: `valid_${Math.random().toString(36).substring(7)}@test.com`, // details to ensure uniqueness
            password: 'password123'
        });

        const isSuccess = res.statusCode === 200 || res.statusCode === 201; // Assuming 200 OK for now
        const hasError = res.statusCode === 400;

        if (test.valid && isSuccess) {
            console.log('PASS (Accepted)');
        } else if (!test.valid && hasError) {
            console.log('PASS (Rejected: ' + res.body.message + ')');
        } else {
            console.log(`FAIL (Status: ${res.statusCode}, Msg: ${res.body.message})`);
        }
    }
})();
