import React, { useState } from 'react'

const AddTodo = ({addTodo}) => {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState( "Medium");

    const submit = (e) => {
        e.preventDefault();
        if (!title || !desc) {
            alert("Title or Description cannot be blank");
        }
        else {
            addTodo(title, desc, priority);
            setTitle("");
            setDesc("");
            setPriority("Medium");
        }
    };
    return (
        <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(131, 128, 194, 0.42)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        >
            <div className='container'> {/* Container for content width, removed my-3 */}
                <h3 style={{color: "white", marginBottom: '1.5rem'}}>Add a Todo</h3> {/* Added bottom margin to h3 */}
                <form onSubmit={submit}>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label" style={{fontSize: 20, fontWeight: 600, color: "white"}}>Todo Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" id="title" aria-describedby="emailHelp"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="desc" className="form-label" style={{fontSize: 20, fontWeight: 600, color: "white"}}>Todo Description</label>
                    <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="form-control" id="desc"/>
                </div>

                <div className="mb-3">
                    <div className="d-flex">
                        {['High', 'Medium', 'Low'].map((level) => (
                            <div className="form-check me-3" key={level}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={level}
                                    id={`priority${level}`}
                                    checked={priority === level}
                                    onChange={() => setPriority(level)}
                                    style={{cursor: 'pointer'}}
                                />
                                <label 
                                    className="form-check-label" 
                                    htmlFor={`priority${level}`} 
                                    style={{color: "white", cursor: 'pointer'}}
                                >
                                    {level}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn" style={{backgroundColor: "#7851A9", color: "white"}}>Submit</button>
                </form>
            </div>
        </div>
    )
};
export default AddTodo;
