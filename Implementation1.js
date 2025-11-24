//Storing Username in Cookie (Insecure)

// Server-side user database
const USERS = {
  alice: 'password123',
  bob: 'hunter2'
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (password === USERS[username]) {
    res.cookie('username', username);
    res.redirect('/');
  } else {
    res.send('Login failed!');
  }
});

app.get('/', (req, res) => {
  const { username } = req.cookies;
  if (username) {
    res.send(`Welcome ${username}!`);
  } else {
    res.send(loginForm);
  }
});

//Log in as 'alice'

//Edit cookie to say 'username=bob'

//Now you're logged in as Bob!
