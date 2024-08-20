"use server"

import { LoginFormFields } from "@/lib/utils"
import axios from 'axios';

export const login = async (data: LoginFormFields) => {
  // console.log(data)

  // const formData = new FormData();
  // formData.append('json', JSON.stringify(data));
  // const url = `${process.env.NEXT_PUBLIC_URL}php/login.php`;
  
  // const response = await axios({
  //   url: url,
  //   method: "POST",
  //   data: formData,
  // })

  // const { message, error } = response.data;
  // console.log(message);
  // console.log(error);

  // return ({});

}