//Sequential Session IDs (Still Insecure)
let nextSessionId = 1;
const SESSIONS = {}; // sessionId -> username

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (password === USERS[username]) {
    SESSIONS[nextSessionId] = username;
    res.cookie('sessionId', nextSessionId);
    nextSessionId += 1;
    res.redirect('/');
  }
});

app.get('/', (req, res) => {
  const username = SESSIONS[req.cookies.sessionId];
  if (username) {
    res.send(`Welcome ${username}!`);
  } else {
    res.send(loginForm);
  }
});

app.get('/logout', (req, res) => {
  delete SESSIONS[req.cookies.sessionId];
  res.clearCookie('sessionId');
  res.redirect('/');
});


//This is better because we can now invalidate sessions server-side if we wish, and we're not storing sensitive data in cookies. However, this is also problematic in that session IDs are predictable: if your session ID is 5, you can simply submit cookies with the sessionId set to 1-4 to impersonate other users.
