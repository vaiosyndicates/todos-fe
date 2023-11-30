import React from 'react'
import { Form, TimePicker, Button, Modal } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'
import { notification } from 'antd';
import axios from "axios";
import {lib} from '../../util'
import List from '../../component/List';
import Admin from '../admin';
const urls = lib.url

const format = 'HH:mm';
const tokens = JSON.parse(localStorage.getItem('token'));


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification()
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [role, setRole] = useState('')

  const [load, setLoad] = useState(true)
  const [task, setTask] = useState('')
  const [time, setTime] = useState('')
  const [data, setData ] = useState([])

  const [objModal, setObjModal] = useState({})
  const [taskUpd, setTaskUpd] = useState('')
  const [timeUpd, setTimeUpd] = useState('')


  useEffect(() => {
    
    if(load === true) {
      getTodo()
      checkRole()
    }  

  })

  const checkRole = async () => {
    const role = localStorage.getItem('role');
    const admin = 'ADMIN'
    const checkpw = await bcrypt.compare(admin, role)
    if(checkpw) {
      setRole('admin')
    } else {
      setRole('user')
    }
  }

  const getTodo = async () => {
  
    try {
      const items = JSON.parse(localStorage.getItem('token'));
      if(items !== null) {

        const res = await axios.get(`${urls}/todo`, {headers: {
          Authorization: `Bearer ${items}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }}) 

        if(res.data.responseCode === 200) {
          setLoad(false)
          setData(res.data.data)
          dispatch({type: 'SAVE_TODO', value: res.data.data })
        }
      }
    } catch (error) {
      api.open({
        message: 'Network Error',
        description:
          `${error.message}`,
        className: 'custom-class',
        style: {
          width: 600,
        },
      });
    }   
  }

  const submitTodo = async () => {
    const token = JSON.parse(localStorage.getItem('token')) 
    const value = {
      'task': task,
      'time': time,
    }
    // console.log(value)
    try {
      setLoad(true)
      const response = await axios.post(`${urls}/todo`, value , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })


      if(response.status === 200) {
        setLoad(false)
        getTodo()
      }
    } catch (error) {
      api.open({
        message: 'Network Error',
        description:
          `${error.message}`,
        className: 'custom-class',
        style: {
          width: 600,
        },
      });
      
    }
  }

  const handleChangeTitle = (event) =>{
    setTask(event.target.value)
  }

  const handleChangeTime = (event) => {
    setTime(event.target.value)
  }

  const testEdit = (data) => {
    setOpen(true)
    setObjModal(data)
  }

  const handleOk = async () => {
    // setConfirmLoading(true);

    const payload = {
      idArticle: `${objModal.id}`,
      task: taskUpd === '' ? objModal.task : taskUpd,
      time: timeUpd === '' ? objModal.time : timeUpd
    }


    try {
      const response = await axios.put(`${urls}/todo`, payload, { 
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });


      if(response.data.responseCode === 200) {
        setConfirmLoading(false);
        setOpen(false);
        getTodo()
      }

    } catch (error) {
      api.open({
        message: 'Network Error',
        description:
          `${error.message}`,
        className: 'custom-class',
        style: {
          width: 600,
        },
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChangeTitleUpd = (val) => {
    setTaskUpd(val)
  }

  const handleChangeTimeUpd = (val) => {
    setTimeUpd(val.target.value)
  }

  const handleDeleteTodo = async (data) => {

    try {
      const respDel = await axios.delete(`${urls}/todo`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: {
          idArticle: `${data.id}`
        }
      });


      if(respDel.data.responseCode === 200) {
        getTodo()
      }
    } catch (error) {
      api.open({
        message: 'Network Error',
        description:
          `${error.message}`,
        className: 'custom-class',
        style: {
          width: 600,
        },
      });
    }
  }

  const logOut = async () => {
    api.open({
      message: 'Logout',
      description:
        `Logout Success`,
      className: 'custom-class',
      style: {
        width: 600,
      },
    });
    
    setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userid')
      localStorage.removeItem('role')
      navigate(0)
    }, '2000');
  }

  if(role === 'admin') {
    return(
      <Admin />
    )
  } else {
    return (
      <>
      {contextHolder}
       <div className="flex items-center justify-center h-screen bg-zinc-800">
         <div className="w-full px-4 py-8 mx-auto shadow lg:w-3/6">
           <div className="flex justify-between">
              <div className='mb-6'>
                <h1 className="mr-6 text-4xl font-bold text-purple-600"> TO DO APP</h1>
              </div>
              <div className='mb-6'>
                <Button 
                     type="primary"
                     size='large'
                     className='bg-zinc-600 font-bold text-purple-500'
                     onClick={() => logOut()}
                     loading={load}
                   >
                     Logout
                   </Button>
              </div>
           </div>
           <Form>
             <div className="relative">
               <input 
                 type="text" 
                 name='task' 
                 placeholder="What needs to be done today?"
                 className="w-full px-2 py-3 border rounded outline-none border-grey-600 bg-zinc-600 placeholder-white"
                 onBlur={(event) => handleChangeTitle(event)}
               />
             </div>
             <div className="relative">
               <div className="flex items-center">
                 <div className="flex-1 w-72">
                   <TimePicker 
                     name='time' 
                     className="w-11/12 mt-2 px-2 py-3 border rounded outline-none border-grey-600 bg-zinc-600" 
                     defaultValue={dayjs('12:08', format)} 
                     format={format}
                     onBlur={(event) => handleChangeTime(event)}
                   />
                 </div>
                 <div className="flex-none">
                   <Button 
                     type="primary"
                     size='large'
                     className='bg-zinc-600 font-bold text-purple-500'
                     onClick={() => submitTodo()}
                   >
                     Submit
                   </Button>
                 </div>
               </div>
             </div>
           </Form>
           <List data={data} onClickEdit={(id, idUser, task, time) => testEdit({id, idUser, task, time})} onClickDel={(id, idUser) => handleDeleteTodo({id, idUser})} />
           <Modal
             title="Title"
             open={open}
             onOk={handleOk}
             confirmLoading={confirmLoading}
             onCancel={handleCancel}
           >
               <input 
                 type="text"
                 className='w-full px-2 py-3 border rounded outline-none border-grey-600 bg-zinc-600 placeholder-white'
                 placeholder={objModal.task} 
                 onChange={val => handleChangeTitleUpd(val.target.value)} />
 
               <TimePicker 
                 name='time' 
                 className="w-full mt-2 px-2 py-3 border rounded outline-none border-grey-600 bg-zinc-600" 
                 defaultValue={dayjs(`${objModal.time}`, format)} 
                 format={format}
                 onBlur={(val) => handleChangeTimeUpd(val)}
               />
           </Modal>
         </div>
       </div>
      </>
   )
  }
  
}

export default Dashboard