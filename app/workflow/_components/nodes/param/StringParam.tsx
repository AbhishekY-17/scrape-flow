import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/appNode';
import { TaskParam } from '@/types/task';
import React, { useEffect, useId, useState } from 'react'


function StringParam({ param, value, updateNodeParamValue, disabled}: ParamProps) {
  const [internalValue, setIntenalValue] = useState(value);
  const id = useId();

  useEffect(() => {
    setIntenalValue(value);
  }, [value]);

  let Component: any = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }
  
  return (
    <div className='space-y-1 p-1 w-full'>
      <Label htmlFor={id} className='text-xs flex'>
        {param.name}
        {param.required && (
          <p className='text-red-400 px-2'>*</p>
        )}
      </Label>
      <Component
      id={id} 
      disabled={disabled}
      className="text-xs"
      value={internalValue} 
      placeholder='Enter value here' 
      onChange={(e: any) => setIntenalValue(e.target.value)} 
      onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className='text-muted-foreground px-2'>{param.helperText}</p>
      )}

    </div>
  )
}

export default StringParam