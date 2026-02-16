
async function check() {
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

        const authData = await resAuth.json();
        token = authData.access_token;
    } catch (error) {
        console.error('Auth Error:', error);
        return;
    }

    console.log('\nChecking Grade...');
    try {
        // Since I don't have a direct endpoint to get a single grade by evaluationItemId and studentAssignmentId easily exposed,
        // I will use GET /grades which returns all grades.
        const res = await fetch('http://localhost:3000/grades', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const grades = await res.json();
        console.log('Grades:', JSON.stringify(grades, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
