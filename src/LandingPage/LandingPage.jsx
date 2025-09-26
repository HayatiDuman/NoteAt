import React from "react";
import "./LandingPage.css";
import mockup from "../assets/mockup.jpg"; // kendi görselini ekle

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>NoteAt ile Notlarınız Kontrol Altında</h1>
        <p>
          Ders notlarınızı, yapılacaklar listelerinizi ve projelerinizi tek bir
          yerden yönetin.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn">Ücretsiz Başla</button>
          <button className="secondary-btn">Demo’yu Gör</button>
        </div>
        <img src={mockup} alt="NoteAt Dashboard" className="hero-img" />
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Özellikler</h2>
        <div className="features-cards">
          <div className="feature-card">
            <h3>Farklı Not Türleri</h3>
            <p>Metin, yapılacaklar, tablo, resim.</p>
          </div>
          <div className="feature-card">
            <h3>Sürükle & Bırak</h3>
            <p>Notları kolayca organize edin.</p>
          </div>
          <div className="feature-card">
            <h3>Hızlı Arama</h3>
            <p>Aradığınızı anında bulun.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Kullanıcı Yorumları</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>
              "NoteAt ile ders notlarımı organize etmek hiç bu kadar kolay
              olmamıştı."
            </p>
            <span>- Ahmet K.</span>
          </div>
          <div className="testimonial-card">
            <p>"Projelerimi tek bir yerden yönetmek hayatımı kolaylaştırdı."</p>
            <span>- Elif S.</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Hemen Başlayın</h2>
        <p>NoteAt ile notlarınızı düzenleyin ve verimli olun.</p>
        <button className="primary-btn">Ücretsiz Başla</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 NoteAt. Tüm hakları saklıdır.</p>
        <div className="footer-links">
          <a href="#">Hakkımızda</a>
          <a href="#">Gizlilik Politikası</a>
          <a href="#">İletişim</a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
