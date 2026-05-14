/**
 * Test authentication for Chris login
 */

const crypto = require('crypto');
const fs = require('fs');

// Load users
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

console.log('=== Current Users in Database ===');
users.forEach(user => {
  console.log(`${user.email} - ${user.role} - Active: ${user.active}`);
});

// Test Chris's password
const chrisUser = users.find(u => u.email === 'chris@claimlynk.com');
if (chrisUser) {
  console.log('\n=== Chris User Found ===');
  console.log(`Name: ${chrisUser.name}`);
  console.log(`Role: ${chrisUser.role}`);
  console.log(`Active: ${chrisUser.active}`);
  
  // Test password hashing
  const HASH_ITERATIONS = 100000;
  const HASH_LENGTH = 64;
  const HASH_ALGORITHM = 'sha512';
  
  const testPassword = 'ClaimAdmin2026!';
  const testHash = crypto.pbkdf2Sync(testPassword, chrisUser.passwordSalt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGORITHM).toString('hex');
  
  console.log('\n=== Password Test ===');
  console.log(`Test Password: ${testPassword}`);
  console.log(`Stored Hash: ${chrisUser.passwordHash}`);
  console.log(`Test Hash:   ${testHash}`);
  console.log(`Match: ${testHash === chrisUser.passwordHash ? '✅ YES' : '❌ NO'}`);
} else {
  console.log('\n❌ Chris user not found in database!');
}

// Test demo system hash
function hashPasswordDemo(password) {
  return crypto.createHash('sha256').update(password + 'solidarity_salt_2024').digest('hex');
}

const demoHash = hashPasswordDemo('ClaimAdmin2026!');
console.log('\n=== Demo System Hash ===');
console.log(`Demo Hash: ${demoHash}`);

// Check demo users
const demoUsersFile = fs.readFileSync('./app/api/auth/demo-login/route.ts', 'utf-8');
if (demoUsersFile.includes('chris@claimlynk.com')) {
  console.log('✅ Chris found in demo login system');
} else {
  console.log('❌ Chris NOT found in demo login system');
}