import { UserData } from '@/types/storageTypes.ts'

export const getUserTemplate = () => {
  return {
    id: '',
    name: '',
    login: '',
    password: '',
    isAdmin: false,
    createdAt: '',
    lastLoginAt: '',
    updatedAt: '',
    yandexToken: '',
    yandexTokenLife: ''
  } as UserData
}

export const getUserData = () => {

  let userDataString = localStorage.getItem('user')
  let userDataJSON: UserData

  if (userDataString === null){
    userDataJSON = getUserTemplate()
  }else{
    userDataJSON = JSON.parse(userDataString)
  }

  return userDataJSON
}

export const saveUserData = (userData: UserData) => {
  localStorage.setItem('user', JSON.stringify(userData))
}

export const clearUserData = () => localStorage.clear()
