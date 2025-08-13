import { useEffect, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  const [incorrect, setIncorrect] = useState('');
  const { setIsLoggedIn } = useAppContext();
  const bearerToken = sessionStorage.getItem('bearer-token');

  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) {
      navigate('/app');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bearerToken ? `Bearer ${bearerToken}` : '',
        },
        body: JSON.stringify(loginDetails),
      });
      const data = await response.json();

      if (response.status === 201) {
        sessionStorage.setItem('auth-token', data.token);
        sessionStorage.setItem('name', data.userName);
        sessionStorage.setItem('email', data.email);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        setIncorrect('Wrong password. Try again.');
        setTimeout(() => {
          setIncorrect('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching details: ', error.message);
    }
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
              <>
                <FormInput
                  id='password'
                  type='password'
                  label='Password'
                  placeholder='Enter password'
                  value={loginDetails.password}
                  onChange={handleChange}
                />
                <span
                  style={{
                    color: 'red',
                    height: '.5cm',
                    display: 'block',
                    fontStyle: 'italic',
                    fontSize: '12px',
                  }}
                >
                  {incorrect}
                </span>
              </>
              <button type='submit' className='btn btn-primary w-100 mb-3'>
                Login
              </button>
            </form>
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
