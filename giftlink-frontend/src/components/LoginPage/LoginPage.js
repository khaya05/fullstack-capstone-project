import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './LoginPage.css';

const LoginPage = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('signing in user:', loginDetails);
  };

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6 col-lg-4'>
          <div className='login-card p-4 border rounded'>
            <h2 className='text-center mb-4 font-weight-bold'>Login</h2>
            <form onSubmit={handleLogin}>
              <FormInput
                id='email'
                type='email'
                label='Email'
                placeholder='e.g mike@email.com'
                value={loginDetails.email}
                onChange={handleChange}
              />
              <FormInput
                id='password'
                type='password'
                label='Password'
                placeholder='Enter password'
                value={loginDetails.password}
                onChange={handleChange}
              />
            </form>
            <button type='submit' className='btn btn-primary w-100 mb-3'>
              Register
            </button>
            <p className='mt-4 text-center'>
              New here?{' '}
              <a href='/app/register' className='text-primary'>
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
