import React from 'react'
import { ChatEngine } from 'react-chat-engine'
import { auth } from '../firebase/config'
import { useHistory } from 'react-router-dom'
import { useStateValue } from '../context/StateProvider'
import { useRef , useState , useEffect } from 'react'
import axios from 'axios'
import Header from '../Header'
const Chats = () => {
    const [{user} , dispatch]=useStateValue()
    const [Loading , setLoading] =useState(true)
    console.log(user)
    const history = useHistory()
    const handleLogOutt= async()=>{
        await auth.signOut()
        history.push('/')
    }
    const getFile = async (url)=>{
        const response = await fetch(url)
        const data = await response.blob()

        return new File([data], 'userPhoto.jpg',{type:'image/jqeg'})
    }
    useEffect(()=>{
        if(!user){
            history.push('/')
            return
        }
            axios.get('https://api.chatengine.io/users/me',{
                headers :{
                    'project-id' : '',
                    'user-name':user.email,
                    'user-secret':user.uid,
                }
            }).then(()=>{
                setLoading(false)
            }).catch(()=>{
                let formdata = new FormData()
                formdata.append('email', user.email)
                formdata.append('username', user.email)
                formdata.append('secret' , user.uid)

                getFile(user.photoURL).then((avatar)=>{
                    formdata.append('avatar',avatar , avatar.name)

                    axios.post('https://api.chatengine.io/users',
                    formdata ,
                    {headers:{'private-key':''}}
                    ).then(()=>setLoading(false)).catch((err)=>console.log(err))
                })
            })
    },[user , history])

    if(!user || Loading){
        return'Loading...'
    }
    return (
        <div className='chats-page'>
            <div className='nav-bar' >
                <div onClick={handleLogOutt} className="logo-tab"> <Header/></div>
                <div className="logout-tab"></div>
            </div>
            <ChatEngine
                height='calc(100vh-66px)'
                projectID = ''
                userName = {user.email}
                userSecret={user.uid}
            
            />
        </div>
    )
}

export default Chats
