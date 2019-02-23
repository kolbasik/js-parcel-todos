// https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todomvc?from-embed

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

import { classnames } from './helpers';

let FILTERS = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_ACTIVE: 'SHOW_ACTIVE',
    SHOW_COMPLETED: 'SHOW_COMPLETED'
};

let FILTER_TITLES = {
    [FILTERS.SHOW_ALL]: 'All',
    [FILTERS.SHOW_ACTIVE]: 'Active',
    [FILTERS.SHOW_COMPLETED]: 'Completed'
};

class HtmlInput extends React.PureComponent {

    static propTypes = {
        value: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        saveOn: PropTypes.string,
        autoReset: PropTypes.bool
    }

    static defaultProps = {
        saveOn: "enter",
        autoReset: false
    }

    constructor(props) {
        super(props);
        let { value, onSave, saveOn, autoReset, ...attrs } = props;
        this.state = { value, onSave, saveOn, autoReset, attrs };
        this.state.saveOn = this.state.saveOn.split(" ");

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    handleKeyDown(e) {
        if (e.which === 13) {
            this.$save("enter", e.target.value);
        }
    }

    handleBlur(e) {
        this.$save("blur", e.target.value);
    }

    $save(event, value) {
        if (this.state.saveOn.includes(event)) {
            this.state.onSave({ event, value });
            if (this.state.autoReset) {
                this.setState({ value: this.props.value });
            }
        }
    }

    render() {
        return (
            <input {...this.state.attrs} value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} />
        );
    }
}

class TodoApp extends React.PureComponent {

    static propTypes = {
        todos: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired
        }))
    }

    constructor(props) {
        super(props);

        this.state = {
            todos: props.todos || [],
            filter: FILTERS.SHOW_ALL
        };

        this.actions = {
            addTodo: text =>
                this.setState(state => ({ ...state, todos: [...state.todos, { id: Date.now(), text: text, completed: false }] })),

            editTodo: (id, text) =>
                this.setState(state => ({ ...state, todos: state.todos.map(item => item.id === id ? {...item, editing: !text, text: text || item.text } : item)})),

            deleteTodo: id =>
                this.setState(state => ({ ...state, todos: state.todos.filter(item => item.id !== id) })),

            completeTodo: (id, completed) =>
                this.setState(state => ({ ...state, todos: state.todos.map(item => item.id === id ? {...item, completed} : item) })),

            completeTodos: () =>
                this.setState(state => ({ ...state, todos: state.todos.map(item => ({...item, completed: true})) })),

            deleteCompletedTodos: () =>
                this.setState(state => ({ ...state, todos: state.todos.filter(item => !item.completed) })),

            setFiler: filter =>
                this.setState(state => ({ ...state, filter }))
        };
    }

    componentDidMount() {
        document.title = "Todos";
    }

    render() {
        let todos = this.state.todos;
        let todosCount = todos.length;
        let activeCount = todos.filter(todo => !todo.completed).length;
        let completedCount = todosCount - activeCount;
        switch(this.state.filter) {
            case FILTERS.SHOW_ACTIVE: {
                todos = todos.filter(item => !item.completed);
                break;
            }
            case FILTERS.SHOW_COMPLETED: {
                todos = todos.filter(item => item.completed);
                break;
            }
        }
        let actions = this.actions;

        return (
            <div className="todoapp">
                <header className="header">
                    <h1>todos</h1>
                    <HtmlInput type="text" className={"new-todo"} placeholder="What needs to be done?"
                           autoFocus={true} autoReset={true} value={""} onSave={e => actions.addTodo(e.value)} />
                </header>
                <section className="main">
                    {
                        !!todosCount && <span>
                            <input type="checkbox" className="toggle-all" readOnly checked={completedCount === todosCount} />
                            <label onClick={actions.completeTodos}/>
                        </span>
                    }
                    <ul className="todo-list">
                        {todos.map(item => (<li key={item.id} className={classnames({ completed: item.completed, editing: item.editing })}>
                            {
                                !!item.editing
                                ?   <HtmlInput type="text" className={"edit"} autoFocus={true} value={item.text} saveOn={"enter blur"} onSave={e => actions.editTodo(item.id, e.value)} />
                                :   <div className="view">
                                        <input type="checkbox" className="toggle"
                                            checked={item.completed}
                                            onChange={e => actions.completeTodo(item.id, e.target.checked)} />
                                        <label onDoubleClick={() => actions.editTodo(item.id)}>{item.text}</label>
                                        <button className="destroy" onClick={() => actions.deleteTodo(item.id)} />
                                    </div>
                            }
                        </li>))}
                    </ul>
                    {
                        !!todosCount && <footer className="footer">
                            <span className="todo-count">
                                <strong>{activeCount || 'No'}</strong> {activeCount === 1 ? 'item' : 'items'} left
                            </span>
                            <ul className="filters">
                                {Object.keys(FILTERS).map(filter =>
                                    <li key={filter}>
                                        <a className={classnames({ selected: filter === this.state.filter })} style={{ cursor: 'pointer' }} onClick={() => actions.setFiler(filter)}>
                                            {FILTER_TITLES[filter]}
                                        </a>
                                    </li>
                                )}
                            </ul>
                            {
                                !!completedCount && <button className="clear-completed" onClick={actions.deleteCompletedTodos}>
                                    Clear completed
                                </button>
                            }
                        </footer>
                    }
                </section>
            </div>
        );
    }
}

export default {
    render: (todos, root) => ReactDOM.render(<TodoApp todos={todos} />, root)
};