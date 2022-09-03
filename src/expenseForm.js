import React, { useEffect, useRef, useState } from 'react'
import './App.css';

export const ExpenseForm = () => {
  const notes = useRef("")
  const date = useRef("")
  const category = useRef("")
  const amount = useRef(0)
  const incomeToSend = useRef(0)
  const [income, setIncome] = useState(0)
  const [list, setList] = useState([])

  var validate = function(e) {
    if (e.value.indexOf(".") != -1 && e.value.split(".")[1].length >=2){
        e.value = Number(e.value).toFixed(2)
   } 
    }

  useEffect(() => {
    const fetchApi = async() => {
      let res =await fetch(' http://localhost:5000/list', {
      method: "GET",
      headers:{
        "Accept": 'application/json',
        "mode":'no-cors',
        
      },
    }).then(r => r.json())
    .then(response => response)
    let res2 =await fetch(' http://localhost:5000/', {
      method: "GET",
      headers:{
        "Accept": 'application/json',
        "mode":'no-cors',
        
      },
    }).then(r => r.json())
    .then(response => response)
    console.log(res, "LIST")
    if (res && res2) {
      setList(res)
      setIncome(res2.accountBalance)
    }
    }
    fetchApi()
  }, [])
  const onSubmit =async () => {
    let res =await fetch(' http://localhost:5000/add', {
      method: "POST",
      headers:{
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          date:date.current,
          category:category.current,
          notes:notes.current,
          amount:amount.current
      } 
      )
    }).then(r => r.json())
    .then(response => response)
    if (res) {
      setList(prev => {
        return [...prev, res]
      })
    }
    console.log(res)    
  }

  const addIncome =async () => {
    if (Number(incomeToSend.current)< 0) return;
    let res =await fetch(' http://localhost:5000/addIncome', {
      method: "POST",
      headers:{
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          income:Number(incomeToSend.current)
      } 
      )
    }).then(r => r.json())
    .then(response => response)
    if (res) {
      setIncome(res.incomeBalance)
    }
    console.log(res)    
  }


  return (
    <div className="App">
      <div className='App-header'>
        Add your Daily Expenses
      </div>

     <div className='expenseForm'>
      <div className="container">
         <div>
          <div className="row">
            <div className="col-25">
              <label for="date">Enter Date</label>
            </div>
            <div className="col-75">
              <input onChange={(e) => date.current = e.target.value} type="date" id="date" name="date" placeholder="DD/MM/YYYY"/>
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label for="category">Category</label>
            </div>
            <div className="col-75">
              <select onChange={(e) => category.current = e.target.value} id="category" name="category">
                <option value="shoping">Shoping</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label for="notes">Notes</label>
            </div>
            <div className="col-75">
              <input onChange={(e) => notes.current = e.target.value} type="text" id="notes" name="notes" placeholder="Notes"/>
            </div>
          </div>
      
          <div className="row">
            <div className="col-25">
              <label for="amount">Amount</label>
            </div>
            <div className="col-75">
              <input onInput={validate} onChange={(e) => amount.current = e.target.value} type="number" id="amount" name="amount" placeholder='Enter Amount'/>
            </div>
          </div>
          <div className="row">
            <button onClick={onSubmit}>Add</button>
          </div>
        </div>
      </div>

       <div className='container'>
       <div className="row">
            <div className="col-25">
              <label for="income">Add Income</label>
            </div>
            <div className="col-75">
              <input type="number" onInput={(e)=>{
                if (e.value.indexOf(".") != -1 && e.value.split(".")[1].length >=2){
                  alert(e.value)
                  e.value = Number(e.value).toFixed(2)
             } 
              }} onChange={(e) => {
                incomeToSend.current = e.target.value
                //code here
                }} id="income" name="income" placeholder='Enter Amount'/>
              <input type = "submit" onClick={addIncome} value="Add Income"/>
            </div>
          </div>

          <div className='row'>
            <label for ="accountBalance">Account Balance:</label>
            <span>{income}</span>
          </div>
      </div>

      </div>

      <div className='expenseForm'>
        <table id="expense">
          <thead>
            <th>Date</th>
            <th>Category</th>
            <th>Notes</th>
            <th>Amount</th>
            <th>Closing Balance</th>
          </thead>
          {list.map(item => (<tr>
            <td>{item.date}</td>
            <td>{item.category}</td>
            <td>{item.notes}</td>
            <td>{item.amount}</td>
            <td>{item.closingBalance}</td>
          </tr>))}
        </table>
      </div>
    </div>
  )
}