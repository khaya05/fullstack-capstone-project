import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './RegisterPage.css';

const RegisterPage = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Handles input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handles form submission
  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering user:', userDetails);
    // You can add your API call here
  };

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6 col-lg-4'>
          <div className='register-card p-4 border rounded shadow'>
            <h2 className='text-center mb-4 fw-bold'>Register</h2>
            <form onSubmit={handleRegister}>
              <FormInput
                id='firstName'
                type='text'
                label='First Name'
                placeholder='Enter your first name'
                value={userDetails.firstName}
                onChange={handleChange}
              />
              <FormInput
                id='lastName'
                type='text'
                label='Last Name'
                placeholder='e.g Smith'
                value={userDetails.lastName}
                onChange={handleChange}
              />
              <FormInput
                id='email'
                type='email'
                label='Email'
                placeholder='e.g mike@email.com'
                value={userDetails.email}
                onChange={handleChange}
              />
              <FormInput
                id='password'
                type='password'
                label='Password'
                placeholder='Enter password'
                value={userDetails.password}
                onChange={handleChange}
              />

              <button type='submit' className='btn btn-primary w-100 mb-3'>
                Register
              </button>
            </form>

            <p className='mt-4 text-center'>
              Already a member?{' '}
              <a href='/app/login' className='text-primary'>
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
