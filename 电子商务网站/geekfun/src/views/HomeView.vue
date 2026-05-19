<template>
  <div class="home-page">
    <section class="hero">
      <div class="container">
        <h1>学会软件开发，点亮你的技能树</h1>
        <p>极客范是一套完整的可扩展Web开发案例库，帮助你掌握完整的Web开发工具栈。</p>
        <div class="hero-actions">
          <router-link to="/products" class="btn btn-primary">查看产品</router-link>
          <router-link to="/orders" class="btn btn-outline-primary">查看订单</router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>技术栈</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>前端框架</h3>
            <ul>
              <li>Vue.js</li>
              <li>Bootstrap 5</li>
              <li>Pinia</li>
              <li>Vue Router</li>
              <li>Axios</li>
            </ul>
          </div>
          <div class="feature-card">
            <h3>C#</h3>
            <ul>
              <li>.NET Core 5.0</li>
              <li>ASP.NET Core 5.0</li>
              <li>EF Core 5.0</li>
            </ul>
          </div>
          <div class="feature-card">
            <h3>Python</h3>
            <ul>
              <li>Django</li>
              <li>Django Rest Framework</li>
              <li>Simple JWT</li>
            </ul>
          </div>
          <div class="feature-card">
            <h3>Java</h3>
            <ul>
              <li>JDK 1.8</li>
              <li>Spring Framework</li>
              <li>Spring Boot</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 80px 0;
  background: var(--bg-secondary);
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.125rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto 32px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.hero-actions .btn {
  padding: 12px 32px;
  font-size: 1rem;
}

.features {
  padding: 64px 0;
}

.features h2 {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  background: var(--bg);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.feature-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-card ul li {
  font-size: 0.9rem;
  color: var(--text-light);
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.feature-card ul li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .hero {
    padding: 48px 0;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-actions .btn {
    width: 100%;
    max-width: 280px;
  }

  .features {
    padding: 40px 0;
  }
}
</style>
