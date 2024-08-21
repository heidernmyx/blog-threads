"use server"

import { LoginFormFields } from "@/lib/utils"
import axios from 'axios';

export const Logout = async () => {
  const formData = new FormData();
  formData.append('operation', 'logout');
}