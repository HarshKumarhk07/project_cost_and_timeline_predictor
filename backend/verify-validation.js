const http = require('http');

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
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
    try {
        console.log('--- Testing Signup Validation ---');

        // 1. Invalid Name (Numeric)
        console.log('1. Testing Invalid Name ("12345")...');
        const res1 = await makeRequest('/auth/signup', 'POST', {
            name: '12345',
            email: 'valid@email.com',
            password: 'password123'
        });
        console.log('Status:', res1.statusCode, 'Message:', res1.body.message);

        // 2. Invalid Email (Typo .comm)
        console.log('\n2. Testing Invalid Email ("test@gmail.comm")...');
        const res2 = await makeRequest('/auth/signup', 'POST', {
            name: 'Valid Name',
            email: 'test@gmail.comm',
            password: 'password123'
        });
        console.log('Status:', res2.statusCode, 'Message:', res2.body.message);

        // 3. Valid Signup
        console.log('\n3. Testing Valid Signup...');
        const randomEmail = `valid${Date.now()}@test.com`;
        const res3 = await makeRequest('/auth/signup', 'POST', {
            name: 'Valid Name',
            email: randomEmail,
            password: 'password123'
        });
        console.log('Status:', res3.statusCode, 'Message:', res3.body.message || 'Success');

    } catch (error) {
        console.error('Test failed:', error);
    }
})();
