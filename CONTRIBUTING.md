# Contributing to Form Filler

Thank you for your interest in contributing to Form Filler! We welcome contributions from everyone. By participating in this project, you help make form testing easier for developers and testers worldwide.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (LTS version recommended).
- **npm**: Comes with Node.js.

### Installation

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/thuyydt/formfiller.git
    cd formfiller
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## 🛠 Development Workflow

### Running in Development Mode

To start the build process in watch mode (rebuilds on file changes):

```bash
npm run dev
```

### Loading the Extension

#### Google Chrome / Edge / Brave
1.  Open `chrome://extensions/`.
2.  Enable **Developer mode** (top right).
3.  Click **Load unpacked**.
4.  Select the `dist-chrome` folder (created after running the build).

#### Firefox
1.  Open `about:debugging#/runtime/this-firefox`.
2.  Click **Load Temporary Add-on...**.
3.  Select the `manifest.json` file inside the `dist-firefox` folder.

#### Safari
See [SAFARI_EXTENSION_GUIDE.md](./SAFARI_EXTENSION_GUIDE.md) for specific instructions.

## 📁 Project Structure

- **`components/`**: UI components for the Options page and popup.
- **`forms/`**: Logic for filling different types of form inputs (inputs, selects, textareas).
- **`helpers/`**: Utility functions, AI detection logic, and data generators.
- **`data/`**: Static data and patterns used for field detection.
- **`lib/`**: Core libraries (Faker, Randomizer).
- **`tests/`**: Unit and integration tests.

## 🧪 Quality Control

Before submitting a Pull Request, please ensure your code meets our quality standards.

### Linting & Formatting

We use ESLint and Prettier to maintain code quality.

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code
npm run format
```

### Type Checking

Ensure there are no TypeScript errors:

```bash
npm run type-check
```

### Testing

Run the test suite to make sure your changes don't break existing functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Check test coverage
npm run test:coverage
```

## 📝 Submitting a Pull Request

1.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
2.  **Commit your changes** with clear, descriptive messages.
3.  **Push to your fork**:
    ```bash
    git push origin feature/amazing-feature
    ```
4.  **Open a Pull Request** on the main repository.
    -   Describe your changes clearly.
    -   Link to any relevant issues.
    -   Attach screenshots or GIFs if your changes affect the UI or behavior.

## 🐛 Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub.
-   **Bugs**: Include steps to reproduce, expected behavior, and browser version.
-   **Features**: Describe the use case and why it would be valuable.

Thank you for contributing! 🎉
