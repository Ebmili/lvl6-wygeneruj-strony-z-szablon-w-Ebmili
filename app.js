const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const users = [];

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/new-user', (req, res) => {
  res.render('new-user');
});


app.get('/new-user/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(user => user.id === userId);
  const successMessage = req.query.successMessage;

  if (!user) {
    res.status(404).send('User not created');
  } else {
    res.render('user-details', { user, users, successMessage }); 
  }
});

app.get('/all-users', (req, res) => {
  res.render('all-users', { users });
});


app.post('/new-user', (req, res) => {
  const { name, surname } = req.body;
  const id = generateUniqueId();

  users.push({ id, name, surname, schedules: [] });

  const successMessage = "New user added successfully";

  res.redirect(`/new-user/${id}?successMessage=${successMessage}`);
});

app.get('/schedule-details', (req, res) => {
  const userId = req.query.id;
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    res.render('schedule-details', { user });
  }
});

app.post('/schedule-details', (req, res) => {
  const userId = req.body.userId;
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    res.redirect(`/schedule-details?id=${userId}`);
  }
});

app.get('/schedules', (req, res) => {
  const userId = req.query.id;
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    res.render('schedules', { user });
  }
});

app.get('/schedules/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    user.schedules = user.schedules || [];
    res.render('schedules', { user });
  }
});

app.post('/schedules', (req, res) => {
  const userId = req.body.userId;
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    const { visitDate, visitTime, visitPurpose } = req.body;
    user.schedules.push({ visitDate, visitTime, visitPurpose }); 

    res.redirect(`/schedules/${userId}`);
  }
});

app.get('/edit-user/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    res.render('edit-user', { user });
  }
});

app.post('/update-user/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(user => user.id === userId);

  if (!user) {
    res.status(404).send('User not found');
  } else {
    const { name, surname } = req.body;
    user.name = name;
    user.surname = surname;
    res.redirect('/all-users');
  }
});

app.post('/delete-user/:id', (req, res) => {
  const userId = req.params.id;
  const index = users.findIndex(user => user.id === userId);

  if (index !== -1) {
    users.splice(index, 1);
    res.redirect('/all-users');
  } else {
    res.status(404).send('User not found');
  }
});


function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});