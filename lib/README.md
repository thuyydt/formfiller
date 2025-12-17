# Custom Faker.js Build

This directory contains a lightweight, custom build of [Faker.js](https://github.com/faker-js/faker) tailored for the Form Filler extension.

## Why not use the npm package?

The full `faker` npm package is quite large and includes many locales and data sets that are not needed for this extension. To keep the extension size minimal and performance high, we have included only the necessary modules and definitions required for form filling.

## Contents

- Core Faker logic
- Selected locales (e.g., English, Japanese)
- Specific modules relevant to form inputs (Person, Internet, Address, etc.)
