<template>
  <footer class="bg-light py-5 mt-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-3">
          <h5>关于极客范</h5>
          <p class="text-muted small">
            极客范(GeekFun)是一套完整的可扩展Web开发案例库，供广大学习者使用。通过开发这个项目，可以学习到完整的Web开发相关技术环节，掌握完整的Web开发工具栈。
          </p>
        </div>
        <div class="col-md-3">
          <h5>导航</h5>
          <ul class="list-unstyled text-muted small">
            <li><router-link to="/" class="text-muted">首页</router-link></li>
            <li><router-link to="/products" class="text-muted">产品</router-link></li>
            <li><router-link to="/orders" class="text-muted">订单</router-link></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5>近期文章</h5>
          <ul class="list-unstyled text-muted small">
            <li>茶杯与软件开发的温柔联系</li>
            <li>咖啡对软件开发的决定性作用</li>
            <li>杯子与容器的关系</li>
          </ul>
        </div>
        <div class="col-md-3">
          <h5>联系方式</h5>
          <ul class="list-unstyled text-muted small">
            <li>地址：北京市朝阳区北苑路13号</li>
            <li>电话：(800) 888-8888</li>
            <li>邮箱：666@888.cn</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>