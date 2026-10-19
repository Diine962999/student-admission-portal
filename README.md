# Student Admission Portal

A responsive front-end admission portal built with HTML, CSS and vanilla JavaScript.

## Features
- Validates full name, email, phone number, age, department and password.
- Prevents duplicate matriculation numbers and email addresses (case-insensitive).
- Shows field-specific validation messages.
- Displays registered students in a searchable table.
- Shows the total number of registered students.
- Supports deleting one record or clearing all records.
- Saves demo records in the browser's `localStorage`.
- Does not display or save the password.

## Run locally
1. Download and extract this folder.
2. Open `index.html` in a modern browser.
3. Register sample students to test validation and the table.

No build tools or dependencies are required.

## Deploy to GitHub Pages
1. Sign in to GitHub and create a new **public** repository, for example `student-admission-portal`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/(root)`, then save.
6. Wait for GitHub Pages to publish the site. The published URL will look like `https://YOUR-USERNAME.github.io/student-admission-portal/`.
7. Submit that live URL and your repository URL according to your class's required submission format.

## Important limitation
This is a learning/demo project, not a production admission system. Browser `localStorage` is local to one browser/device and can be edited or cleared by the user. Duplicate checks only apply to records saved in that browser. A real portal needs a server/API and database with unique constraints, secure password hashing, authentication, authorization, and privacy protections. Never use this demo to collect real student passwords or sensitive personal data.
