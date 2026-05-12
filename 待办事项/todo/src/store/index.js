import { createStore } from 'vuex'

export default createStore({
  state: {
    todos: [],
    nextId: 1,
    showCompleted: true,
    filter: 'all' // all, todo, progress, done
  },
  mutations: {
    ADD_TODO(state, { title, desc }) {
      state.todos.push({
        id: state.nextId++,
        title,
        desc,
        completed: false,
        status: 'Todo' // Todo, In Progress, Done
      })
    },
    TOGGLE_COMPLETE(state, id) {
      const todo = state.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        todo.status = todo.completed ? 'Done' : 'Todo'
      }
    },
    SET_STATUS(state, { id, status }) {
      const todo = state.todos.find(t => t.id === id)
      if (todo) todo.status = status
    },
    DELETE_TODO(state, id) {
      state.todos = state.todos.filter(t => t.id !== id)
    },
    CLEAR_COMPLETED(state) {
      state.todos = state.todos.filter(t => !t.completed)
    },
    SET_SHOW_COMPLETED(state, val) {
      state.showCompleted = val
    },
    SET_FILTER(state, filter) {
      state.filter = filter
    },
    SET_TODOS(state, newTodos) {
      state.todos = newTodos
    }
  },
  getters: {
    filteredTodos: state => {
      const { filter, todos } = state
      switch (filter) {
        case 'todo': return todos.filter(t => t.status === 'Todo')
        case 'progress': return todos.filter(t => t.status === 'In Progress')
        case 'done': return todos.filter(t => t.status === 'Done')
        default: return todos
      }
    },
    total: state => state.todos.length,
    completedCount: state => state.todos.filter(t => t.completed).length
  }
})