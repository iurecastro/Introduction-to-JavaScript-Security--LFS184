import { randomBytes } from 'crypto';

const SESSIONS = new Map(); // sessionId -> userData

// Login endpoint: Check credentials and set cookie
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (checkCredentials(username, password)) {
    // Generate cryptographically secure random session ID
    const sessionId = randomBytes(32).toString('hex');

    // Store session data server-side
    SESSIONS.set(sessionId, {
      username,
      lastActive: Date.now()
    });

    // Set session cookie with security flags
    res.cookie('sessionId', sessionId, {
      httpOnly: true,   // Prevent JavaScript access
      secure: true,     // Prevent cookie from being sent over
                        // insecure network
      sameSite: 'lax',  // Protect against CSRF
    });

    res.redirect('/dashboard');
  }
});

// Dashboard endpoint: Read and validate cookie
app.get('/dashboard', (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = SESSIONS.get(sessionId);

  if (!session) {
    // This is an invalid session ID
    res.redirect('/login');
    return;
  }

  // Update last active timestamp
  session.lastActive = Date.now();

  // Check session age
  const sessionAge = Date.now() - session.lastActive;
  if (sessionAge > 30 * 24 * 60 * 60 * 1000) { // 30 days
    SESSIONS.delete(sessionId);
    res.clearCookie('sessionId');
    res.redirect('/login');
    return;
  }

  res.render('dashboard', { username: session.username });
});

app.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  SESSIONS.delete(sessionId);
  res.clearCookie('sessionId');
  res.redirect('/login');
});
