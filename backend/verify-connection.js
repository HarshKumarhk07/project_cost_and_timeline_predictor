const http = require('http');

const postOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/test-mongo/add',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const getOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/test-mongo',
    method: 'GET'
};

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body }));
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

(async () => {
    try {
        console.log('Testing POST /test-mongo/add...');
        const postRes = await makeRequest(postOptions, { name: 'Automated Verification' });
        console.log('POST Status:', postRes.statusCode);
        console.log('POST Body:', postRes.body);

        console.log('\nTesting GET /test-mongo...');
        const getRes = await makeRequest(getOptions);
        console.log('GET Status:', getRes.statusCode);
        console.log('GET Body:', getRes.body);

    } catch (error) {
        console.error('Verification failed:', error.message);
    }
})();
