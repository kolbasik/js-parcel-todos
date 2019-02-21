import React from "react";
import ReactDOM from "react-dom";

import styles from './todos.css';

class TotoList extends React.PureComponent {
    render() {
        return (
            this.props.todos.map(todo => (<Todo todo={todo} />))
        );
    }
}

class Todo extends React.PureComponent {
    render() {
        return (<span className={styles.main}>todo: {this.props.todo}</span>);
    }
}

export default {
    renderTo: root => {
        document.title = "Todos";
        ReactDOM.render(<TotoList todos={[]} />, root);
    }
};