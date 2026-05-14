import { verifyCredentials } from '../lib/users';

// Test the login
const email = 'admin@truecare.com';
const password = 'PPO#Net123!';

console.log('Testing login with:', { email, password });

const user = verifyCredentials(email, password);

if (user) {
  console.log('✅ Login successful!', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
} else {
  console.log('❌ Login failed - credentials not verified');
  
  // Let's debug the password hash
  import('../lib/users').then(({ hashPassword }) => {
    const testUser = JSON.parse(require('fs').readFileSync('./data/users.json', 'utf-8'))
      .find((u: any) => u.email === email);
    
    if (testUser) {
      const inputHash = hashPassword(password, testUser.passwordSalt);
      console.log('\nDebug info:');
      console.log('Expected hash:', testUser.passwordHash);
      console.log('Input hash:   ', inputHash);
      console.log('Match:', inputHash === testUser.passwordHash);
    }
  });
}