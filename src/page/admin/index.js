import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import { lib } from '../../util';
import { useState } from 'react';
import { notification, Table as Tables, Popconfirm, Button, Space } from 'antd';
const urls = lib.url

const Admin = () => {
  const tokens = JSON.parse(localStorage.getItem('token'));
  const navigate = useNavigate()
  
  const [api, contextHolder] = notification.useNotification()

  const [load, setLoad] = useState(true)
  const [loader, setLoader] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    if(load) {
      getUsers()
    }
  })

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'isApprove',
      key: 'isApprove',
      render: (list, key) => {
        return (
          <a>{list === true  ? 'Active' : ' Inactive'}</a>
        )
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (list, key) => (
        <>
           <Space size="middle">
            <Popconfirm
              key={key}
              title="Update status"
              description="Active this user?"
              onConfirm={() => updateStatusUser(list.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                type: 'default',
                loading: loader
              }}
            >
              <Button className='bg-gray-600 text-slate-300' >Active / Deactive</Button>
            </Popconfirm>
          </Space>
          <Space size="middle">
            <Popconfirm
              key={key}
              title="Delete user"
              description="Are you sure to delete this user?"
              onConfirm={() => deleteUserd(list.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                type: 'default',
                loading: loader
              }}
            >
              <Button className='bg-gray-600 text-slate-300' >Delete</Button>
            </Popconfirm>
          </Space>
        </>
     
      ),
    },
  ];

  const getUsers = async () => {
    try {
      const response = await axios.get(`${urls}/admin`, { 
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if(response.status === 200) {
        setLoad(false)
        setData(response.data.data)
      }


    } catch (error) {
      setLoad(false)
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

  const updateStatusUser = async (idUser) => {
    try {
      const payload = {
        idUser: `${idUser}`,
      }

      const response = await axios.put(`${urls}/admin`, payload, { 
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if(response.status === 200) {
        setLoader(false)
        getUsers()
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
      localStorage.removeItem('refreshtoken')
      localStorage.removeItem('userid')
      localStorage.removeItem('role')
      navigate(0)
    }, '2000');
  }

  const deleteUserd = async (id) => {

    try {
      setLoader(true)
      const respDel = await axios.delete(`${urls}/admin`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: {
          idUser: `${id}`
        }
      });

      if(respDel.status === 200) {
        setLoader(false)
        getUsers()
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
  
  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-center h-screen bg-zinc-800">
        <div className="flex flex-col h-screen justify-center">
          <div className='flex justify-between mb-6'>
            <div>
              <h1 className="text-4xl font-bold text-purple-600"> Admin Dashboard</h1>
            </div>
            <div>
              <Button 
                type="primary"
                size='large'
                className='bg-zinc-600 font-bold text-purple-500'
                onClick={() => logOut()}
              >
                Logout
              </Button>
            </div>
          </div>
          <div className='flex'>
            <div>
              <Tables columns={columns} dataSource={data.length > 0 ? data : []} />
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Admin