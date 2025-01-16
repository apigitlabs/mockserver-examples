
/***************************************
 * 1) state
 ***************************************/
state = {
  clients: state.clients || [
    {
        client_id: 'client_1234',
        client_secret: 'client_secret_5678',
        redirect_uri: 'http://localhost:3001/callback'
      },
  ],
  codes: state.codes || {},   // { code: { client_id, user_id, expires } }
  tokens: state.tokens || {},  // { access_token: { client_id, user_id, expires } }
  users: state.users || [
    { id: faker.datatype.uuid(), username: 'alice', password: 'password123' },
    { id: faker.datatype.uuid(), username: 'bob',   password: 'password456' },
  ],
  session: state.session || {}
};

/***************************************
 * 2) Utility function to generate random strings
 ***************************************/
function generateRandomString(length = 32) {
  return faker.random.alphaNumeric(length);
}

/***************************************
 * 3) Login Page & Authentication
 ***************************************/
// GET /login - Simple login form
mock.get('/login', (req, res) => {
  res.send(`
    <h2>Mock IDP Login</h2>
    <form method="POST" action="/login">
      <label>Username: <input name="username" /></label><br/>
      <label>Password: <input type="password" name="password" /></label><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

// POST /login - Verify credentials, store user in session
mock.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = state.users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).send('Invalid credentials. <a href="/login">Try again</a>');
  }

  // Store user in session
  state.session.user = { id: user.id, username: user.username };
  res.send(`
    <p>Login successful. You are now logged in as <strong>${user.username}</strong>.</p>
    <p><a href="/oauth2/authorize?${state.session.lastQuery || ''}">Continue OAuth Flow</a></p>
  `);
});

/***************************************
 * 4) Authorization Endpoint (GET /oauth2/authorize)
 ***************************************/
mock.get('/oauth2/authorize', (req, res) => {
  const { client_id, redirect_uri, response_type, state: queryState } = req.query;

  // Check client exists
  const client = state.clients.find(c => c.client_id === client_id);
  if (!client) {
    return res.status(400).send('Unknown client_id');
  }

  // Check redirect URIs match
  if (client.redirect_uri !== redirect_uri) {
    return res.status(400).send('Invalid redirect_uri');
  }

  // If user not logged in, store query in session and redirect to /login
  if (!state.session.user) {
    state.session.lastQuery = new URLSearchParams(req.query).toString();
    return res.redirect('/login');
  }

  // For an Authorization Code flow, we generate a code
  if (response_type !== 'code') {
    return res.status(400).send('Unsupported response_type (only "code" supported here)');
  }

  const code = generateRandomString(8);
  state.codes[code] = {
    client_id: client_id,
    user_id: state.session.user.id,
    expires: Date.now() + 5 * 60 * 1000, // 5 min
  };

  // Redirect back to client with code (and state if provided)
  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set('code', code);
  if (queryState) {
    redirectUrl.searchParams.set('state', queryState);
  }

  return res.redirect(redirectUrl.toString());
});

/***************************************
 * 5) Token Endpoint (POST /oauth2/token)
 ***************************************/
mock.post('/oauth2/token', (req, res) => {
  const { grant_type, code, redirect_uri, client_id, client_secret } = req.body;

  // Validate client
  const client = state.clients.find(c => c.client_id === client_id && c.client_secret === client_secret);
  if (!client) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  if (grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'unsupported_grant_type' });
  }

  // Verify code
  const storedCode = state.codes[code];
  if (!storedCode) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // Check expiration
  if (storedCode.expires < Date.now()) {
    delete state.codes[code];
    return res.status(400).json({ error: 'code_expired' });
  }

  // Check client_id
  if (storedCode.client_id !== client_id) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // Issue access token
  const accessToken = generateRandomString(8);
  state.tokens[accessToken] = {
    client_id: client_id,
    user_id: storedCode.user_id,
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  };

  // We could issue a refresh token as well, but skipping for simplicity
  delete state.codes[code]; // one-time use

  return res.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'basic_profile',
  });
});

/***************************************
 * 6) Introspection Endpoint (POST /oauth2/introspect)
 ***************************************/
mock.post('/oauth2/introspect', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'invalid_request' });
  }

  const storedToken = state.tokens[token];
  if (!storedToken || storedToken.expires < Date.now()) {
    return res.json({ active: false });
  }

  return res.json({
    active: true,
    client_id: storedToken.client_id,
    user_id: storedToken.user_id,
    exp: Math.floor(storedToken.expires / 1000),
    scope: 'basic_profile',
  });
});

/***************************************
 * 7) Revocation Endpoint (POST /oauth2/revoke)
 ***************************************/
mock.post('/oauth2/revoke', (req, res) => {
  const { token } = req.body;
  if (state.tokens[token]) {
    delete state.tokens[token];
  }
  // Return 200 even if token not found, per RFC 7009
  return res.status(200).send();
});

/***************************************
 * 8) UserInfo Endpoint (GET /oauth2/userinfo)
 ***************************************/
mock.get('/oauth2/userinfo', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'invalid_request' });
  }

  const tokenValue = authHeader.slice('Bearer '.length);
  const storedToken = state.tokens[tokenValue];
  if (!storedToken || storedToken.expires < Date.now()) {
    return res.status(401).json({ error: 'invalid_token' });
  }

  // Get user info
  const user = state.users.find(u => u.id === storedToken.user_id);
  if (!user) {
    return res.status(401).json({ error: 'user_not_found' });
  }

  // Return a minimal JSON “profile”
  return res.json({
    sub: user.id,
    username: user.username,
    // Add more user claims if you like (e.g., email, name, etc.)
  });
});

