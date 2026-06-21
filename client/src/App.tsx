import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Footer } from './components';
import {
  LandingPage,
  ProductsPage,
  CartPage,
  CheckoutPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  AboutPage,
  FAQPage,
  ProfilePage,
  OrdersPage,
  AdminPage,
} from './pages';
import { useAuthStore } from './store';

function App() {
  const { setAuthFromStorage } = useAuthStore();

  useEffect(() => {
    setAuthFromStorage();
  }, [setAuthFromStorage]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light dark:bg-surface-950 transition-colors duration-300">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
