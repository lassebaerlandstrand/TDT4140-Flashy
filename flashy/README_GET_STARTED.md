# INSTALL NODE

### MacOS (Homebrew)
- [Install Node Version Manager (NVM)](https://tecadmin.net/install-nvm-macos-with-homebrew/)
- or [Install latest Node version](https://medium.com/@hayasnc/how-to-install-nodejs-and-npm-on-mac-using-homebrew-b33780287d8f)

### Windows
- I actually have no clue, but try to install node directly
[Install Node Version Manager (NVM)](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)

#### Note:
- required node V.20 or later

# Adding the firebase necessitites
Within /flashy
- Add the `firebase-secret-credentials.json`
    - Ask Mikael about this
- Create a new file called `env.local` and add the necessary values following the `env.local.example` file
    - Ask Mikael about this

# Running the development server
From the root environment:

- *Open a new terminal*
```bash
cd flashy
npm run dev
```

#### Note
- If this does not work, please contact either Mikael or Lasse