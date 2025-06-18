# What to do after cloning :)

To run the website on your localhost:
  
  ```
  cd project-bitchboy
  npm install
  npm run dev
  ```
## Firebase setup

### 1. Create a Firebase Project on the Firebase Console

- Go to [Firebase Console](https://console.firebase.google.com/u/0/).
- Click "Create a Firebase project".
- Enter project name (Bitchboy-Email, or whatever best for you to identify it) and follow the prompts.
- You can diable Goodgle Analytics as the database is not that complex (It is also fine to keep it).
- Click "Create Project" and wait for it to load.

### 2. Add Web App to the Firebase Project

- In the Firebase dashboard (Project Overview), click the </> web icon.
- Register the app name.
- You will see a generated config for your Firebase, copy that and save it somewhere safe.
- Skip hosting setup for now unless you want to use Firebase Hosting.

### 3. Initialize Firebase in the code

- Install Firebase
```
npm instal firebase
```
- Replace [firebaseConfig.js](/project-bitchboy/firebase/firebaseConfig.js) with the copied config above. 
- Since the config does not have the import for Firestore, add this to [firebaseConfig.js](/project-bitchboy/firebase/firebaseConfig.js)
```
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app);
export { db };
```

### 4. Enable Firestore in Firebase Console

- In the Firebase Console, go to Build > Firestore Database.
- Click Create database.
- Choose server location.
- Choose Start in test mode (safe for dev/testing — you can tighten rules later).
- You can now start a collection and if you want to keep the code we wrote, you can name the collection `emails` having `email` and `timestamp`.

### 5. Extending the database

- You can add more collection depending on future's need. Or even using other storing services if you want to expand the database.
- You can find all information from the [Firebase documentation](https://firebase.google.com/docs).

# Credits

Saxion students team who contributed to the project:

[Andre Nguyen](https://github.com/nguyentuannguyenan)

[Syandana Radithya Suntana](https://www.linkedin.com/in/syandana-suntana-4bb58727b/)

[David Maddin](https://www.linkedin.com/in/david-maddin-561999191/)

[Bao Anh Nguyen](https://www.linkedin.com/in/bao-anh-nguyen-2b931335a/)

Amir Bayat

Mykyta Golubov
