// import logo from './logo.svg';
// import './App.css';
// import axios from "axios"; 
// import { useState,useEffect } from 'react';  

// function App() {
//   const [data,setData]=useState([1])
//   const [title1,setTitle1]=useState('')
//   const API="http://localhost:5000/api/tasks" 
//   useEffect(()=>{
//     axios.get(API).then(res=>{console.log(res); setData(res.data)}).catch(err=>{console.log(err)})
//   },[])
//   const addTask=()=>{
//     axios.post(API,{title:title1,completed:true}).then(res=>{console.log(res); setData(prev=>[...prev,res.data])}).catch(err=>{console.log(err)})
//   }
//   return (
//     <div className="App">
//         {console.log(data)}
//         Task:<input name='task' onChange={(e)=>{setTitle1(e.target.value)}} value={title1}/>
//         <button onClick={addTask}>add</button>
//         <table>
//           <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>title</th>
//           <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>studentName</th>
//           <th style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>percentage</th>
//           {data.map(item=>(<>
//           <tr key={item.id}>
//             <td style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}> {item?.title} </td>
//             <td style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}> {item.studentName} </td>
//             <td style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}> {item.percentage} </td>
//             </tr>
//           </>
//         ))}</table>
//     </div>
//   );
// }

// export default App;
// App.js (Routing Setup)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MoodDetail from './components/MoodDetail';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood/:id" element={<MoodDetail />} /> {/* URL Param Route */}
      </Routes>
    </Router>
  );
}
export default App;
