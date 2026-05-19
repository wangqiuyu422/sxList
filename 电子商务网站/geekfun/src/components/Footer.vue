<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>GeekFun</h3>
          <p>极客范是一套完整的可扩展Web开发案例库，供广大学习者使用。</p>
        </div>
        <div class="footer-section">
          <h4>导航</h4>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/products">产品</router-link></li>
            <li><router-link to="/orders">订单</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <ul>
            <li>北京市朝阳区北苑路13号</li>
            <li>(800) 888-8888</li>
            <li>666@888.cn</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 GeekFun. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  padding: 48px 0 24px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.footer-section h3 {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.footer-section h4 {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 12px;
}

.footer-section p {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-light);
  margin-bottom: 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 8px;
}

.footer-section ul li:last-child {
  margin-bottom: 0;
}

.footer-section ul li a {
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section ul li a:hover {
  color: var(--text-h);
}

.footer-bottom {
  text-align: center;
}

.footer-bottom p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .footer {
    padding: 32px 0 16px;
  }

  .footer-content {
    gap: 24px;
    margin-bottom: 24px;
    padding-bottom: 24px;
  }
}
</style>
