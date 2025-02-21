import React from 'react';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './routers/router'; // Đảm bảo đường dẫn đúng

function App() {
  return (
    <RouterProvider router={AppRouter} />
  );
}

export default App;