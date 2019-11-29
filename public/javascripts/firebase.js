function firebaseLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

  // Open login pop-up
  firebase.auth().signInWithPopup(provider).then((result) => {
    if (result && result.user) {
      return result.user.getIdToken();
    }

    return Promise.reject();
  }).then((idToken) => {
    // Send the token to the server
    return fetch('/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ idToken })
    });
  }).then((response) => {
    if (response.ok) {
      window.location.href = '/files';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('#firebaseLogin');

  if (loginButton) {
    loginButton.addEventListener('click', firebaseLogin);
  }
})
