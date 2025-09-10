import React from 'react'
import TodoItem from "./TodoItem";

const Todos = (props) => {
  return (
    <div className='container my-3 text-light' style={
      {
        minHeight: "40vh", 
        margin: "40px auto", 
        fontWeight: 'bold'}
        }>
      <h3 className='my-3 text-light'>To Do List</h3>
      {props.todos.length===0? "No Task to do":
        props.todos.map((todo)=>{
          return (
          <>
          <TodoItem todo={todo} key={todo.sno} onDelete={props.onDelete}/> <hr/>
          </>
          )
        })
      }
    </div>
  );
};

export default Todos;
