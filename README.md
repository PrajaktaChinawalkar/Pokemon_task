## Assignment 2 - Pokémon Explorer

### Approach
For this assignment, I enhanced the Pokémon Explorer application by adding several advanced features:

- **Pagination**: I implemented pagination with configurable items per page (10, 20, 50). This was done by managing the page number and items per page through state and calculating the appropriate items to display on each page.
  
- **Sorting**: Sorting was added by allowing users to sort Pokémon by ID, name, and alphabetically. I used JavaScript’s `sort()` function to reorder the data based on the selected sorting criteria.

- **Filtering**: Filtering by multiple Pokémon types was implemented by allowing users to select multiple types and dynamically filter the list based on their selections. This was handled through React state and the `filter()` function.

- **Detailed View**: Each Pokémon has a detailed view showing all stats, abilities, moves, and its evolution chain. React Router was used to implement routing between the list and detailed views.

- **Favorites System**: I added a favorites system where users can mark Pokémon as favorites, which persist even after page refresh using `localStorage`.

- **Comparison Tool**: A comparison tool was added to allow users to compare the stats of two Pokémon side by side.

- **Random Pokémon**: A button was added to display a random Pokémon from the list.

### Challenges Faced
During the development of this application, I encountered a few challenges:

- **Handling Performance Optimizations**: Some performance issues arose when dealing with large datasets (e.g., sorting and filtering). To resolve this, I used `useMemo` and `useCallback` to optimize unnecessary re-renders of components.

- **Managing State Across Multiple Components**: Managing shared state across multiple components (like sorting, filtering, and pagination) was tricky. I resolved this by using the React Context API to pass state down to nested components without prop-drilling.

- **Ensuring Persistent Favorites**: Persisting the favorite Pokémon across page refreshes using `localStorage` was an interesting challenge, but I overcame it by writing custom hooks to interact with `localStorage`.

### Tools/Technologies Used
- **React**: The main framework used for building the application.
- **React Router**: For navigation between the list view and detailed view.
- **React Context API**: For managing state across multiple components.
- **localStorage**: To persist the favorites even after the page refreshes.
- **Custom Hooks**: For reusable logic, such as fetching data and managing favorites.
- **Vercel**: For deploying the application.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
