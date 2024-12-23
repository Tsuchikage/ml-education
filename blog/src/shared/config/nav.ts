import { MainNavItem } from "@shared/types/nav"

export interface NavConfig {
  mainNav: MainNavItem[]
}

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "Что такое машинное обучение?",
      href: "/lectures/what-is-machine-learning",
    },
    {
      title: "Основные типы задач в ML (Расширенная версия)",
      href: "/lectures/main-types-of-tasks-in-machine-learning",
    },
    {
      title: "Применение ML в реальном мире",
      href: "/lectures/machine-learning-applications-in-the-real-world",
    },
  ],
}
