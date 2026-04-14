import api from './api'
import type { Course, Section, SectionContent, Progress } from '../types'

export const getCourses = (): Promise<Course[]> =>
  api.get('/courses').then((r) => r.data)

export const getSections = (courseId: number): Promise<Section[]> =>
  api.get(`/courses/${courseId}/sections`).then((r) => r.data)

export const getSectionContent = (sectionId: number): Promise<SectionContent> =>
  api.get(`/sections/${sectionId}/content`).then((r) => r.data)

export const getProgress = (): Promise<Progress[]> =>
  api.get('/progress').then((r) => r.data)

export const markComplete = (sectionId: number): Promise<Progress> =>
  api.post('/progress', { section_id: sectionId }).then((r) => r.data)
