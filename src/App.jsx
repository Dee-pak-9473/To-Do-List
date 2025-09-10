import './App.css';
import Header from './MyComponents/Header';
import Todos from "./MyComponents/Todos";
import AddTodo from './MyComponents/AddTodo';
import About from "./MyComponents/About";
import React, {useState, useEffect} from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function AppContent() {
  const { theme } = useTheme();

  const lightModeVideo = '217486_medium.mp4';
  const darkModeVideo = 'todos-list/public/49252-459186552.mp4';
  const videoSrc = theme === 'light' ? lightModeVideo : darkModeVideo;

  // All the state and logic for todos will reside here
  let initTodo;
  if(localStorage.getItem("todos")===null){
    initTodo = []
  }
  else {
    initTodo = JSON.parse(localStorage.getItem("todos"));
  }

  const [todos, setTodos] = useState(initTodo);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const onDelete = (todo) => {
    console.log("I am onDelete of todo", todo);
    setTodos(todos.filter((e) => {
      return e !== todo;
    }));
  };

  const addTodo = (title, desc, priority) => {
    console.log("I am adding this todo", title, desc, priority);
    let sno;
    if(todos.length === 0){
      sno = 0;
    }
    else{
      sno = todos[todos.length - 1].sno + 1; 
    }
    const myTodo = {
      sno: sno,
      title: title,
      desc: desc,
      priority: priority,
    };
    setTodos([...todos, myTodo]);
    console.log(myTodo);

  };  

  return (
    <>
      <video
        key={videoSrc} // Important: Forces re-render when src changes
        autoPlay
        loop
        muted
        playsInline // Good practice for mobile compatibility
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          left: '50%',
          top: '50%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: -1, // Ensure it's in the background
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* This div ensures content is layered above the background video */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <BrowserRouter>
          <Header title="My Todos List" searchBar={false}/>
          <div style={{ flexGrow: 1}}>
            <Routes>
              <Route path = "/" element = {
                <>
                  <AddTodo addTodo={addTodo}/>
                  <Todos todos={todos} onDelete={onDelete}/>
                </>
              } />
              <Route path='about/*' element={<About/>} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App;
