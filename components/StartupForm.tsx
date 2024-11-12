"use client"
import React, { useActionState, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { z } from 'zod';
import { formSchema } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/action';
const StartupForm = () => {
    const [errors,setErrors]=useState<Record<string,string>>({});
    const [pitch, setPitch] = useState("");
    const {toast}=useToast();
    const router=useRouter();
    const handleSubmitForm=async(prevState:any,formData:FormData)=>{
    try {
      const formValues={
        title:formData.get('title')as string,
        description:formData.get('description')as string,
        category:formData.get('category')as string,
        link:formData.get('link')as string,
        pitch
      };
      
      await formSchema.parseAsync(formValues);
     
      const result=await createPitch(prevState,formData,pitch)
       
      if(result.status==='SUCCESS')
      {
        toast({
          title:"Success",
          description:"Your startup pitch has been created successfully",
        });
        router.push(`/startup/${result._id}`)
      }
      return result;
    } catch (error) {
      if(error instanceof z.ZodError)
      {
        const fieldErrors=error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string,string>);
        toast({
          title:"Error",
          description:"Please check your input and try again ",
          variant:"destructive"
        })
        return {...prevState,error:"validation failed",status:"ERROR"}
      }
      toast({
        title:"Error",
        description:"An unexpected error has occurred",
        variant:"destructive"
      });
      return {...prevState,error:"An unexpected error has occurred",status:"ERROR"}
    }
    }

   const [state,formAction,isPending]=useActionState(handleSubmitForm,{error:"",status:"INITIAL"});
  return (
   <form action={formAction} className='startup-form'>
   <div>
   <label htmlFor='title' className='startup-form_label'>Title</label>
   <Input
   id='title'
   name='title'
   placeholder=' Startup Title'
   required
   className='startup-form_input'
   />
   {errors.title&&<p className='startup-form_error'>{errors.title}</p>}
   </div>

   <div>
   <label htmlFor='description' className='startup-form_label'>Description</label>
   <Textarea
   id='description'
   name='description'
   placeholder='Short Description of your startup idea'
   required
   className='startup-form_textarea'
   />
   {errors.description&&<p className='startup-form_error'>{errors.description}</p>}
   </div>
   <div>
   <label htmlFor='category' className='startup-form_label'>Category</label>
   <Input
   id='category'
   name='category'
   placeholder=' Choose a Category(e.g., Tech, Education, Health etc)'
   required
   className='startup-form_input'
   />
   {errors.category&&<p className='startup-form_error'>{errors.category}</p>}
   </div>
   <div>
   <label htmlFor='link' className='startup-form_label'>Image Url</label>
   <Input
   id='link'
   name='link'
   placeholder=' Paste a link to your demo or promotional media'
   required
   className='startup-form_input'
   />
   {errors.link&&<p className='startup-form_error'>{errors.link}</p>}
   </div>

   <div>
   <label htmlFor='pitch' className='startup-form_label'>Pitch</label>
   <MDEditor
        value={pitch}
        onChange={(value)=>setPitch(value as string)}
        id='pitch'
        preview='edit'
        height={300}
        style={{borderRadius:20 ,overflow:"hidden"}}
        textareaProps={{
            placeholder:"Briefly describe your idea and what problem it solves "
        }}
        previewOptions={{
            disallowedElements:["style"]
        }}
      />
  
   {errors.pitch&&<p className='startup-form_error'>{errors.pitch}</p>}
   </div>
   <Button type='submit' className='startup-form_btn text-white'disabled={isPending}>
    {isPending?"Submitting..":"Submit your Pitch"}
    <Send className='size-6 ml-2' />
   </Button>
   </form>
  )
}

export default StartupForm