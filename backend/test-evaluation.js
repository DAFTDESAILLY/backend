
async function test() {
    let token;
    console.log('Authenticating...');
    try {
        let resAuth = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@school.com',
                password: 'adminpassword'
            })
        });

        if (resAuth.status !== 200 && resAuth.status !== 201) {
            console.log('Login failed, registering...');
            await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@school.com',
                    password: 'adminpassword',
                    name: 'Admin User'
                })
            });

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
            console.log('Authenticated!');
        } else {
            console.error('Authentication failed:', authData);
            return;
        }
    } catch (error) {
        console.error('Auth Error:', error);
        return;
    }

    console.log('\nTesting Create Evaluation...');
    try {
        const payload = {
            name: "tarea",
            subjectId: 4,
            type: "exam",
            maxScore: 100,
            weight: 100,
            dueDate: "2026-02-16T23:25:28.835Z",
            description: ""
        };

        const res = await fetch('http://localhost:3000/evaluations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log('Result:', res.status, text);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
