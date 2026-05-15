import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { FAQ } from './pages/FAQ';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { Login } from './pages/Login';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route path="product/:productId" element={<ProductPage />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="shipping" element={<ShippingPolicy />} />
            <Route path="returns" element={<ReturnPolicy />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={
              <div className="container text-center section-padding" style={{minHeight: '50vh'}}>
                <h2>Coming Soon</h2>
                <p>This page is under construction.</p>
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
