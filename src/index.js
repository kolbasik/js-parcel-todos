import todos from './todos';

const TODOS = [
    {
        id: 1,
        text: '123',
        completed: false
    },
    {
        id: 2,
        text: 'qwe',
        completed: true
    },
    {
        id: 3,
        text: 'asd',
        completed: false
    }
];

todos.render(TODOS, document.querySelector(".app"));