"use server"

import { NextResponse } from "next/server"

import { RegisterFormFields } from "@/lib/utils"
import axios from "axios"

export const _register = async (data: RegisterFormFields) => {
  console.log(data)

  const formData = new FormData();
  formData.append('operation', 'addAccount');
  formData.append('json', JSON.stringify(data));
  const response = await axios({
    url: `${process.env.NEXT_PUBLIC_URL}php/accounts.php`,
    method: 'POST',
    data: formData
  })
  const result = response.data;

  const { message, error } = result;
  console.log(error)
  console.log(message)

  if (message) {
    return ({message: result.message})
  }
  else if (error) {
    return ({error: result.error})
  }
}