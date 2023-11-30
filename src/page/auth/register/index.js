import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useFormik } from 'formik';
import * as yup from 'yup'
import {lib} from '../../../util'
import { Spin, message } from 'antd'
import { useState } from 'react';


const Register = () => {
  const [load, setLoad] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const urls = lib.url
  const navigate = useNavigate()

  const initialValues = {
    name: '',
    email: '',
    address: '',
    password: ''
  }
  
  const handleSubmit = async (values) => {
    try {
      setLoad(true)
      const response = await axios.post(`${urls}/user/registration`, values , {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if(response.status === 200) {
        setLoad(false)
        navigate('/')

      } else {
        setLoad(false)
        messageApi.open({
          type: 'error',
          content: 'Network error',
        });
      } 

    } catch (err) {
      setLoad(false)
      messageApi.open({
        type: 'error',
        content: err.response.data.message,
      });
    }
  }  
  
  const validationSchema = yup.object({
    name: yup.string().required('This field required'),
    email: yup.string().required('This field required').email('Invalid format email'),
    address: yup.string().required('This field required'),
    password: yup.string().required('This field required')
                       .min(8, 'Password is too short - should be 8 chars minimum.')
                       .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  })

  const formMik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: validationSchema
  })


  return (
    <>
      {contextHolder}
      <div className="container mx-auto p-8 flex">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl text-center mb-12 font-thin">REGISTRATION</h1>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <div className="p-8">
                    <form onSubmit={formMik.handleSubmit}>
                      <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600">Name</label>
                        <input name='name'
                            value={formMik.values.name || ''} 
                            onChange={formMik.handleChange('name')}
                            status={formMik.errors.name && 'error'}
                            className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                        { formMik.errors.name && (
                            <h2 className='form-error'>{formMik.errors.name}</h2>
                        )}

                      </div>
                      <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Email</label>
                        <input name='email'
                            value={formMik.values.email || ''} 
                            onChange={formMik.handleChange('email')}
                            status={formMik.errors.email && 'error'}
                            className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                        { formMik.errors.email && (
                            <h2 className='form-error'>{formMik.errors.email}</h2>
                        )}
                      </div>
                      <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Adress</label>
                        <input name='address'
                            value={formMik.values.address || ''} 
                            onChange={formMik.handleChange('address')}
                            status={formMik.errors.address && 'error'}
                            className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                        { formMik.errors.address && (
                            <h2 className='form-error'>{formMik.errors.address}</h2>
                        )}
                      </div>
                      <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Password</label>
                        <input name='password'
                          type='password'
                          value={formMik.values.password || ''}
                          onChange={formMik.handleChange('password')}
                          status={formMik.errors.password && 'error'}
                          className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                        />
                        {formMik.errors.password && (
                            <h2 className='form-error'>{formMik.errors.password}</h2>
                        )}
                      </div>
                      <button type='submit' className="w-full p-3 mt-4 bg-indigo-600 text-white rounded shadow">Register</button>
                    </form>
                </div>
                <div className="flex justify-between p-8 text-sm border-t border-gray-300 bg-gray-100">
                    <Link to='/' className="font-medium text-indigo-500">Login</Link>
                </div>
              </div>
          </div>
          { load && 
            <div className="absolute inset-0 flex justify-center items-center z-10 bg-gray-400 bg-opacity-75">
              <Spin size="large" />
            </div>
          }

      </div>
    </>
  )
}

export default Register