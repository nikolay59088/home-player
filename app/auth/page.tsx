'use client'

import styles from './page.module.scss'
import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react'
import { saveUserData } from '@/lib/localStorage.ts'
import { useRouter } from 'next/navigation'

const Auth = () => {

  const [authData, setAuthData] = useState({
    formRegistration: false,
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    errorMessage: '',
    loading: false
  })

  const [activeServices, setActiveServices] = useState({
    yandex: false
  })

  const refDiv = useRef(null)
  const refEmail = useRef(null)
  const refForm = useRef(null)
  const router = useRouter()

  // useEffect(() => {
  //   fetch(window.origin + `/api/other/getBackgroundImage`)
  //     .then(res => res.json())
  //     .then(data => {
  //       const currDiv = refDiv.current || document.createElement('div')
  //       const parentDiv = currDiv.parentElement || document.createElement('div')
  //
  //       parentDiv.style.backgroundImage = `url("${data.image}")`
  //     })
  //
  // }, [])


  const readyWidget = () => {
    // @ts-ignore
    window.YaAuthSuggest.init({
        client_id: 'a541abbac4dd4b0bb3adefb9cd6dd6da',
        response_type: 'token',
        redirect_uri: 'https://oauth.yandex.ru/verification_code'
      },
      `https://127.0.0.1:3000`, {
        view: 'button',
        parentId: 'services',
        buttonView: 'icon',
        buttonTheme: 'dark',
        buttonSize: 'm',
        buttonBorderRadius: 5
      }).then((result: any )=> result.handler())
      .then((data: any) => console.log('Что-то есть: ' + data))
      .catch((err:any) => console.log('Ошибка: ' + err))
    setActiveServices({
      ...activeServices,
      yandex: true
    })
  }

  useEffect(() => {
    readyWidget()
  }, [])


  const changeValueForm = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthData({
      ...authData,
      [e.target.id]: e.target.value
    })
  }

  const changeTypeForm = () => {
    setAuthData({
      ...authData,
      formRegistration: !authData.formRegistration,
      errorMessage: ''
    })
  }

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    setAuthData({
      ...authData,
      loading: true
    })

    if (authData.password !== authData.confirmPassword && authData.formRegistration){
      setAuthData({
        ...authData,
        errorMessage: 'Пароли не совпадают',
        loading: false
      })
      return
    }

    if (authData.formRegistration){

      fetch(window.origin + `/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
          confirmPassword: authData.confirmPassword,
          name: authData.name
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success'){
            console.log('here')
            fetch(window.origin + `/api/users/me`)
              .then(res => res.json())
              .then(data => {
                saveUserData(data.user)
                router.push('/tracks')
              })
          }else{
            setAuthData({
              ...authData,
              errorMessage: data.message,
              loading: false
            })
          }
        })
    }else{
      fetch(window.origin + `/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: authData.email,
          password: authData.password
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success'){
            fetch(window.origin + `/api/users/me`, {
              headers: {
                'X-USER-TOKEN': data.token
              }
            })
              .then(res => res.json())
              .then(data => {
                saveUserData(data.user)
                router.push('/tracks')
              })
          }else{
            setAuthData({
              ...authData,
              errorMessage: 'Неправильный логин или пароль',
              loading: false
            })
          }
        })
    }
  }

  return (
    <div ref={refDiv} className={styles.authContainer}>
      {/*<Script*/}
      {/*  src='https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js'*/}
      {/*  strategy='afterInteractive'*/}
      {/*  onReady={readyWidget}*/}
      {/*  />*/}
      <script src='https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js'/>
      <div className={styles.authLeftPartContainer}>
        <h1>Добро пожаловать</h1>
        <p>Это экспериментальный плеер, предназначенный для личного использования</p>
      </div>
      <div className={styles.authRightPartContainer}>
        <form ref={refForm} className={styles.authFormContainer} onSubmit={submitForm}>
          <label htmlFor='email'>Логин</label>
          <input ref={refEmail} type='email' id='email'  value={authData.email} onChange={changeValueForm} placeholder='E-Mail' required/>
          <label htmlFor='password'>Пароль</label>
          <input type='password' id='password' value={authData.password} onChange={changeValueForm} placeholder='Пароль' required autoComplete='on'/>
          {
            authData.formRegistration
              ?
              <>
                <label htmlFor='confirmPassword'>Повторите пароль</label>
                <input type='password' id='confirmPassword' value={authData.confirmPassword} onChange={changeValueForm} placeholder='Пароль' required autoComplete='off'/>
                <label>Псевдоним</label>
                <input type='text' id='name' value={authData.name} onChange={changeValueForm} placeholder='Псевдоним' required/>
              </>
              : null
          }
          {
            authData.errorMessage.length > 0 && <p className={styles.errorMessage}>{authData.errorMessage}</p>
          }

          <div className={styles.authFormButtons}>
            <input readOnly={authData.loading} type='button' value={authData.formRegistration ? 'Вход' : 'Регистрация'} onClick={changeTypeForm}/>
            <input readOnly={authData.loading} type='submit' value={authData.loading ? 'Loading' : authData.formRegistration ? 'Зарегистрироваться' : 'Войти'}/>
          </div>
          <div id='services' className={styles.authServicesContainer}>
            <p>Войти c помощью</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth
