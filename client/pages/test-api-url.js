import { useEffect, useState } from 'react';

export default function TestApiUrl() {
  const [apiInfo, setApiInfo] = useState({});
  
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const correctUrl = baseUrl.endsWith('/') ? `${baseUrl}auth/users/` : `${baseUrl}/auth/users/`;
    
    setApiInfo({
      rawEnvUrl: process.env.NEXT_PUBLIC_API_URL,
      baseUrl: baseUrl,
      correctUrl: correctUrl
    });
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>API URL Test</h1>
      <pre>{JSON.stringify(apiInfo, null, 2)}</pre>
    </div>
  );
}
