const http = require('http');

const signupData = {
    name: 'LoginCount Test',
    email: 'logincount@test.com',
    password: 'password123'
};

const loginData = {
    email: 'logincount@test.com',
    password: 'password123'
};

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
        console.log('1. Signing up new user...');
        const signupRes = await makeRequest('/auth/signup', 'POST', signupData);
        if (signupRes.statusCode === 400 && signupRes.body.message === 'Email exists') {
            console.log('User already exists, proceeding to login test...');
        } else {
            console.log('Signup Status:', signupRes.statusCode);
            console.log('Signup LoginCount:', signupRes.body.user?.loginCount);
        }

        console.log('\n2. Logging in (1st time for this test)...');
        const login1 = await makeRequest('/auth/login', 'POST', loginData);
        console.log('Login 1 Status:', login1.statusCode);
        console.log('Login 1 user data:', login1.body.user);
        console.log('Login 1 LoginCount:', login1.body.user?.loginCount);

        console.log('\n3. Logging in (2nd time)...');
        const login2 = await makeRequest('/auth/login', 'POST', loginData);
        console.log('Login 2 Status:', login2.statusCode);
        console.log('Login 2 LoginCount:', login2.body.user?.loginCount);

    } catch (error) {
        console.error('Test failed:', error);
    }
})();
