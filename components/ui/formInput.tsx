import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from './input'

function FormInput({ control, placeholder, label, fieldName, type = 'text' }) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormInput