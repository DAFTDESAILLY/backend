
async function test() {
    let token;
    console.log('Authenticating...');
    try {
        // Try to login first
        let resAuth = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@school.com',
                password: 'adminpassword'
            })
        });

        if (resAuth.status !== 200 && resAuth.status !== 201) {
            console.log('Login failed, trying to register...');
            const resReg = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@school.com',
                    password: 'adminpassword',
                    name: 'Admin User'
                })
            });
            console.log('Registration status:', resReg.status);

            // Login again
            console.log('Logging in after registration...');
            resAuth = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@school.com',
                    password: 'adminpassword'
                })
            });
        }

        const authData = await resAuth.json();
        if (authData.access_token) {
            token = authData.access_token;
            console.log('Authenticated! Token obtained.');
        } else {
            console.error('Authentication failed:', authData);
            return;
        }
    } catch (error) {
        console.error('Auth Error:', error);
        return;
    }

    console.log('\nTesting with single object...');
    try {
        const resSingle = await fetch('http://localhost:3000/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                studentId: 2,
                groupId: 1,
                date: new Date().toISOString(),
                status: 'present'
            })
        });
        const text = await resSingle.text();
        console.log('Single Object Result:', resSingle.status, text);
    } catch (error) {
        console.error('Single Object Error:', error);
    }

    console.log('\nTesting with array...');
    try {
        const resArray = await fetch('http://localhost:3000/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify([
                {
                    studentId: 2,
                    groupId: 1,
                    date: new Date().toISOString(),
                    status: 'present'
                }
            ])
        });
        const textArray = await resArray.text();
        console.log('Array Result:', resArray.status, textArray);
    } catch (error) {
        console.error('Array Error:', error);
    }
}

test();
