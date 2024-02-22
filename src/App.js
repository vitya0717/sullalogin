import React, { useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = React.useState('');
  const [termekek, setTermekek] = React.useState([]);


  useEffect(() => {
    createCards();
  }, [token]);

  async function createCards() {
    if (token) {
      var response = await axios.get('https://jwt.sulla.hu/termekek', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTermekek(response.data);
    }
  }

  return (
    <div className='container w-25'>
      <form onSubmit={async (e) => {
        e.persist();
        e.preventDefault();

        if(e.target[0].value === '' || e.target[1].value === '') {
          return alert('Username and password are required');
        }

        var response = await axios.post('https://jwt.sulla.hu/login', {
          username: e.target[0].value,
          password: e.target[1].value
        }).catch((error) => {
          if(error.response.status === 401) {
            return alert('Wrong username or password');
          }
        });

        if(response) {
          setToken(response.data.token);
          return alert('Login successful');
        }

        

      }} className='form mt-5'>
        <input type='text' className='form-control' placeholder='Username' />
        <input type='password' className='form-control' placeholder='Password' />
        <button className='btn btn-success mt-3 mb-3'>Bejelentkezés</button>
      </form>
      <button onClick={() => setToken(null)} className='btn btn-danger mt-3 mb-3'>Kijelentkezés</button>
      {
        token ?
          <>
            <ul className='list-group'>
              {
                termekek.map((termek) => {
                  return <li key={termek.id} className='list-group-item'>{termek.id},{termek.name}, {termek.price}</li>
                })
              }
            </ul>
          </>
          : null
      }
    </div>
  );
}

export default App;
