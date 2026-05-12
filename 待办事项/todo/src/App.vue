<template>
  <div class="todo-app">
    <div class="container">
      <h1><i class="fa-solid fa-list-check"></i> 待办事项</h1>

      <!-- 输入区域 -->
      <div class="add-todo">
        <input
          v-model="title"
          placeholder="输入任务标题"
          @keyup.enter="addTodo"
        />
        <input
          v-model="desc"
          placeholder="输入任务描述（可选）"
          @keyup.enter="addTodo"
        />
        <button @click="addTodo">
          <i class="fa-solid fa-plus"></i> 添加任务
        </button>
      </div>

      <!-- 筛选 & 控制 -->
      <div class="controls">
        <button @click="setFilter('all')" :class="{ active: $store.state.filter === 'all' }">全部</button>
        <button @click="setFilter('todo')" :class="{ active: $store.state.filter === 'todo' }">待办</button>
        <button @click="setFilter('progress')" :class="{ active: $store.state.filter === 'progress' }">进行中</button>
        <button @click="setFilter('done')" :class="{ active: $store.state.filter === 'done' }">已完成</button>
        <button @click="clearCompleted">清空已完成</button>
      </div>

      <!-- 统计 -->
      <div class="stats">
        总计：{{ total }} 个 | 已完成：{{ completedCount }} 个
      </div>

      <!-- 拖拽列表 -->
      <draggable
        v-model="filteredTodos"
        @update="handleDragUpdate"
        item-key="id"
        handle=".drag-handle"
        animation="200"
      >
        <template #item="{ element }">
          <div
            class="todo-item"
            :class="[
              element.status.toLowerCase(),
              { completed: element.completed }
            ]"
          >
            <span class="drag-handle"><i class="fa-solid fa-bars"></i></span>
            <input
              type="checkbox"
              :checked="element.completed"
              @change="toggleComplete(element.id)"
            />
            <div class="todo-content">
              <div class="title">{{ element.title }}</div>
              <div class="desc" v-if="element.desc">{{ element.desc }}</div>
            </div>

            <select
              :value="element.status"
              @change="e => setStatus(element.id, e.target.value)"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <button class="del" @click="deleteTodo(element.id)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import draggable from 'vuedraggable'

const store = useStore()
const title = ref('')
const desc = ref('')

const filteredTodos = computed(() => store.getters.filteredTodos)
const total = computed(() => store.getters.total)
const completedCount = computed(() => store.getters.completedCount)

const addTodo = () => {
  if (!title.value.trim()) return
  store.commit('ADD_TODO', { title: title.value, desc: desc.value })
  title.value = ''
  desc.value = ''
}

const toggleComplete = id => store.commit('TOGGLE_COMPLETE', id)
const setStatus = (id, status) => store.commit('SET_STATUS', { id, status })
const deleteTodo = id => store.commit('DELETE_TODO', id)
const clearCompleted = () => store.commit('CLEAR_COMPLETED')
const setFilter = filter => store.commit('SET_FILTER', filter)

const handleDragUpdate = evt => {
  store.commit('SET_TODOS', filteredTodos.value)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
.todo-app {
  max-width: 700px;
  margin: 30px auto;
  padding: 0 20px;
}
.container {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
.add-todo {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}
.add-todo input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.add-todo button {
  padding: 10px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.controls button {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}
.controls button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}
.stats {
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}
.todo-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #999;
  transition: all 0.2s;
}
.todo-item.todo { border-left-color: #ff6b6b; }
.todo-item.progress { border-left-color: #feca57; }
.todo-item.done { border-left-color: #48dbfb; }
.todo-item.completed .title {
  text-decoration: line-through;
  color: #999;
}
.drag-handle {
  margin-right: 8px;
  cursor: grab;
  color: #888;
}
.todo-content {
  flex: 1;
  padding: 0 10px;
}
.title { font-weight: 600; }
.desc { font-size: 12px; color: #666; margin-top: 3px; }
select {
  padding: 4px;
  margin-right: 8px;
  border-radius: 4px;
}
.del {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
}
</style>