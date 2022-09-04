import React, { useEffect, useRef, useState } from 'react'
import './App.css';

export const ExpenseForm = () => {
  const [data, setData] = useState({
    date: "",
    category: "shopping",
    notes: "",
    amount: "",
    incomeToSend: ""
  })
  
  const [income, setIncome] = useState(0)
  const [list, setList] = useState([])

  var validate = function(e) {
    if (e.target.value.indexOf(".") != -1 && e.target.value.split(".")[1].length >=2){
        e.target.value = Number(e.target.value).toFixed(2)
   } 
    }

  useEffect(() => {
    const fetchApi = async() => {
      let res =await fetch('http://13.235.18.137:5000/list', {
      method: "GET",
      headers:{
        "Accept": 'application/json',
        "mode":'no-cors',
        
      },
    }).then(r => r.json())
    .then(response => response)
    let res2 =await fetch('http://13.235.18.137:5000/', {
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
    let errorInFields = []
    Object.keys(data).forEach(item => {
      if ((!data[item] || data[item] === ".") && item !== "incomeToSend") {
        errorInFields.push(item[0].toUpperCase()+item.substring(1))
      }
    })
    if (errorInFields.length){ 
      alert(`Missing fields: ${errorInFields.toString().split(",").join(", ")}`)
      return
    }
    let res =await fetch(' http://13.235.18.137:5000/add', {
      method: "POST",
      headers:{
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          date:data.date,
          category:data.category,
          notes:data.notes,
          amount:data.amount
      } 
      )
    }).then(r => r.json())
    .then(response => response)
    if (res) {
      setIncome(prev => (prev - data.amount))
      setData({
        date: "",
        category: "",
        notes: "",
        amount: "",
        incomeToSend: ""
      })
      setList(prev => {
        return [...prev, res]
      })

    }
    console.log(res)    
  }

  const addIncome =async () => {
    if (Number(data.incomeToSend)< 0) return;
    let res =await fetch(' http://13.235.18.137:5000/addIncome', {
      method: "POST",
      headers:{
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          income:Number(data.incomeToSend)
      } 
      )
    }).then(r => r.json())
    .then(response => response)
    if (res) {
      setIncome(res.incomeBalance)
    }
    console.log(res)    
  }

  console.log(data, "data")

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
              <input value={data.date} onChange={(e) => setData(prev => ({...prev, date: e.target.value}))} type="date" id="date" name="date" placeholder="DD/MM/YYYY"/>
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label for="category">Category</label>
            </div>
            <div className="col-75">
              <select value={data.category} defaultValue={data.category} onChange={(e) => setData(prev => ({...prev, category: e.target.value}))} id="category" name="category">
                <option value="shopping">Shopping</option>
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
              <input value={data.notes} onChange={(e) =>  setData(prev => ({...prev, notes: e.target.value}))} type="text" id="notes" name="notes" placeholder="Notes"/>
            </div>
          </div>
      
          <div className="row">
            <div className="col-25">
              <label for="amount">Amount</label>
            </div>
            <div className="col-75">
              <input onInput={validate} value={data.amount}  onChange={(e) => setData(prev => ({...prev, amount: e.target.value}))} type="number" id="amount" name="amount" placeholder='Enter Amount'/>
            </div>
          </div>
          <div className="row">
            <input type='submit' value='Add Expense' onClick={onSubmit}/>
          </div>
        </div>
      </div>

       <div className='container'>
       <div className="row">
            <div className="col-25">
              <label for="income">Add Income</label>
            </div>
            <div className="col-75">
              <input type="number" value={data.incomeToSend} onInput={validate} onChange={(e) =>  setData(prev => ({...prev, incomeToSend: e.target.value}))} id="income" name="income" placeholder='Enter Amount'/>
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