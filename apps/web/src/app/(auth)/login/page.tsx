import React from 'react';
import LoginForm from './login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <LoginForm 
      error={params.error} 
      message={params.message} 
    />
  );
}
