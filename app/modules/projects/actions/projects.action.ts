'use server'

import { revalidatePath } from "next/cache"
import { safeAction } from "@/app/lib/errors/SafeActions"
import { ProjectsService } from "../projects.service"
import { formDataToObject, parseWithSchema } from "@/app/lib/forms/zod"
import { projectCreateServerSchema, projectUpdateServerSchema } from "../projects.schema"

export const createProject = safeAction(async (formData: FormData) => {
  const dto = parseWithSchema(projectCreateServerSchema, formDataToObject(formData));
  await ProjectsService.create(dto)

  revalidatePath('/dashboard', 'layout')
})


export const deleteProject = safeAction(async (id: string) => {
  await ProjectsService.delete(id)
  revalidatePath('/dashboard', 'layout')
})

export const updateProject = safeAction(async (id: string, formData: FormData) => {
  const dto = parseWithSchema(projectUpdateServerSchema, formDataToObject(formData));
  await ProjectsService.update(id, dto)
  revalidatePath('/dashboard', 'layout')
})
