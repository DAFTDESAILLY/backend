
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

        if (!resAuth.ok) {
            console.error('Auth failed:', resAuth.status);
            return;
        }

        const authData = await resAuth.json();
        token = authData.access_token;
        console.log('Authenticated!');
    } catch (error) {
        console.error('Auth Error:', error);
        return;
    }

    console.log('\nTesting Batch Grades...');
    try {
        const payload = [
            {
                evaluationItemId: 1,
                studentAssignmentId: 2,
                score: 8.5
            },
            {
                evaluationItemId: 1,
                studentAssignmentId: 2, // Testing multiple grades for same student same item? Usually should be one per item.
                // But let's assume we are sending for different students.
                // Since I only have 1 student assignment (ID 2), I'll just send 1 item in array or duplicate it to test array handling.
                score: 9.0
            }
        ];

        const res = await fetch('http://localhost:3000/grades/batch', {
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
