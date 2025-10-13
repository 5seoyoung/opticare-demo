# opticare-demo

## Project Overview
`opticare-demo` is a React application that serves as a demonstration for building a modern web application using Vite and Tailwind CSS. This project showcases how to structure a React application and utilize Tailwind CSS for styling.

## Project Structure
```
opticare-demo
├── public
│   └── index.html          # Main HTML entry point
├── src
│   ├── App.jsx             # Main application component
│   ├── index.jsx           # Entry point for the React application
│   └── index.css           # Global CSS styles
├── package.json            # npm configuration file
├── vite.config.js          # Vite configuration file
├── tailwind.config.js      # Tailwind CSS configuration file
├── postcss.config.js       # PostCSS configuration file
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd opticare-demo
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm run dev
```
This will start the application and you can view it in your browser at `http://localhost:3000`.

### Building for Production
To create a production build, run:
```
npm run build
```
This will generate the optimized files in the `dist` directory.

## Usage
- Modify the `src/App.jsx` file to add your components and manage application state.
- Use `src/index.css` to apply global styles and import Tailwind CSS utilities.

## License
This project is licensed under the MIT License.