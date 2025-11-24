const COOKIE_SECRET = 'super-secret-key';
app.use(cookieParser(COOKIE_SECRET));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (password === USERS[username]) {
    res.cookie('username', username, { signed: true });
    res.redirect('/');
  }
});

app.get('/', (req, res) => {
  const { username } = req.signedCookies;
  if (username) {
    res.send(`Welcome ${username}!`);
  } else {
    res.send(loginForm);
  }
});


//This prevents tampering but has other problems:

//The signed cookie becomes a permanent credential - even after logout, anyone with a copy of the cookie can impersonate that user.

//There is no way to invalidate sessions on the server side.

//There is no way to list or terminate active sessions.
