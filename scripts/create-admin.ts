import { createUser } from '../lib/users';

// Create the admin user with the credentials from LOGIN-CREDENTIALS.md
try {
  const user = createUser({
    email: 'admin@truecare.com',
    name: 'SHN Admin User',
    password: 'PPO#Net123!',
    role: 'super_admin',
    createdBy: 'script'
  });
  
  console.log('✅ Admin user created successfully:', {
    email: user.email,
    name: user.name,
    role: user.role
  });
} catch (error: any) {
  console.error('❌ Failed to create admin user:', error.message);
}