
# August Enthoven Assignment 1.2

**Online toy store web application**

---

This repository is a JavaScript/React web app that has the UI layout for an online toy store. Users are able to make an account and have their account details stored on MongoDB. When users are logged in they can find products and add them to their cart. Products added to a user's cart will be stored in MongoDB. Users can remove products from their cart or edit them.

---

**CI/CD Pipeline**

This project includes a .yml file in .github/workflows/ci.yml. This ensures that pushes to github are automatically checked for broken code using npm test. These tests are performed in the /backend/test/test.js file, checking things like adding a new item to the user's cart or removing an item from their cart.

---

**To Start the Project**

Run ``npm run dev`` in the root folder of the github repository. This will open the application in your browser at ``http://localhost:3000``.
