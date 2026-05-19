<template>
  <div class="home-page">
    <!-- 横幅区域 -->
    <div class="bg-light py-5 text-center">
      <div class="container">
        <h1 class="mb-3">学会软件开发，点亮你的技能树</h1>
        <p class="text-muted mb-4">
          极客范(GeekFun)是一套完整的可扩展Web开发案例库。通过开发这个项目，可以学习到完整的Web开发相关技术环节，掌握完整的Web开发工具栈。
        </p>
        <div class="d-flex gap-3 justify-content-center">
          <router-link to="/products" class="btn btn-primary">查看产品</router-link>
          <router-link to="/orders" class="btn btn-outline-primary">查看订单</router-link>
        </div>
      </div>
    </div>

    <!-- 技术栈展示 -->
    <div class="container py-5">
      <div class="row g-4">
        <div class="col-md-3">
          <h5>前端框架</h5>
          <ul class="list-unstyled text-muted">
            <li>Vue.js</li>
            <li>Bootstrap5</li>
            <li>Vuex/Pinia</li>
            <li>Router</li>
            <li>Axios</li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5>C#</h5>
          <ul class="list-unstyled text-muted">
            <li>.NET Core 5.0</li>
            <li>ASP.NET Core 5.0</li>
            <li>EF Core 5.0</li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5>Python</h5>
          <ul class="list-unstyled text-muted">
            <li>Django</li>
            <li>Django Rest Framework</li>
            <li>Simple JWT</li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5>Java</h5>
          <ul class="list-unstyled text-muted">
            <li>JDK 1.8</li>
            <li>Spring Framework</li>
            <li>Spring Boot</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>