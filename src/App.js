import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, Stacked, Pyramid, Customers, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor } from './pages';
import { Login, Register } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useStateContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { 
    setCurrentColor, 
    setCurrentMode, 
    currentMode, 
    activeMenu, 
    currentColor, 
    themeSettings, 
    setThemeSettings,
    user 
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {user && (
            <>
              <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                <TooltipComponent content="Settings" position="Top">
                  <button
                    type="button"
                    onClick={() => setThemeSettings(true)}
                    style={{ background: currentColor, borderRadius: '50%' }}
                    className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                  >
                    <FiSettings />
                  </button>
                </TooltipComponent>
              </div>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
            </>
          )}
          
          <div className={
            user
              ? activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full'
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2'
              : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
          }>
            {user && (
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                <Navbar />
              </div>
            )}
            <div>
              {themeSettings && <ThemeSettings />}

              <Routes>
                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/" replace /> : <Login />} 
                />
                <Route 
                  path="/register" 
                  element={user ? <Navigate to="/" replace /> : <Register />} 
                />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />
                <Route path="/ecommerce" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />

                {/* Pages */}
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                {/* <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} /> */}
                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />

                {/* Apps */}
                <Route path="/kanban" element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
                <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/color-picker" element={<ProtectedRoute><ColorPicker /></ProtectedRoute>} />

                {/* Charts */}
                <Route path="/line" element={<ProtectedRoute><Line /></ProtectedRoute>} />
                <Route path="/area" element={<ProtectedRoute><Area /></ProtectedRoute>} />
                <Route path="/bar" element={<ProtectedRoute><Bar /></ProtectedRoute>} />
                <Route path="/pie" element={<ProtectedRoute><Pie /></ProtectedRoute>} />
                <Route path="/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
                <Route path="/color-mapping" element={<ProtectedRoute><ColorMapping /></ProtectedRoute>} />
                <Route path="/pyramid" element={<ProtectedRoute><Pyramid /></ProtectedRoute>} />
                <Route path="/stacked" element={<ProtectedRoute><Stacked /></ProtectedRoute>} />

                {/* Redirect unmatched routes to login */}
                <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
              </Routes>
            </div>
            {user && <Footer />}
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
